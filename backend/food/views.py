from django.shortcuts import render
from food.serializers import FoodListingsSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from food.models import Food
from food.utils import calculate_distance
from users.sms import send_sms
from drf_spectacular.utils import extend_schema
from users.utils import normalize_phone
from users.whatsapp import send_whatsapp_message
from django.contrib.auth import get_user_model

User = get_user_model()

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
            food = serializer.save(posted_by=posted_by)# Set the user field to the current user when saving the todo

            partners = User.objects.filter(
                role='partner',
                city__iexact=food.pickup_city,
                is_active=True,
                phone_number__isnull=False
            ).exclude(phone_number='')

            sms_message = (
                f"MeaLink: New food in {food.pickup_city}! "
                f"{food.food_type} ({food.quantity_estimated} {food.quantity_unit}) "
                f"available until {food.pickup_end_time.strftime('%H:%M')}. "
                f"Listing ID: {food.id}. "
                f"Dial *384*12347# to claim."
            )

            whatsapp_message = f"""🔔 *MealLink — New Food Available Near You!*

*{food.food_type}* is available in *{food.pickup_city}*.

*Quantity:* {food.quantity_estimated} {food.quantity_unit}
*Category:* {food.category}
*Pickup address:* {food.pickup_address}
*Available until:* {food.pickup_end_time.strftime('%H:%M on %d %b')}

Open the MealLink app to claim it before 
someone else does! ⏰

_MealLink — Share More. Waste Less._"""
            
            for partner in partners:
                phone = normalize_phone(partner.phone_number)
                send_sms(phone, sms_message)
                send_whatsapp_message(phone, whatsapp_message)
         
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FoodListingsListView(APIView):
    serializer_class = FoodListingsSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(operation_id="list_all_food_listings")
    #all users apart from donors can see all available food listings
    def get(self, request):

        user_latitude = request.query_params.get('latitude')
        user_longitude = request.query_params.get('longitude')
        
        # If user is not logged in → show all available listings
        if not request.user.is_authenticated:
            food_listings = Food.objects.filter(
                status='available',
            )[:8]
        
        # If logged in partner, filter by their city
        elif request.user.role == 'partner':
            food_listings = Food.objects.filter(status='available')
                # If partner has a city, filter by it
                # But don't block if city is missing
            if request.user.city:
                food_listings = food_listings.filter(
            pickup_city__iexact=request.user.city
            )    
            
        elif request.user.role == 'admin':
            food_listings = Food.objects.all()
        else:
            return Response(data={"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)
        
        # If GPS coordinates provided, calculate distance and sort listings by proximity
        if user_latitude and user_longitude:
            listings_with_distance = []

            for listing in food_listings:
                if listing.pickup_latitude and listing.pickup_longitude:
                    distance = calculate_distance(
                        user_latitude, 
                        user_longitude, 
                        listing.pickup_latitude, 
                        listing.pickup_longitude
                    )
                    # If calculate_distance returns None, put at end
                    listings_with_distance.append((listing, distance if distance is not None else float('inf')))
                else:
                    # No coordinates — put at end
                    listings_with_distance.append((listing, float('inf')))
                    
            # Sort — float('inf') always goes to the end ✅
            listings_with_distance.sort(key=lambda x: x[1])
            food_listings = [item[0] for item in listings_with_distance]

            serializer = self.serializer_class(
                food_listings, 
                many=True, 
                context={
                    'request': request,
                    'user_latitude': user_latitude,
                    'user_longitude': user_longitude    
                }
            )
        else:
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
        
        user_latitude = request.query_params.get('latitude')
        user_longitude = request.query_params.get('longitude')
        
        serializer = self.serializer_class(
            food_listing, 
            context={
                'request': request,
                'user_latitude': user_latitude, 
                'user_longitude': user_longitude
                })
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