from django.urls import path
from .views import register_user, login_user, google_login_register, user_profile, list_users, delete_user

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    path('google-login/', google_login_register, name='google_login_register'),
    path('profile/<int:user_id>/', user_profile, name='user_profile'),
    path('list/', list_users, name='list_users'),
    path('delete/<int:user_id>/', delete_user, name='delete_user'),
]