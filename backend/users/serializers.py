from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.utils import normalize_phone
from users.models import DonorDetails, PartnerDetails

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

      # Add these two lines ✅
    food_safety_certificate_url = serializers.URLField(write_only=True, required=False, allow_null=True)
    ngo_certificate_url = serializers.URLField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone_number', 'role', 
            'business_name', 'business_registration_number', 'organisation_type',
            'address', 'city', 'country', 'latitude', 'longitude', 'password', 'created_at', 
            'is_email_verified', 'is_business_verified', 
            'food_safety_certificate_url', 'ngo_certificate_url'
        ]
        read_only_fields = ['id', 'created_at', 'is_email_verified', 'is_business_verified']

    #donors must have organisation type
    def validate(self, data):
        donor_types = ['restaurant', 'hotel', 'catering', 'supermarket', 'bakery', 'event_center', 'cafeteria', 'other']
        partner_types = ['food_bank', 'ngo', 'religious_organization', 'shelter', 'community_coordinator', 'local_volunteer_group', 'other']

        role = data.get('role')

        if role == 'donor':
            if not data.get('organisation_type'):
                raise serializers.ValidationError({
                    'organisation_type': 'Required for donors.'
                })
            if data.get('organisation_type') not in donor_types:
                raise serializers.ValidationError({
                    'organisation_type': 'Invalid type for donor role.'
                })

        if role == 'partner':
            if not data.get('organisation_type'):
                raise serializers.ValidationError({
                    'organisation_type': 'Required for partners.'
                })
            if data.get('organisation_type') not in partner_types:
                raise serializers.ValidationError({
                    'organisation_type': 'Invalid type for partner role.'
                })
            

        # def validate(self, data):

        # role = data.get("role")

        # if role == "donor":
        #     if not data.get("food_safety_certificate_url"):
        #         raise serializers.ValidationError(
        #             {
        #                 "food_safety_certificate":
        #                 "Food safety certificate is required."
        #             }
        #         )

        # if role == "partner":
        #     if not data.get("ngo_certificate_url"):
        #         raise serializers.ValidationError(
        #             {
        #                 "ngo_certificate":
        #                 "NGO certificate is required."
        #             }
        #         )

        # return data

        return data

    def validate_phone_number(self, value):
        try:
            return normalize_phone(value)
        except Exception:
            raise serializers.ValidationError(
                "Enter a valid phone number."
            )
        

    def create(self, validated_data):
        # Pull out the profile fields before creating User
        food_safety_certificate_url = validated_data.pop('food_safety_certificate_url', None)
        ngo_certificate_url = validated_data.pop('ngo_certificate_url', None)

        user = User.objects.create_user( #calls custom user manager's create_user method 
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            phone_number=validated_data.get('phone_number', None),
            role=validated_data['role'],
            business_name=validated_data['business_name'],
            business_registration_number=validated_data.get('business_registration_number', None),
            organisation_type=validated_data.get('organisation_type'),
            address=validated_data.get('address'),
            city=validated_data['city'],
            country=validated_data['country'],
            latitude=validated_data.get('latitude', None),
            longitude=validated_data.get('longitude', None)
        )

        # Create the matching profile record
        # Think of it like: User = ID card, Profile = application form
        if user.role == 'donor':
            DonorDetails.objects.create(
                user=user,
                food_safety_certificate_url=food_safety_certificate_url
            )

        elif user.role == 'partner':
            PartnerDetails.objects.create(
                user=user,
                ngo_certificate_url=ngo_certificate_url
            )

        return user

class DonorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorDetails
        fields = ['user', 'food_safety_certificate_url', 'rejection_reason', 'updated_at']
        read_only_fields = ('user', 'rejection_reason', 'updated_at')

class PartnerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerDetails
        fields = ['user', 'ngo_certificate_url', 'rejection_reason', 'updated_at']
        read_only_fields = ('user', 'rejection_reason', 'updated_at')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data["role"] = self.user.role
        data["email"] = self.user.email
        data["name"] = self.user.name
        data['is_email_verified'] = self.user.is_email_verified
        data['is_business_verified'] = self.user.is_business_verified


        # if not self.user.is_email_verified:
        #     raise AuthenticationFailed(
        #         "Please verify your email before logging in."
        #     )

        return data

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = ['email']

class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    class Meta:
        fields = ['token', 'new_password']
        
class ResendVerificationSerializer(serializers.Serializer):
    pass

class UserProfileSerializer(serializers.ModelSerializer):

    donor_detail = DonorDetailSerializer(read_only=True)
    partner_detail = PartnerDetailSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone_number', 'role',
            'business_name', 'business_registration_number', 'organisation_type',
            'address', 'city', 'country', 'latitude', 'longitude', 'created_at', 'is_business_verified',
            'donor_detail', 'partner_detail'
        ]
        read_only_fields = ['id', 'email', 'role', 'created_at', 'is_business_verified', 'donor_detail', 'partner_detail']

class AdminRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone_number', 'password'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        return User.objects.create_superuser(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            phone_number=validated_data.get('phone_number'),
            role='admin',
            city='N/A',
            country='NG',
            business_name='MeaLink Admin',
            is_email_verified=True,
        )
