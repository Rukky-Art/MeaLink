from rest_framework import serializers
from claims.models import Claim
from distribution.models import Distribution

class DistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Distribution
        fields = ['id', 'claim', 'distributed_time', 'recipients_count', 'households_served', 'notes']
        read_only_fields = ['id', 'distributed_time']