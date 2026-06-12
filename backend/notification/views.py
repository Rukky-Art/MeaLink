from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from notification.models import Notification
from notification.serializers import NotificationSerializer

from drf_spectacular.utils import extend_schema

class NotificationView(APIView):
    serializer_class= NotificationSerializer

    @extend_schema(
        summary="List Notifications",
        description="Returns all notifications for the authenticated user, newest first.",
        responses=NotificationSerializer(many=True),
        tags=["Notifications"]
    )
    def get(self, request):
        notifications = Notification.objects.filter(
            user=request.user
        ).order_by('-created_at')

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class MarkAsReadView(APIView):
    serializer_class= NotificationSerializer
    @extend_schema(
        summary="Mark Notification As Read",
        description="Marks a specific notification as read.",
        tags=["Notifications"]
    )
    def patch(self, request, pk):
        notifications = Notification.objects.get(id=pk, user=request.user)

        notifications.is_read = True
        notifications.save()

        return Response({'message': 'Notification marked as read.'}, status=status.HTTP_200_OK)
    
class NotificationCountView(APIView):
    serializer_class= NotificationSerializer

    @extend_schema(
        summary="Get Unread Notification Count",
        description="Returns the number of unread notifications for the authenticated user.",
        tags=["Notifications"]
    )
    def get(self, request):
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()

        return Response({
            "unread_count": count
        })
    


# Create your views here.
