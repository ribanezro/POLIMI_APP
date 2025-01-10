from rest_framework import serializers
from .models import UserVisit
from places.models import Place
from places.serializers import PlaceSerializer

class UserVisitSerializer(serializers.ModelSerializer):
    place = serializers.PrimaryKeyRelatedField(queryset=Place.objects.all())

    class Meta:
        model = UserVisit
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['place'] = PlaceSerializer(instance.place).data
        return representation