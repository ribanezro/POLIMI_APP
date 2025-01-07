from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=30, null=True)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True, null=True)  
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class BucketList(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="bucket_list")
    place = models.ForeignKey('places.Place', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    visited = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'place')  # Ensure no duplicate places for the same user

    def __str__(self):
        return f"{self.user.username} - {self.place.name} ({'Visited' if self.visited else 'Not Visited'})"