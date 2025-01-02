from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from places.models import Place

class Mission(models.Model):
    MISSION_TYPES = [
        ('VISIT_COUNT', 'Visit Count'),
        ('SPECIFIC_PLACE', 'Specific Place'),
        ('CATEGORY', 'Category'),
        ('EVENT', 'Event'),
        ('COUNTRY', 'Country'),
        ('CITY', 'City'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=MISSION_TYPES)
    target_value = models.PositiveIntegerField(null=True, blank=True)  # For VISIT_COUNT or CATEGORY
    target_place = models.ForeignKey(Place, null=True, blank=True, on_delete=models.SET_NULL)  # For SPECIFIC_PLACE or EVENT
    target_category = models.CharField(max_length=50, null=True, blank=True)  # For CATEGORY
    target_country = models.CharField(max_length=50, null=True, blank=True)  # For COUNTRY
    target_city = models.CharField(max_length=50, null=True, blank=True)  # For CITY
    start_date = models.DateTimeField(null=True, blank=True)  # For EVENT
    end_date = models.DateTimeField(null=True, blank=True)  # For EVENT
    points = models.PositiveIntegerField(default=0)
    badge = models.ForeignKey('Badge', null=True, blank=True, on_delete=models.SET_NULL)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {'Completed' if self.is_completed else 'In Progress'}"

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='badges/')
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='badges', blank=True)

    def __str__(self):
        return self.name

class Level(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    points = models.PositiveIntegerField(default=0)
    current_level = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} - Level {self.current_level}"