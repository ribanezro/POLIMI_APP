from rest_framework import serializers
from .models import UserVisit
from places.models import Place

class UserVisitSerializer(serializers.ModelSerializer):
    place = serializers.PrimaryKeyRelatedField(queryset=Place.objects.all())

    class Meta:
        model = UserVisit
        fields = '__all__'