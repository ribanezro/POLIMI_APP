from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    username = models.CharField(max_length=30, unique=True)  
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True, null=True)  
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email