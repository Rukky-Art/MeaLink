from rest_framework import serializers
from food.models import Food
from users.serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class FoodListingsSerializer(serializers.ModelSerializer):
    posted_by = UserSerializer(read_only=True)

    class Meta:
        model = Food
        fields = ['id', 'posted_by', 'food_type', 'category', 'quantity_estimated', 'quantity_unit', 'image_url',
                  'pickup_start_time', 'pickup_end_time', 'expiry_time', 'status', 'created_at', 
                  'contact_person_name', 'contact_person_phone', 'pickup_address', 'pickup_city', 'notes'
        ]
        read_only_fields = ['id', 'posted_by', 'created_at']