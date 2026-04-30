from django.urls import path
from food.views import FoodListingsCreateView, FoodListingsDetailView


urlpatterns = [
    path('food-listings/', FoodListingsCreateView.as_view(), name='food-listings-create'),
    path('food-listings/<int:pk>/', FoodListingsDetailView.as_view(), name='food-listings-detail'),
]