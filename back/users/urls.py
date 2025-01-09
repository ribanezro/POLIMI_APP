from django.urls import path
from .views import *


urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    path('google-login/', google_login_register, name='google_login_register'),
    path('profile/<int:user_id>/', user_profile, name='user_profile'),
    path('list/', list_users, name='list_users'),
    path('delete/<int:user_id>/', delete_user, name='delete_user'),
    path('bucketlist/<int:user_id>/', user_bucket_list, name='user_bucketlist'),
    path('bucketlist/complete/<int:item_id>/', complete_bucket_list_item, name='add_bucketlist'),
    path('bucketlist/add/<int:user_id>/<int:place_id>/', add_bucket_list_item, name='add_bucketlist'),
    path('bucketlist/delete/<int:item_id>/', delete_bucket_list_item, name='delete_bucketlist'),
    path('bucketlist/<int:item_id>/<int:place_id>/', is_on_bucket_list, name='present_in_bucket_list'),
]