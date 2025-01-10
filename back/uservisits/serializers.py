from rest_framework import serializers
from .models import UserVisit
from places.serializers import PlaceSerializer

class UserVisitSerializer(serializers.ModelSerializer):
    place = PlaceSerializer()
    class Meta:
        model = UserVisit
        fields = '__all__'