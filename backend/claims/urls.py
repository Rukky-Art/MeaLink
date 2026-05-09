from django.urls import path
from claims.views import ClaimCreateView, ClaimDetailView, VerifyPickupCodeView

urlpatterns = [
    path('', ClaimCreateView.as_view(), name='claim-create'),
    path('<int:pk>/cancel/', ClaimDetailView.as_view(), name='claim-detail'),
    path('<int:pk>/verify-pickup-code/', VerifyPickupCodeView.as_view(), name='verify-pickup-code'),
]