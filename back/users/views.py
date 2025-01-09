from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth import authenticate
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import IsAdminUser
from .models import CustomUser, BucketList
from .serializers import UserSerializer, BucketListSerializer
import logging
from places.models import Place

logger = logging.getLogger(__name__)

GOOGLE_CLIENT_IDS = [
    "119778560119-vdasr532tr43s0uoggbtqbo8a8gg6svg.apps.googleusercontent.com", #default web
    "119778560119-iso4ufo35fp3cippa9p7s9ab45vu7lbv.apps.googleusercontent.com", #ios
    "119778560119-android123xyz.apps.googleusercontent.com",
]

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='User password'),
            'repeat_password': openapi.Schema(type=openapi.TYPE_STRING, description='Confirm user password'),
        },
        required=['email', 'password', 'repeat_password'],
    ),
    responses={200: 'User registered successfully', 400: 'Bad request', 409: 'User already exists'},
)
@api_view(['POST'])
def register_user(request):
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')
        repeat_password = data.get('repeat_password')

        if not email or not password or not repeat_password:
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        if password != repeat_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'User already exists'}, status=status.HTTP_409_CONFLICT)

        user = CustomUser.objects.create_user(email=email, password=password, username=email)
        serialized_user = UserSerializer(user).data
        return Response({'message': 'User registered successfully', 'user': serialized_user}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in register_user: {e}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='User password'),
        },
        required=['email', 'password'],
    ),
    responses={200: 'User logged in successfully', 401: 'Invalid credentials'},
)
@api_view(['POST'])
def login_user(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')
    user = authenticate(email=email, password=password)
    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    serialized_user = UserSerializer(user).data
    return Response({'message': 'Login successful', 'user': serialized_user}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'token': openapi.Schema(type=openapi.TYPE_STRING, description='Google ID token'),
        },
        required=['token'],
    ),
    responses={200: 'Google login successful', 400: 'Invalid ID token'},
)
@api_view(['POST'])
def google_login_register(request):
    token = request.data.get('token')
    logger.info(f"Token: {token}")
    if not token:
        return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        id_info = id_token.verify_oauth2_token(token, google_requests.Request())
        if id_info['aud'] not in GOOGLE_CLIENT_IDS:
            return Response({'error': 'Invalid client ID'}, status=status.HTTP_403_FORBIDDEN)
        email = id_info.get('email')
        given_name = id_info.get('given_name', '')
        family_name = id_info.get('family_name', '')
        picture = id_info.get('picture', '')
        created = CustomUser.objects.filter(email=email).exists()
        logger.info(f"User {email} is {created}")
        if not created: 
            user = CustomUser.objects.create(email=email, username=email)
        elif created:
            user = CustomUser.objects.get(email=email)
        serialized_user = UserSerializer(user).data
        return Response({'message': 'User logged in' if not created else 'New user created', 'user': serialized_user, 'is_profile_complete': not created}, status=status.HTTP_200_OK)
    except ValueError:
        return Response({'error': 'Invalid ID token'}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='get',
    responses={200: 'Profile retrieved successfully', 404: 'User not found'},
)
@swagger_auto_schema(
    method='put',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='New username'),
            'given_name': openapi.Schema(type=openapi.TYPE_STRING, description='User first name'),
            'family_name': openapi.Schema(type=openapi.TYPE_STRING, description='User last name'),
            'bio': openapi.Schema(type=openapi.TYPE_STRING, description='User bio'),
            'profile_picture': openapi.Schema(type=openapi.TYPE_FILE, description='Profile picture'),
        },
    ),
    responses={200: 'Profile updated successfully', 400: 'Invalid data'},
)
@api_view(['GET', 'PUT'])
def user_profile(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serialized_user = UserSerializer(user).data
        return Response(serialized_user, status=status.HTTP_200_OK)
    elif request.method == 'PUT':
        data = request.data
        user.username = data.get('username', user.username)
        user.given_name = data.get('given_name', user.given_name)
        user.family_name = data.get('family_name', user.family_name)
        user.bio = data.get('bio', user.bio)
        if 'profile_picture' in request.FILES:
            user.profile_picture = request.FILES['profile_picture']
        user.save()
        serialized_user = UserSerializer(user).data
        return Response({'message': 'Profile updated successfully', 'user': serialized_user}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    responses={200: 'List of all users'},
)
@api_view(['GET'])
def list_users(request):
    users = CustomUser.objects.all()
    serialized_users = UserSerializer(users, many=True).data
    return Response(serialized_users, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='delete',
    responses={200: 'User deleted successfully', 404: 'User not found'},
)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(
    method='get',
    responses={200: openapi.Response('User details retrieved successfully', schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID'),
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
            'bio': openapi.Schema(type=openapi.TYPE_STRING, description='User bio'),
            'profile_picture': openapi.Schema(type=openapi.TYPE_STRING, description='Profile picture URL'),
        }
    )), 404: 'User not found'},
)
@api_view(['GET'])
def get_user_details(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        serialized_user = UserSerializer(user).data
        return Response(serialized_user, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    

# Bucket List API

@swagger_auto_schema(
    method='get',
    responses={200: 'List of all user bucket list'},
)
@api_view(['GET'])
def user_bucket_list(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        bucket_list = BucketList.objects.filter(user=user)
        serialized_bucket_list = BucketListSerializer(bucket_list, many=True).data
        return Response({'bucket_list': serialized_bucket_list}, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(
    method='put',
    descriptio='Complete item from user bucket list',
    responses={200: 'Item completed successfully', 404: 'User or item not found'},
)
@api_view(['PUT'])
def complete_bucket_list_item(request, item_id):
    try:
        item = BucketList.objects.get(id=item_id)
        item.visited = True
        item.save()
        return Response({'message': 'Item completed successfully'}, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except BucketList.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
@swagger_auto_schema(
    method='delete',
    responses={200: 'Item deleted successfully', 404: 'User or item not found'},
)
@api_view(['DELETE'])
def delete_bucket_list_item(request, item_id):
    try:
        item = BucketList.objects.get(id=item_id)
        item.delete()
        return Response({'message': 'Item deleted successfully'}, status=status.HTTP_200_OK)
    except BucketList.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'added_at': openapi.Schema(type=openapi.TYPE_STRING, description='Item added date'),
            'visited': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Item status'),
        },
        required=['name', 'description'],
    ),
    responses={200: 'Item added successfully', 404: 'User not found'},
)
@api_view(['POST'])
def add_bucket_list_item(request, user_id, place_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        place = Place.objects.get(id=place_id)
        data = request.data
        added_at = data.get('added_at')
        visited = data.get('visited', False)
        bucket_list_item = BucketList(user=user, place=place, added_at=added_at, visited=visited)
        bucket_list_item.save()
        return Response({'message': 'Item added successfully'}, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
