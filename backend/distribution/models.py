from django.db import models
from claims.models import Claim


class Distribution(models.Model):
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, related_name='distribution')
    distributed_time = models.DateTimeField(auto_now_add=True)
    recipients_count = models.PositiveIntegerField() 
    households_served = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)  

    def __str__(self):
        return f"Distribution for {self.claim}"

# Create your models here.
