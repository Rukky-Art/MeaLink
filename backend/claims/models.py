from django.db import models
from django.contrib.auth import get_user_model
from food.models import Food
import secrets

def generate_pickup_code():
    return secrets.token_hex(2).upper()  # generates a random 4-character hexadecimal code eg. 'A1B2'


User = get_user_model()

class Claim(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('picked up', 'Picked Up'),
        ('distributed', 'Distributed'),
        ('cancelled', 'Cancelled'),
    ]

    food = models.ForeignKey(Food, on_delete=models.CASCADE, related_name='claims')
    claimer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='claims')
    pickup_code = models.CharField(max_length=4, default=generate_pickup_code, unique=True)
    pickup_code_verified = models.BooleanField(default=False)  # set to True when code is verified during pickup
    pickup_time = models.DateTimeField(null=True, blank=True)   # set when code verified
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    claim_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.claimer.name} claimed {self.food.food_type}"


# Create your models here.
