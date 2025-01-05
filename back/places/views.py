from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from django.http import JsonResponse
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Place
from .serializers import PlaceSerializer
from django.db.models import Q

@swagger_auto_schema(
    method='get',
    description='Get all places grouped by country',
    responses={200: openapi.Response(
        description="List of places grouped by country",
        examples={
            "application/json": {
                "USA": [
                    {"id": 1, "name": "Statue of Liberty", "location": "New York", "category": "Historical"},
                    {"id": 2, "name": "Yellowstone National Park", "location": "Wyoming", "category": "Nature"}
                ],
                "France": [
                    {"id": 3, "name": "Eiffel Tower", "location": "Paris", "category": "Monument"}
                ]
            }
        }
    )}
)
@api_view(['GET'])
def places_by_country(request):
    # Query all places
    places = Place.objects.all()
    
    # Group places by country
    grouped_places = {}
    for place in places:
        country = place.country
        if country not in grouped_places:
            grouped_places[country] = []
        grouped_places[country].append(PlaceSerializer(place).data)

    return Response(grouped_places)

# Lista de todos los lugares
@swagger_auto_schema(
    method='get', 
    description='Get all places',
    responses={200: PlaceSerializer(many=True)}
)
@api_view(['GET'])
def get_places(request):
    places = Place.objects.all()
    serializer = PlaceSerializer(places, many=True)
    return Response(serializer.data)

# Buscar lugares por id
@swagger_auto_schema(
    method='get', 
    description='Get a place by id',
    responses={200: PlaceSerializer}
)
@api_view(['GET'])
def get_place(request, id):
    place = Place.objects.get(id=id)
    serializer = PlaceSerializer(place)
    return Response(serializer.data)

# Buscar lugares por nombre o lugar
@swagger_auto_schema(
    method='get', 
    description='Search places by name or location',
    responses={200: PlaceSerializer(many=True)}
)
@api_view(['GET'])
def search_places(request):
    query = request.query_params.get('query')
    places = Place.objects.filter(Q(name__icontains=query) | Q(location__icontains=query))
    serializer = PlaceSerializer(places, many=True)
    return Response(serializer.data)

# Filtros
@swagger_auto_schema(
    method='get',
    description='Filter places by category, country, city, rating, or price',
    manual_parameters=[
        openapi.Parameter('category', openapi.IN_QUERY, description="Filter by category", type=openapi.TYPE_STRING),
        openapi.Parameter('country', openapi.IN_QUERY, description="Filter by country", type=openapi.TYPE_STRING),
        openapi.Parameter('city', openapi.IN_QUERY, description="Filter by city", type=openapi.TYPE_STRING),
        openapi.Parameter('min_rating', openapi.IN_QUERY, description="Filter by minimum rating", type=openapi.TYPE_NUMBER),
        openapi.Parameter('max_rating', openapi.IN_QUERY, description="Filter by maximum rating", type=openapi.TYPE_NUMBER),
        openapi.Parameter('min_price', openapi.IN_QUERY, description="Filter by minimum price", type=openapi.TYPE_NUMBER),
        openapi.Parameter('max_price', openapi.IN_QUERY, description="Filter by maximum price", type=openapi.TYPE_NUMBER),
    ],
    responses={200: PlaceSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def filter_places(request):
    category = request.query_params.get('category')
    country = request.query_params.get('country')
    city = request.query_params.get('city')
    min_rating = request.query_params.get('min_rating')
    max_rating = request.query_params.get('max_rating')
    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')

    filters = Q()
    if category:
        filters &= Q(category__icontains=category)
    if country:
        filters &= Q(country__icontains=country)
    if city:
        filters &= Q(city__icontains=city)
    if min_rating:
        filters &= Q(rating__gte=min_rating)
    if max_rating:
        filters &= Q(rating__lte=max_rating)
    if min_price:
        filters &= Q(price__gte=min_price)
    if max_price:
        filters &= Q(price__lte=max_price)

    places = Place.objects.filter(filters)
    serializer = PlaceSerializer(places, many=True)
    return Response(serializer.data)

# Añadir un lugar (Solo administradores)
@swagger_auto_schema(
    method='post',
    description='Add a place',
    request_body=PlaceSerializer,
    responses={200: PlaceSerializer}
)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_place(request):
    serializer = PlaceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

# Actualizar un lugar (Solo administradores) y borrar un lugar
@swagger_auto_schema(
    method='put',
    description='Update a place',
    request_body=PlaceSerializer,
    responses={200: PlaceSerializer}
)
@swagger_auto_schema(
    method='delete',
    description='Delete a place',
    responses={200: openapi.Response(
        description="Success",
        examples={"application/json": {"message": "Place deleted successfully"}}
    )}
)
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def update_place(request, id):
    try:
        place = Place.objects.get(id=id)
    except Place.DoesNotExist:
        return Response({'error': 'Place not found'}, status=404)

    if request.method == 'PUT':
        serializer = PlaceSerializer(instance=place, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        place.delete()
        return Response({'message': 'Place deleted successfully'}, status=200)