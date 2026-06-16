from rest_framework import serializers  
from admin_panel.models import AdminPanel
from django.contrib.auth import get_user_model

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user info shown inside admin panel response"""
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone_number',
            'role', 'organisation_type', 'business_name', 'business_registration_number',
            'city', 'country', 'created_at'
        ]

class AdminBasicSerializer(serializers.ModelSerializer):
    """Admin info shown inside admin panel response"""
    class Meta:
        model = User
        fields = ['id', 'email', 'name']

class AdminPanelSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    verified_by = AdminBasicSerializer(read_only=True)
    class Meta:
        model = AdminPanel
        fields = ['id', 'user', 'verification_status',
            'note', 'verified_by', 'verified_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'user', 'verified_by', 'verified_at', 'created_at', 'updated_at')

class AdminVerifySerializer(serializers.Serializer):
    """Used when admin approves or rejects a user"""
    verification_status = serializers.ChoiceField(
        choices=['verified', 'rejected']
    )
    note = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Required when rejecting — explain why"
    )

    def validate(self, data):
        if data.get('verification_status') == 'rejected':
            if not data.get('note'):
                raise serializers.ValidationError({
                    'note': 'Please provide a reason for rejection.'
                })
        return data