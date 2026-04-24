from django.urls import path
from users.views import UserRegistrationView, UserListView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('list-users/', UserListView.as_view(), name='user-list'),
]