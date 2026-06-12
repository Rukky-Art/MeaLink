from django.urls import path
from notification.views import NotificationView, MarkAsReadView, NotificationCountView

urlpatterns = [
    path('', NotificationView.as_view(), name='notification-list'),
    path('<int:pk>/read/', MarkAsReadView.as_view(), name='mark-as-read'),
    path('unread-count/', NotificationCountView.as_view(), name='notification-unread-count'), 
]
