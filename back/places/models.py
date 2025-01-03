from django.db import models

class Place(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    coordinates = models.CharField(max_length=255)  # e.g., "48.8584,2.2945"
    image_url = models.URLField(max_length=500, null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    rating = models.FloatField(null=True, blank=True)
    price = models.FloatField(null=True, blank=True)
    website = models.URLField(max_length=500, null=True, blank=True)


    def __str__(self):
        return self.name