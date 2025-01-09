from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set.")
        email = self.normalize_email(email)
        extra_fields.setdefault('username', None)  # Ensure username is optional
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True, null=True)
    password = models.CharField(max_length=150, null=True)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True, null=True)  
    given_name = models.CharField(max_length=30, null=True)
    family_name = models.CharField(max_length=30, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

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