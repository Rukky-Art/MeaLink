from django.urls import path
from users.views import UserRegistrationView, VerifyEmailView, ResendVerificationEmailView, ForgotPasswordView, ResetPasswordView, UserListView, UserProfileView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-verification-email/', ResendVerificationEmailView.as_view(), name='resend-verification-email'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('list-users/', UserListView.as_view(), name='user-list'),
    path('me/', UserProfileView.as_view(), name='user-me'),
]