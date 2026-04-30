from django.shortcuts import render
from food.serializers import FoodListingsSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from food.models import Food
from drf_spectacular.utils import extend_schema

# Create your views here.

class FoodListingsCreateView(APIView):
    serializer_class = FoodListingsSerializer

    @extend_schema(
        request=FoodListingsSerializer    
    )

    def get(self, request):
        food_listings = Food.objects.filter(user=request.user)
        serializer = self.serializer_class(food_listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)