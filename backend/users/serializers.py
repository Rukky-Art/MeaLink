from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone_number', 'role', 'organisation_type', 
            'address', 'city', 'country', 'latitude', 'longitude', 'password', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    #donors must have organisation type
    def validate(self, data):
        if data['role'] == 'donor' and not data.get('organisation_type'):
            raise serializers.ValidationError({
                'organisation_type': 'Organisation type is required for donors.'
            })
        return data
       
    def create(self, validated_data):
        user = User.objects.create_user( #calls custom user manager's create_user method 
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            phone_number=validated_data.get('phone_number', None),
            role=validated_data['role'],
            organisation_type=validated_data.get('organisation_type', None),
            address=validated_data.get('address', None),
            city=validated_data['city'],
            country=validated_data['country'],
            latitude=validated_data.get('latitude', None),
            longitude=validated_data.get('longitude', None),
        )
        return user
        