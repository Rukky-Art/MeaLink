from rest_framework import serializers
from claims.models import Claim
from users.serializers import UserSerializer
from drf_spectacular.utils import extend_schema_field

class FoodBasicSerializer(serializers.Serializer):
    # Nested food details inside claim response
    id = serializers.IntegerField(read_only=True)
    food_type = serializers.CharField(read_only=True)
    category = serializers.CharField(read_only=True)
    quantity_estimated = serializers.IntegerField(read_only=True)
    quantity_unit = serializers.CharField(read_only=True)
    image_url = serializers.URLField(read_only=True)
    pickup_address = serializers.CharField(read_only=True)
    pickup_city = serializers.CharField(read_only=True)
    pickup_start_time = serializers.DateTimeField(read_only=True)
    pickup_end_time = serializers.DateTimeField(read_only=True)
    contact_person_name = serializers.CharField(read_only=True)
    contact_person_phone = serializers.CharField(read_only=True)
    notes = serializers.CharField(read_only=True)
    status = serializers.CharField(read_only=True)

class ClaimerBasicSerializer(serializers.Serializer):
    # Basic partner info inside claim response
    id = serializers.IntegerField(read_only=True)
    business_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    phone_number = serializers.CharField(read_only=True)
    organisation_type = serializers.CharField(read_only=True)

class DonorBasicSerializer(serializers.Serializer):
    # Basic donor info inside claim response
    id = serializers.IntegerField(read_only=True)
    business_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    phone_number = serializers.CharField(read_only=True)


class ClaimCreateSerializer(serializers.ModelSerializer):
    # Only sends food id when creating a claim
    class Meta:
        model = Claim
        fields = ['food']

class ClaimDetailSerializer(serializers.ModelSerializer):
    # Full claim details for partners and admin, includes pickup code
    food = FoodBasicSerializer(read_only=True)
    claimer = ClaimerBasicSerializer(read_only=True)
    donor = serializers.SerializerMethodField()

    #used when viewing a claim
    class Meta:
        model = Claim
        fields = ['id', 'food', 'donor', 'claimer', 'pickup_code', 'pickup_code_verified', 
                  'pickup_time', 'status', 'claim_time']
        
        read_only_fields = ['id', 'food', 'donor', 'claimer', 'pickup_code', 'pickup_code_verified', 
                            'pickup_time', 'status', 'claim_time']

    @extend_schema_field(DonorBasicSerializer)  
    def get_donor(self, obj):
        donor = obj.food.posted_by
        return DonorBasicSerializer(donor).data
        
class ClaimDonorSerializer(serializers.ModelSerializer):
    # Donors see claims but NOT the pickup code
    food = FoodBasicSerializer(read_only=True)
    claimer = ClaimerBasicSerializer(read_only=True)

    class Meta:
        model = Claim
        fields = ['id', 'food', 'claimer', 'status', 'claim_time', 'pickup_time'] 
        
class VerifyPickupCodeSerializer(serializers.Serializer):
    # used when donor enters pickup code
    # Not a ModelSerializer because we're not creating anything
    pickup_code = serializers.CharField(max_length=4)
