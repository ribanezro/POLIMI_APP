from django.shortcuts import render
from rest_framework import viewsets
from .models import UserVisit
from .serializers import UserVisitSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from places.models import Place
from users.models import CustomUser as User
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.test import APIRequestFactory


# Todas las visitas de un usuario
@swagger_auto_schema(
    method='get',
    description='Get all visits of a user',
    responses={200: UserVisitSerializer(many=True)}
)
@api_view(['GET'])
def user_visits(request, user_id):
    user = User.objects.get(id=user_id)
    visits = UserVisit.objects.filter(user=user)
    serializer = UserVisitSerializer(visits, many=True)
    return Response(serializer.data)

# Todas las visitas de un lugar
@swagger_auto_schema(
    method='get',
    description='Get all visits of a place',
    responses={200: UserVisitSerializer(many=True)}
)
@api_view(['GET'])
def place_visits(request, place_id):
    place = Place.objects.get(id=place_id)
    visits = UserVisit.objects.filter(place=place)
    serializer = UserVisitSerializer(visits, many=True)
    return Response(serializer.data)

# Añadir una visita
@swagger_auto_schema(
    method='post',
    description='Add a visit',
    request_body=UserVisitSerializer,
    responses={200: UserVisitSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_visit(request):
    serializer = UserVisitSerializer(data=request.data)
    if serializer.is_valid():
        visit = serializer.save(user=request.user)

        factory = APIRequestFactory()
        mission_check_request = factory.post('/gamification/check-missions/', {'visit_id': visit.id}, format='json')
        mission_check_request.user = request.user 

        from gamification.views import check_missions
        mission_response = check_missions(mission_check_request)

        response_data = {
            'visit': serializer.data,
            'mission_status': mission_response.data,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Borrar o actualizar una visita
@swagger_auto_schema(
    method='get',
    description='Get a visit',
    responses={200: UserVisitSerializer}
)
@swagger_auto_schema(
    method='delete',
    description='Delete a visit',
    responses={200: 'Visit deleted'}
)
@swagger_auto_schema(
    method='put',
    description='Update a visit',
    request_body=UserVisitSerializer,
    responses={200: UserVisitSerializer}
)
@api_view(['GET','DELETE', 'PUT'])
def visit_detail(request, visit_id):
    try:
        visit = UserVisit.objects.get(id=visit_id)
    except UserVisit.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserVisitSerializer(visit)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        visit.delete()
        return Response(status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = UserVisitSerializer(visit, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@swagger_auto_schema(
    method='get',
    description='Get all visits of a user in a place',
    responses={200: UserVisitSerializer(many=True)}
)
@api_view(['GET'])
def user_place_visits(request, user_id, place_id):
    user = User.objects.get(id=user_id)
    place = Place.objects.get(id=place_id)
    visits = UserVisit.objects.filter(user=user, place=place)
    serializer = UserVisitSerializer(visits, many=True)
    return Response(serializer.data)