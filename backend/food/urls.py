from django.urls import path
from food.views import FoodListingsCreateView, FoodListingsDetailView, FoodListingsLandingPageListView, FoodListingsPartnerListView


urlpatterns = [
    path('my-listings/', FoodListingsCreateView.as_view(), name='my-food-listings-create'),
    path('all-listings/', FoodListingsLandingPageListView.as_view(), name='food-listings-list'),
    path('partner-listings/', FoodListingsPartnerListView.as_view(), name='food-listings-partner'),
    path('my-listings/<int:pk>/', FoodListingsDetailView.as_view(), name='food-listings-detail'),
]