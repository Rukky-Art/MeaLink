from django.urls import path
from users.views import UserRegistrationView, UserListView, UserProfileView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('list-users/', UserListView.as_view(), name='user-list'),
    path('me/', UserProfileView.as_view(), name='user-me'),
]