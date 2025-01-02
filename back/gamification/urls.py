from django.urls import path
from . import views

urlpatterns = [
    path('missions/', views.get_user_missions, name='get_user_missions'),
    path('missions/uncompleted/', views.get_uncompleted_missions, name='get_uncompleted_missions'),
    path('missions/create/', views.create_mission, name='create_mission'),
    path('missions/delete/<int:mission_id>/', views.delete_mission, name='delete_mission'),
    path('badges/', views.get_user_badges, name='get_user_badges'),
    path('badges/create/', views.create_badge, name='create_badge'),
    path('levels/', views.get_user_level, name='get_user_level'),
    path('levels/create/', views.create_level, name='create_level'),
    path('check-missions/', views.check_missions, name='check_missions'),
]