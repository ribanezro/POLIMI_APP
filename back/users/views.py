from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .models import CustomUser  # Assuming you use a CustomUser model
from django.conf import settings
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import permission_classes

GOOGLE_CLIENT_IDS = [
    "119778560119-vdasr532tr43s0uoggbtqbo8a8gg6svg.apps.googleusercontent.com",  # Web
    "119778560119-iso4ufo35fp3cippa9p7s9ab45vu7lbv.apps.googleusercontent.com",  # iOS
    "119778560119-android123xyz.apps.googleusercontent.com",                    # Android
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
    operation_description='Register a new user',
    responses={
        200: 'User registered successfully',
        400: 'Bad request, e.g., mismatched passwords or invalid email',
        409: 'User already exists',
    },
)
@api_view(['POST'])
def register_user(request):
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

    user = CustomUser.objects.create_user(email=email, password=password, username=email.split('@')[0])
    return Response({'message': 'User registered successfully', 'user_id': user.id}, status=status.HTTP_200_OK)

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
    operation_description='Log in a user',
    responses={
        200: 'User logged in successfully',
        401: 'Invalid credentials',
    },
)
@api_view(['POST'])
def login_user(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    user = authenticate(email=email, password=password)
    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({'message': 'Login successful', 'user_id': user.id, 'email': user.email}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'token': openapi.Schema(type=openapi.TYPE_STRING, description='Google ID token'),
        },
        required=['token'],
    ),
    operation_description='Authenticate or register a user using Google login',
    responses={
        200: 'Google login successful',
        400: 'Invalid ID token',
    },
)
@api_view(['POST'])
def google_login_register(request):
    token = request.data.get('token')
    if not token:
        return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        id_info = id_token.verify_oauth2_token(token, google_requests.Request())
        if id_info['aud'] not in GOOGLE_CLIENT_IDS:
            return Response({'error': 'Invalid client ID'}, status=status.HTTP_403_FORBIDDEN)

        email = id_info.get('email')
        name = id_info.get('name', '').split()[0]
        picture = id_info.get('picture', '')

        user, created = CustomUser.objects.get_or_create(email=email)
        if created:
            user.username = name
            user.profile_picture = picture
            user.save()
            return Response({'message': 'New user created', 'user_id': user.id, 'is_profile_complete': False}, status=200)
        else:
            return Response({'message': 'User logged in', 'user_id': user.id, 'is_profile_complete': True}, status=200)
    except ValueError as e:
        return Response({'error': 'Invalid ID token'}, status=status.HTTP_400_BAD_REQUEST)
    
@swagger_auto_schema(
    method='get',
    operation_description='Retrieve the profile of a user',
    responses={200: 'Profile retrieved successfully', 404: 'User not found'},
)
@swagger_auto_schema(
    method='put',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='New username'),
            'bio': openapi.Schema(type=openapi.TYPE_STRING, description='User bio'),
            'profile_picture': openapi.Schema(type=openapi.TYPE_FILE, description='Profile picture'),
        },
    ),
    operation_description='Update the profile of a user',
    responses={200: 'Profile updated successfully', 400: 'Invalid data'},
)
@api_view(['GET', 'PUT'])
def user_profile(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({
            'email': user.email,
            'username': user.username,
            'bio': user.bio,
            'profile_picture': user.profile_picture.url if user.profile_picture else None,
        }, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        data = request.data
        user.username = data.get('username', user.username)
        user.bio = data.get('bio', user.bio)

        if 'profile_picture' in request.FILES:
            user.profile_picture = request.FILES['profile_picture']

        user.save()
        return Response({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)
    
@swagger_auto_schema(
    method='get',
    operation_description='List all users',
    responses={200: 'List of all users'},
)
@api_view(['GET'])
def list_users(request):
    users = CustomUser.objects.all().values('id', 'email', 'username', 'bio', 'profile_picture')
    return Response(list(users), status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='delete',
    operation_description='Delete a user by ID',
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
    operation_description='Retrieve detailed information of a specific user',
    responses={
        200: openapi.Response('User details retrieved successfully', schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'id': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID'),
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
                'bio': openapi.Schema(type=openapi.TYPE_STRING, description='User bio'),
                'profile_picture': openapi.Schema(type=openapi.TYPE_STRING, description='Profile picture URL'),
            }
        )),
        404: 'User not found',
    },
)
@api_view(['GET'])
def get_user_details(request, user_id):
    """
    Retrieve detailed information of a specific user.
    """
    try:
        user = CustomUser.objects.get(id=user_id)
        user_details = {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'bio': user.bio,
            'profile_picture': user.profile_picture.url if user.profile_picture else None,
        }
        return Response(user_details, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)