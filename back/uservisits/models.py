from django.db import models
from django.conf import settings
from places.models import Place

class UserVisit(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    visit_date = models.DateField(auto_now_add=True)
    photo = models.ImageField(upload_to='user_visits/', null=True)
    review = models.TextField(null=True, blank=True)
    rating = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} visited {self.place.name}"