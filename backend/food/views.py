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

    #donors can only see their own food listings
    def get(self, request):
        food_listings = Food.objects.filter(donor=request.user)
        serializer = self.serializer_class(food_listings, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    #donors can only create food listings for themselves
    def post(self, request):
        data = request.data
        donor = request.user
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save(donor=donor)# Set the user field to the current user when saving the todo
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class FoodListingsDetailView(APIView):
    serializer_class = FoodListingsSerializer

    #donors can see a specific food listing that they created
    def get(self, request, pk):
        try:
            food_listing = Food.objects.get(pk=pk, donor=request.user)
        except Food.DoesNotExist:
            return Response(data={"error": "Food listing not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.serializer_class(food_listing)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    #donors can update their food listing
    def patch(self, request, pk):
        try:
            food_listing = Food.objects.get(pk=pk, donor=request.user)
        except Food.DoesNotExist:
            return Response(data={"error": "Food listing not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data=request.data
        serializer = self.serializer_class(food_listing, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #donors can delete their food listing
    def delete(self, request, pk):
        try:
            food_listing = Food.objects.get(pk=pk, donor=request.user)
        except Food.DoesNotExist:
            return Response(data={"error": "Food listing not found"}, status=status.HTTP_404_NOT_FOUND)
        
        food_listing.delete()
        return Response(data={'message': 'Food listing deleted successfully'}, status=status.HTTP_204_NO_CONTENT)