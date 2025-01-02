from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Mission, Badge, Level
from .serializers import MissionSerializer, BadgeSerializer, LevelSerializer
from uservisits.models import UserVisit
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


@swagger_auto_schema(
    method='GET',
    description='Get all missions of a user',
    responses={200: MissionSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_missions(request):
    missions = Mission.objects.filter(user=request.user)
    serializer = MissionSerializer(missions, many=True)
    return Response(serializer.data)


@swagger_auto_schema(
    method='GET',
    description='Get all uncompleted missions of a user',
    responses={200: MissionSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_uncompleted_missions(request):
    missions = Mission.objects.filter(user=request.user, is_completed=False)
    serializer = MissionSerializer(missions, many=True)
    return Response(serializer.data)


@swagger_auto_schema(
    method='POST',
    description='Create a new mission',
    request_body=MissionSerializer,
    responses={201: MissionSerializer}
)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_mission(request):
    serializer = MissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(
    method='DELETE',
    manual_parameters=[
        openapi.Parameter('mission_id', openapi.IN_PATH, type=openapi.TYPE_INTEGER, description='ID of the mission')
    ],
    description='Delete a mission',
    responses={200: 'Mission deleted successfully', 404: 'Mission not found'}
)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_mission(request, mission_id):
    try:
        mission = Mission.objects.get(id=mission_id)
        mission.delete()
        return Response({'message': 'Mission deleted successfully'}, status=200)
    except Mission.DoesNotExist:
        return Response({'error': 'Mission not found'}, status=404)


@swagger_auto_schema(
    method='GET',
    description='Get all badges of a user',
    responses={200: BadgeSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_badges(request):
    badges = Badge.objects.filter(user=request.user)
    serializer = BadgeSerializer(badges, many=True)
    return Response(serializer.data)


@swagger_auto_schema(
    method='POST',
    description='Create a new badge',
    request_body=BadgeSerializer,
    responses={201: BadgeSerializer}
)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_badge(request):
    serializer = BadgeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(
    method='GET',
    description='Get the level of a user',
    responses={200: LevelSerializer}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_level(request):
    level = Level.objects.filter(user=request.user).first()
    serializer = LevelSerializer(level)
    return Response(serializer.data)


@swagger_auto_schema(
    method='POST',
    description='Create a new level',
    request_body=LevelSerializer,
    responses={201: LevelSerializer}
)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_level(request):
    serializer = LevelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(
    method='POST',
    description='Check for completed missions after a visit',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'visit_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the visit'),
        },
        required=['visit_id'],
    ),
    responses={
        200: 'Missions checked successfully',
        404: 'Visit not found'
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_missions(request):
    user = request.user
    visit_id = request.data.get('visit_id')

    try:
        visit = UserVisit.objects.get(id=visit_id, user=user)
    except UserVisit.DoesNotExist:
        return Response({'error': 'Visit not found'}, status=404)

    missions = Mission.objects.filter(user=user, is_completed=False)
    completed_missions = []
    new_badges = []
    new_points = 0
    new_level = None

    for mission in missions:
        if check_mission_completion(user, mission, visit):
            mission.is_completed = True
            mission.save()
            completed_missions.append(mission)

            if mission.points:
                new_points += mission.points
                user.points += mission.points
            if mission.badge:
                badge = Badge.objects.create(user=user, name=mission.badge.name)
                new_badges.append(badge)

    user.save()

    if user.points >= user.level.next_level_points:
        while user.points >= user.level.next_level_points:
            user.level.current_level += 1
            user.level.next_level_points += 100
        user.level.save()
        new_level = user.level.current_level

    mission_serializer = MissionSerializer(completed_missions, many=True)
    return Response({
        'message': 'Missions checked.',
        'completed_missions': mission_serializer.data,
        'new_badges': [badge.name for badge in new_badges],
        'new_points': new_points,
        'new_level': new_level,
    })


def check_mission_completion(user, mission, visit):
    if mission.type == 'VISIT_COUNT':
        total_visits = UserVisit.objects.filter(user=user).count()
        return total_visits >= mission.target_value

    elif mission.type == 'SPECIFIC_PLACE':
        return visit.place == mission.target_place

    elif mission.type == 'CATEGORY':
        category_visits = UserVisit.objects.filter(user=user, place__category=mission.target_category).count()
        return category_visits >= mission.target_value

    elif mission.type == 'EVENT':
        if visit.place == mission.target_place:
            return mission.start_date <= visit.date <= mission.end_date

    elif mission.type == 'COUNTRY':
        country_visits = UserVisit.objects.filter(user=user, place__country=mission.target_country).count()
        return country_visits >= mission.target_value

    elif mission.type == 'CITY':
        city_visits = UserVisit.objects.filter(user=user, place__city=mission.target_city).count()
        return city_visits >= mission.target_value

    return False