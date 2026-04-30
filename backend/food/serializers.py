from rest_framework import serializers
from food.models import Food
from users.serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class FoodListingsSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)

    class Meta:
        model = Food
        fields = ['id', 'donor', 'food_type', 'category', 'quantity_estimated', 'quantity_unit', 
                  'pickup_start_time', 'pickup_end_time', 'expiry_time', 'status', 'created_at'            
        ]
        read_only_fields = ['id', 'donor', 'created_at']
