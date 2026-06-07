from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions  

from claims.models import Claim
from drf_spectacular.utils import extend_schema
from django.utils import timezone

from claims.serializers import (
    ClaimCreateSerializer, 
    ClaimDetailSerializer, 
    VerifyPickupCodeSerializer, 
    ClaimDonorSerializer
)

# Create your views here.

class ClaimCreateView(APIView):
    serializer_class = ClaimCreateSerializer

    @extend_schema(
        request=ClaimCreateSerializer
    )
    
    #claim a food listing
    def post(self, request):
        #check permission first
        if request.user.role != 'partner':
            return Response(data={"error": "Only partners can claim food listings"}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():

            food = serializer.validated_data['food']

            if food.status != 'available':
                return Response(data={"error": "Food listing is not available for claiming"}, status=status.HTTP_400_BAD_REQUEST)   

            # Prevent partner from claiming their own food
            if food.posted_by == request.user:
                return Response(
                    {"error": "You cannot claim your own food listing"},
                    status=status.HTTP_403_FORBIDDEN
                )    

            claim = serializer.save(claimer = request.user)# Set the user field to the current user when saving the claim

            #update food listing status back to claimed
            food.status = 'claimed'
            food.save()

            return Response(data=ClaimDetailSerializer(claim).data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(operation_id="list_claims")
    def get(self, request):

        #partners and receivers can see all their claims with pick up code
        if request.user.role == 'partner':
            claims = Claim.objects.filter(claimer=request.user).select_related('food', 'food__posted_by', 'claimer')
            serializer_class = ClaimDetailSerializer

        elif request.user.role == 'donor': #can see claims but not pickup code
            claims = Claim.objects.filter(food__posted_by=request.user).select_related('food', 'food__posted_by', 'claimer')
            serializer_class = ClaimDonorSerializer

        elif request.user.role == 'admin':
            claims = Claim.objects.all().select_related('food', 'food__posted_by', 'claimer')
            serializer_class = ClaimDetailSerializer

        else:
            return Response(data={"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = serializer_class(claims, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class ClaimDetailView(APIView):
    serializer_class = ClaimDetailSerializer

    # @extend_schema(operation_id="retrieve_claim")
    # #view details of a claim
    # def get(self, request, pk):
    #     try:
    #         if request.user.role == 'admin':
    #             claim = Claim.objects.get(pk=pk)
    #         else:
    #             claim = Claim.objects.get(pk=pk, claimer=request.user)
    #     except Claim.DoesNotExist:
    #         return Response(data={"error": "Claim not found"}, status=status.HTTP_404_NOT_FOUND)
        
    #     serializer = self.serializer_class(claim)
    #     return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    #cancel a claim    
    def patch(self, request, pk):
        try:
            claim = Claim.objects.get(pk=pk, claimer=request.user)
        except Claim.DoesNotExist:
            return Response(data={"error": "Claim not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if claim.status != 'pending':
            return Response(
                {"error": "Only pending claims can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
        )
    
        claim.status = 'cancelled'
        claim.save()

        #update food listing status back to available
        claim.food.status = 'available'
        claim.food.save()

        serializer = self.serializer_class(claim)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
class VerifyPickupCodeView(APIView):
    serializer_class = VerifyPickupCodeSerializer

    @extend_schema(
        request=VerifyPickupCodeSerializer    
    )

    def post(self, request, pk):

        #get claim
        try:
            claim = Claim.objects.get(pk=pk)
        except Claim.DoesNotExist:
            return Response(data={"error": "Claim not found"}, status=status.HTTP_404_NOT_FOUND)
        
        #Check if the user is the donor of the food listing and if they are a donor
        if request.user.role != 'donor' or claim.food.posted_by != request.user:
            return Response(data={"error": "Only the donor can verify the pickup code"}, status=status.HTTP_403_FORBIDDEN)
        
        #validate the pickup code
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #check code matches
        pickup_code = serializer.validated_data['pickup_code']
        if pickup_code == claim.pickup_code:
            claim.status = 'picked_up'
            claim.pickup_code_verified = True
            claim.pickup_time = timezone.now()
            claim.save()

            #update status of the food listing
            claim.food.status = 'picked_up'
            claim.food.save()

            return Response(data={"message": "Pickup code verified successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(data={"error": "Invalid pickup code"}, status=status.HTTP_400_BAD_REQUEST)
        