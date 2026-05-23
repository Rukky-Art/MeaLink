from django.urls import path
from food.views import FoodListingsCreateView, FoodListingsDetailView, FoodListingsListView


urlpatterns = [
    path('my-listings/', FoodListingsCreateView.as_view(), name='my-food-listings-create'),
    path('all-listings/', FoodListingsListView.as_view(), name='food-listings-list'),
    path('my-listings/<int:pk>/', FoodListingsDetailView.as_view(), name='food-listings-detail'),
]