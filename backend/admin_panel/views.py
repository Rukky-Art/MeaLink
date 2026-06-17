from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from admin_panel.models import AdminPanel
from admin_panel.serializers import AdminPanelSerializer, AdminVerifySerializer
from django.contrib.auth import get_user_model

from drf_spectacular.utils import extend_schema
from django.utils import timezone
from notification.services import (
    notify_donor_verified,
    notify_partner_verified,
    notify_verification_rejected,
)

User = get_user_model()

class AdminPanelListView(APIView):
    serializer_class = AdminPanelSerializer

    @extend_schema(
        summary="Access Admin Panel",
        description="Provides access to the admin panel for verified administrators.",
        responses={200: AdminPanelSerializer(many=True)},
        tags=["Admin Panel"]
    )
    def get(self, request):
        # Filter by status if provided
        verification_status = request.query_params.get('status')
        role = request.query_params.get('role')
        country = request.query_params.get('country')

        admin_panels = AdminPanel.objects.select_related("user").order_by("-created_at")

        if verification_status:
            admin_panels = admin_panels.filter(verification_status=verification_status)
        
        if role:
            admin_panels = admin_panels.filter(user__role=role)

        if country:
            admin_panels = admin_panels.filter(user__country=country)

        serializer = AdminPanelSerializer(admin_panels, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AdminPanelDetailView(APIView):
    serializer_class = AdminPanelSerializer

    @extend_schema(
        summary="Get User Specific user detail",
        description="Retrieve a specific user's verification request details.",
        responses={200: AdminPanelSerializer},
        tags=["Admin Panel"]
    )
    def get(self, request, pk):
        try:
            admin_panel = AdminPanel.objects.get(pk=pk)
        except AdminPanel.DoesNotExist:
            return Response(
                {'error': 'Verification request not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AdminPanelSerializer(admin_panel)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class AdminVerifyView(APIView):
    serializer_class = AdminVerifySerializer

    @extend_schema(
        summary="Approve or Reject User",
        description="Allow admins to verify or reject a user's verification request.",
        responses={200: AdminPanelSerializer},
        tags=["Admin Panel"]
    )
    def patch(self, request, pk):
        try:
            admin_panel = AdminPanel.objects.get(pk=pk)
        except AdminPanel.DoesNotExist:
            return Response(
                {'error': 'Verification request not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AdminVerifySerializer(data=request.data)
        if serializer.is_valid():
            new_status = serializer.validated_data['verification_status']
            note = serializer.validated_data.get('note', '')

            # Update the verification request
            admin_panel.verification_status = new_status
            admin_panel.note = note
            admin_panel.verified_by = request.user
            admin_panel.verified_at = timezone.now()
            admin_panel.save()

            # Update the associated user's is_business_verified field
            user = admin_panel.user
            if new_status == 'verified':
                user.is_business_verified = True
                user.save()
                # Send approval email
                if user.role == "donor":
                    notify_donor_verified(user)

                elif user.role == "partner":
                    notify_partner_verified(user)

            elif new_status == 'rejected':
                user.is_business_verified = False
                user.save()

                if user.role == 'donor' and hasattr(user, 'donor_detail'):
                    user.donor_detail.rejection_reason = note
                    user.donor_detail.save()

                elif user.role == 'partner' and hasattr(user, 'partner_detail'):
                    user.partner_detail.rejection_reason = note
                    user.partner_detail.save()
                
                # Send rejection email with reason
                notify_verification_rejected(user, note)

            return Response(AdminPanelSerializer(admin_panel).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
