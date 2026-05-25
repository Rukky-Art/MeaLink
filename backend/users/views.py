from django.shortcuts import render
from users.serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from users.models import User

from drf_spectacular.utils import extend_schema

# Create your views here.

class UserRegistrationView(APIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
            request=UserSerializer, 
            responses={201: UserSerializer}
    )
    def post(self, request):
        user = request.user
        print("WHO IS REGISTERING?",user)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        else:
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
    
# class UserForgotPasswordView(APIView):
#     serializer_class = UserSerializer
#     permission_classes = [permissions.AllowAny]

#     @extend_schema(
#         request=UserSerializer,
#         responses={200: UserSerializer}
#     )
#     def post(self, request):

#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             email = request.data.get('email')
#             try:
#                 user = User.objects.get(email=email)


#                 # Generate token here
#                 # Send email here
            
#                 # Here you would typically send a password reset email
#                 return Response({"message": "Password reset instructions sent to your email."}, status=status.HTTP_200_OK)
#             except User.DoesNotExist:
#                 return Response({"error": "If an account exists, password reset instructions have been sent."}, status=status.HTTP_400_BAD_REQUEST)
            
