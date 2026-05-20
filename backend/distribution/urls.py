from django.urls import path
from distribution.views import DistributionCreateView

urlpatterns = [
    path('', DistributionCreateView.as_view(), name='distribution-create'),
]