from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_visit, name='add_visit'),
    path('/delete/<int:id>/', views.delete_visit, name='delete_visit'),
    path('update/<int:id>/', views.update_visit, name='update_visit'),
    path('<int:id>/', views.visit_detail, name='get_visit'),
    path('user/<int:user_id>/', views.user_visits, name='user_visits'),
    path('place/<int:place_id>/', views.place_visits, name='place_visits'),
    path('user/<int:user_id>/place/<int:place_id>/', views.user_place_visits, name='user_place_visits'),
]