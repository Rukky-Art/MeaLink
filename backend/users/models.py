import secrets
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields): 
        if not email:
            raise ValueError("Email is required")
        
        email = self.normalize_email(email) 
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields): # The create_superuser method is responsible for creating a superuser. It takes an email, password, and any additional fields as arguments. It sets the is_staff and is_superuser fields to True, checks if they are set correctly, and then calls the create_user method to create the superuser.
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')  # Set role to 'admin' for superusers

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('donor', 'Donor'),
        ('partner', 'Partner'),
        ('receiver', 'Receiver'),
        ('admin', 'Admin'),
    )

    DONOR_TYPE_CHOICES = [
        ('restaurant', 'Restaurant'),
        ('hotel', 'Hotel'),
        ('catering', 'Catering'),
        ('supermarket', 'Supermarket'),
        ('bakery', 'Bakery'),
        ('event center', 'Event Center'),
        ('cafeteria', 'Cafeteria'),
        ('other', 'Other'),
    ]

    PARTNER_TYPE_CHOICES = [
        ('food bank', 'Food Bank'),
        ('ngo', 'NGO'),
        ('religious organization', 'Religious Organization'),
        ('shelter', 'Shelter'),
        ('community coordinator', 'Community Coordinator'),
        ('local volunteer group', 'Local Volunteer Group'),
        ('other', 'Other'),
    ]

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)  # 'donor' or 'receiver' or 'admin'
    business_registration_number = models.CharField(max_length=100, blank=True, null=True)  #for donors and partners
    organisation_type = models.CharField(max_length=225, choices=DONOR_TYPE_CHOICES + PARTNER_TYPE_CHOICES, blank=True, null=True)  #only for donors
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'role', 'city', 'country']

    def __str__(self):
        return self.email

def generate_token():
        return secrets.token_urlsafe(32)  # generates a secure random token

def default_expiry():
    return timezone.now() + timedelta(hours=1)

class EmailVerificationToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='email_verification_tokens')
    token = models.CharField(max_length=64, unique=True, default=generate_token)  
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_expiry)
    is_used = models.BooleanField(default=False)

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    def __str__(self):
        return f"Verification token for {self.user.email}"
    
class PasswordResetToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.CharField(max_length=64, unique=True, default=generate_token)  
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_expiry)
    is_used = models.BooleanField(default=False)

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    def __str__(self):
        return f"Password reset token for {self.user.email}"