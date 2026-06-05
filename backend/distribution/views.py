from django.shortcuts import render
from distribution.serializers import DistributionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from distribution.models import Distribution
from drf_spectacular.utils import extend_schema

# Create your views here.

class DistributionCreateView(APIView):
    serializer_class = DistributionSerializer

    @extend_schema(
        request=DistributionSerializer
    )

    def post(self, request):
        #check permission first
        if request.user.role != 'partner' and request.user.role != 'receiver':
            return Response(data={"error": "Only partners and receivers can create distribution records"}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():

            claim = serializer.validated_data['claim']

            # Make sure partner owns the claim
            if claim.claimer != request.user:
                return Response(data={"error": "You can only create distribution records for your own claims"}, status=status.HTTP_403_FORBIDDEN)

            # Make sure food was actually picked up first
            if claim.status != 'picked_up':
                return Response(data={"error": "Food must be picked up before distributing."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Make sure distribution hasn't already been recorded
            if Distribution.objects.filter(claim=claim).exists():
                return Response(data={"error": "Distribution record already exists for this claim."}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save() # Set the user field to the current user when saving the claim

            # update statuses
            claim.status = 'distributed'
            claim.save()

            claim.food.status = 'distributed'
            claim.food.save()

            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        #partners and receivers can see distribution records for their claims
        if request.user.role == 'partner' or request.user.role == 'receiver':
            distributions = Distribution.objects.filter(claim__claimer=request.user)

        elif request.user.role == 'donor': 
            distributions = Distribution.objects.filter(claim__food__posted_by=request.user)

        elif request.user.role == 'admin':
            distributions = Distribution.objects.all()

        serializer = DistributionSerializer(distributions, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
