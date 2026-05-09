from rest_framework import serializers
from claims.models import Claim
from users.serializers import UserSerializer


class ClaimCreateSerializer(serializers.ModelSerializer):
    #only sends food id
    class Meta:
        model = Claim
        fields = ['food']

class ClaimDetailSerializer(serializers.ModelSerializer):
    #used when viewing a claim
    class Meta:
        model = Claim
        fields = ['id', 'food', 'claimer', 'pickup_code', 'pickup_code_verified', 
                  'pickup_time', 'status', 'claim_time']
        
        read_only_fields = ['id', 'claimer', 'pickup_code', 'pickup_code_verified', 
                            'pickup_time', 'status', 'claim_time']
        
class VerifyPickupCodeSerializer(serializers.Serializer):
    # used when donor enters pickup code
    # Not a ModelSerializer because we're not creating anything
    pickup_code = serializers.CharField(max_length=4)

# class ClaimDonorSerializer(serializers.ModelSerializer):
#     # Donors see claims but NOT the pickup code
#     class Meta:
#         model = Claim
#         fields = [
#             'id', 'food', 'claimer',
#             'status', 'claim_time', 'pickup_time'
#             # pickup_code intentionally excluded 
#         ]