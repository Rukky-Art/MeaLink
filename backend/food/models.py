from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Food(models.Model):

    CATEGORY_CHOICES = [
        ('cooked', 'Cooked'),
        ('raw', 'Raw'),
        ('packaged', 'Packaged'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('claimed', 'Claimed'),
        ('expired', 'Expired'),
    ]

    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donor')
    food_type = models.CharField(max_length=1024)
    category = models.CharField(max_length=1024, choices=CATEGORY_CHOICES)
    quantity_estimated = models.PositiveIntegerField()
    quantity_unit = models.CharField(max_length=50)
    pickup_start_time = models.DateTimeField()
    pickup_end_time = models.DateTimeField()
    expiry_time = models.DateTimeField()
    contact_person_name = models.CharField(max_length=255, blank=True, null=True)
    contact_person_phone = models.CharField(max_length=20, blank=True, null=True)
    pickup_location = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    created_at = models.DateTimeField(auto_now_add=True)

# Create your models here.
