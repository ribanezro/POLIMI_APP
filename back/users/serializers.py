from rest_framework import serializers
from .models import BucketList
from places.serializers import PlaceSerializer

class BucketListSerializer(serializers.ModelSerializer):
    place = PlaceSerializer()

    class Meta:
        model = BucketList
        fields = ['id', 'place', 'added_at', 'visited']