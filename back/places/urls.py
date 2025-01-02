from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_places, name='get_places'),
    path('<int:id>/', views.get_place, name='get_place'),
    path('search/', views.search_places, name='search_places'),
    path('filter/', views.filter_places, name='filter_places'),
    path('add/', views.add_place, name='add_place'),
    path('<int:id>/update-delete/', views.update_place, name='update_place'),
]