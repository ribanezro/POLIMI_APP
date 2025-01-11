from rest_framework import serializers
from .models import BucketList, CustomUser
from places.serializers import PlaceSerializer

class BucketListSerializer(serializers.ModelSerializer):
    place = PlaceSerializer()

    class Meta:
        model = BucketList
        fields = ['id', 'place', 'added_at', 'visited']

class UserSerializer(serializers.ModelSerializer):
    bucket_list = BucketListSerializer(many=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'bio', 'given_name', 'family_name', 'profile_picture', 'bucket_list']


class UserNamePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'profile_picture']