from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.utils import normalize_phone

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone_number', 'role', 
            'business_name', 'business_registration_number', 'organisation_type',
            'address', 'city', 'country', 'latitude', 'longitude', 'password', 'created_at', 'is_email_verified', 'is_business_verified'
        ]
        read_only_fields = ['id', 'created_at', 'is_email_verified', 'is_business_verified']

    #donors must have organisation type
    def validate(self, data):
        donor_types = ['restaurant', 'hotel', 'catering', 'supermarket', 'bakery', 'event center', 'cafeteria', 'other']
        partner_types = ['food bank', 'ngo', 'religious organization', 'shelter', 'community coordinator', 'local volunteer group', 'other']

        if data.get('role') == 'donor':
            if not data.get('organisation_type'):
                raise serializers.ValidationError({
                    'organisation_type': 'Required for donors.'
                })
            if data.get('organisation_type') not in donor_types:
                raise serializers.ValidationError({
                    'organisation_type': 'Invalid type for donor role.'
                })

        if data.get('role') == 'partner':
            if not data.get('organisation_type'):
                raise serializers.ValidationError({
                    'organisation_type': 'Required for partners.'
                })
            if data.get('organisation_type') not in partner_types:
                raise serializers.ValidationError({
                    'organisation_type': 'Invalid type for partner role.'
                })

        return data

    def validate_phone_number(self, value):
        try:
            return normalize_phone(value)
        except Exception:
            raise serializers.ValidationError(
                "Enter a valid phone number."
            )
        

    def create(self, validated_data):
        user = User.objects.create_user( #calls custom user manager's create_user method 
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            phone_number=validated_data.get('phone_number', None),
            role=validated_data['role'],
            business_name=validated_data['business_name'],
            business_registration_number=validated_data.get('business_registration_number', None),
            organisation_type=validated_data.get('organisation_type', None),
            address=validated_data.get('address', None),
            city=validated_data['city'],
            country=validated_data['country'],
            latitude=validated_data.get('latitude', None),
            longitude=validated_data.get('longitude', None)
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

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
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone_number', 'role',
            'business_name', 'business_registration_number', 'organisation_type',
            'address', 'city', 'country', 'latitude', 'longitude', 'created_at', 'is_business_verified'
        ]
        read_only_fields = ['id', 'email', 'role', 'created_at', 'is_business_verified']

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
