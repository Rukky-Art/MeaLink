from django.shortcuts import render
from users.serializers import UserSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth import get_user_model
from users.email import send_verification_email, send_password_reset_email
from rest_framework_simplejwt.tokens import RefreshToken


from users.models import EmailVerificationToken, PasswordResetToken

from drf_spectacular.utils import extend_schema

User = get_user_model()

# Create your views here.

class UserRegistrationView(APIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
            request=UserSerializer, 
            responses={201: UserSerializer}
    )
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            #Auto login
            refresh = RefreshToken.for_user(user)

            # Create verification token
            EmailVerificationToken.objects.filter(
                user=user,
                is_used=False,
            ).delete()
            verify_token = EmailVerificationToken.objects.create(user=user)

            # Send email — no request needed
            send_verification_email(user, verify_token.token)

            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Registration successful. Please check your email.'
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class VerifyEmailView(APIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        token = request.query_params.get('token')

        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            verify_token = EmailVerificationToken.objects.get(token=token, is_used=False)
        except EmailVerificationToken.DoesNotExist:
            return Response({'error': 'Invalid verification link'}, status=status.HTTP_400_BAD_REQUEST)

        if not verify_token.is_valid():
            return Response({'error': 'Verification link has expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        user = verify_token.user
        user.is_verified = True
        user.save()

        verify_token.is_used = True
        verify_token.save()

        serializer = UserSerializer(user)
        return Response({'message': 'Email verified successfully', 'data': serializer.data}, status=status.HTTP_200_OK)

class ResendVerificationEmailView(APIView):

    def post(self, request):
        user = request.user

        if user.is_verified:
            return Response({'message': 'This email is already verified'}, status=status.HTTP_400_BAD_REQUEST)

        # Delete existing tokens
        EmailVerificationToken.objects.filter(
            user=user, is_used=False
        ).delete()

        # Create new token
        verify_token = EmailVerificationToken.objects.create(user=user)

        # Send email
        send_verification_email(user, verify_token.token)

        return Response({'message': 'Verification email sent successfully'}, status=status.HTTP_200_OK)
    
class ForgotPasswordView(APIView):
    serializer_class = ForgotPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']

            try:
                user = User.objects.get(email=email)

                # Delete existing tokens
                PasswordResetToken.objects.filter(
                    user=user, is_used=False
                ).delete()

                # Create new token
                reset_token = PasswordResetToken.objects.create(user=user)

                # Send email
                send_password_reset_email(user, reset_token.token)

            except User.DoesNotExist:
                pass

            return Response({'message': 'If this email exists you will receive a reset link shortly.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']

            try:
                reset_token = PasswordResetToken.objects.get(token=token, is_used=False)
            except PasswordResetToken.DoesNotExist:
                return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)

            if not reset_token.is_valid():
                return Response({'error': 'This link has expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)


            user = reset_token.user #update passowrd
            user.set_password(new_password)
            user.save()

            reset_token.is_used = True
            reset_token.save()

            return Response({'message': 'Password reset successfully. You can now login with your new password.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(APIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    @extend_schema(
        request=None,
        responses={200: UserSerializer(many=True)}
    )
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    serializer_class = UserSerializer

    @extend_schema( 
        request=None,
        responses={200: UserSerializer}
    )
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request):
        user = request.user
        serializer = self.serializer_class(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
