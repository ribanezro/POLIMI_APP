from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_visit, name='add_visit'),
    path('<int:id>/', views.visit_detail, name='get_visit'),
    path('user/<int:user_id>/', views.user_visits, name='user_visits'),
    path('place/<int:place_id>/', views.place_visits, name='place_visits'),
]