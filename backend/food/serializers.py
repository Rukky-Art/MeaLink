from rest_framework import serializers
from food.models import Food
from users.serializers import UserSerializer
from food.utils import calculate_distance
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema_field

User = get_user_model()

class FoodListingsSerializer(serializers.ModelSerializer):
    posted_by = UserSerializer(read_only=True)
    distance_km = serializers.SerializerMethodField()

    class Meta:
        model = Food
        fields = ['id', 'posted_by', 'food_type', 'category', 'quantity_estimated', 'quantity_unit', 'image_url',
                  'pickup_start_time', 'pickup_end_time', 'expiry_time', 'status', 'created_at', 
                  'contact_person_name', 'contact_person_phone', 'pickup_address', 'pickup_city', 'pickup_longitude', 'pickup_latitude',
                  'notes', 'distance_km'
        ]
        read_only_fields = ['id', 'posted_by', 'created_at', 'distance_km', 'status']

    @extend_schema_field(serializers.FloatField(allow_null=True))
    def get_distance_km(self, obj):
        user_latitude = self.context.get('user_latitude')
        user_longitude = self.context.get('user_longitude')

        print("USER LAT:", self.context.get('user_latitude'))
        print("USER LNG:", self.context.get('user_longitude'))

        print("LISTING LAT:", obj.pickup_latitude)
        print("LISTING LNG:", obj.pickup_longitude)

        if  user_latitude is None or user_longitude is None:
            return None
        
        if obj.pickup_latitude is None or obj.pickup_longitude is None:
            return None
        
        distance = calculate_distance(
            float(user_latitude),
            float(user_longitude),
            float(obj.pickup_latitude),
            float(obj.pickup_longitude)
        )
        return distance