from django.urls import path
from admin_panel.views import (
    AdminPanelListView,
    AdminPanelDetailView,
    AdminVerifyView,
)

urlpatterns = [
    path("panel-list/", AdminPanelListView.as_view(), name="admin-panel-list"),
    path("verification-detail/<int:pk>/", AdminPanelDetailView.as_view(), name="admin-panel-detail",),
    path("verifications/<int:pk>/", AdminVerifyView.as_view(), name="admin-verify"),
]
