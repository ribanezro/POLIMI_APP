from rest_framework import serializers
from .models import UserVisit

class UserVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserVisit
        fields = '__all__'