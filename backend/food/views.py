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

    @extend_schema(operation_id="list_my_food_listings")
    #donors can only see their own food listings
    def get(self, request):

        if request.user.role != 'donor':
            return Response(data={"error": "Only donors can view their food listings"}, status=status.HTTP_403_FORBIDDEN)
        food_listings = Food.objects.filter(posted_by=request.user)
        serializer = self.serializer_class(food_listings, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
        
    @extend_schema(
        request=FoodListingsSerializer,
        responses={201: FoodListingsSerializer}    
    )
    #donors can only create food listings for themselves
    def post(self, request):
        # Check permission first
        if request.user.role != 'donor':
            return Response(data={"error": "Only donors can create food listings"}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        posted_by = request.user
        serializer = self.serializer_class(
            data=data, 
            context={'request': request}  # ← needed for full image URL generation
        )
        if serializer.is_valid():
            serializer.save(posted_by=posted_by)# Set the user field to the current user when saving the todo
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FoodListingsListView(APIView):
    serializer_class = FoodListingsSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(operation_id="list_all_food_listings")
    #all users apart from donors can see all available food listings
    def get(self, request):
        # If user is not logged in → show all available listings
        if not request.user.is_authenticated:
            food_listings = Food.objects.filter(status='available')
        
        # If logged in partner, filter by their city
        elif request.user.role == 'partner':
            food_listings = Food.objects.filter(
                status='available',
                pickup_city=request.user.city
            )
        elif request.user.role == 'admin':
            food_listings = Food.objects.all()
        else:
            food_listings = Food.objects.filter(status='available')

        serializer = self.serializer_class(food_listings, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class FoodListingsDetailView(APIView):
    serializer_class = FoodListingsSerializer

    @extend_schema(operation_id="retrieve_food_listing")
    #donors can see a specific food listing that they created
    def get(self, request, pk):
        try:
            food_listing = Food.objects.get(pk=pk, posted_by=request.user)
        except Food.DoesNotExist:
            return Response(data={"error": "Food listing not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.serializer_class(food_listing)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    #donors can update their food listing
    def patch(self, request, pk):
        try:
            food_listing = Food.objects.get(pk=pk, posted_by=request.user)
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
            food_listing = Food.objects.get(pk=pk, posted_by=request.user)
        except Food.DoesNotExist:
            return Response(data={"error": "Food listing not found"}, status=status.HTTP_404_NOT_FOUND)
        
        food_listing.delete()
        return Response(data={'message': 'Food listing deleted successfully'}, status=status.HTTP_204_NO_CONTENT)