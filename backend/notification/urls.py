from django.urls import path
from notification.views import NotificationView, MarkAsReadView, NotificationCountView

urlpatterns = [
    path('notifications/', NotificationView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', MarkAsReadView.as_view(), name='mark-as-read'),
    path('notifications/unread-count/', NotificationCountView.as_view(), name='notification-unread-count'), 
]
