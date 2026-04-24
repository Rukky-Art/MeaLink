from users.models import User
from django.contrib.auth import get_user_model

from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

User = get_user_model()

# Create your tests here.

class UserRegistrationTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpassword",
            name="Test User",
            role="donor",
            organisation_type="restaurant",
            address="123 Test Street",
            city="Test City",
            country="Test Country",
        )

        self.admin_user = User.objects.create_superuser(
            email="admin@example.com",
            password="adminpassword",
            name="Admin User",
            role="admin",
            city="Admin City",
            country="Admin Country"
        )

        self.user_data = {
            "email": "newuser@example.com",
            "password": "newpassword",
            "name": "New User",
            "role": "receiver",
            "organisation_type": "restaurant",
            "address": "123 New Street",
            "city": "New City",
            "country": "New Country"
        }

    def test_user_registration(self):
        url = reverse('register')
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(User.objects.get(email="newuser@example.com").name, "New User")

    def test_user_registration_with_existing_email(self):
        url = reverse('register')
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Attempt to register with the same email again
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_registration_without_required_fields(self):
        url = reverse('register')
        incomplete_data = {
            #if email is missing
            "password": "incompletepassword",
            "name": "Incomplete User",
            "role": "donor",
            "organisation_type": "restaurant",
            "address": "123 Incomplete Street",
            "city": "Incomplete City",
            "country": "Incomplete Country"
        }
        response = self.client.post(url, incomplete_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_donor_registration_without_organisation_type(self):
        url = reverse('register')
        donor_data = {
            "email": "donor@example.com",
            "password": "donorpassword",
            "name": "Donor User",
            "role": "donor",
            # organisation_type is missing
            "address": "123 Donor Street",
            "city": "Donor City",
            "country": "Donor Country",
        }
        response = self.client.post(url, donor_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_registration_with_invalid_role(self):
        url = reverse('register')
        data = self.user_data.copy()
        data['role'] = 'leader'  # Invalid role
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_is_not_returned_in_response(self):
        url = reverse('register')
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn('password', response.data)



    def test_get_user_list_as_admin(self):
        # Create an admin user
        # Authenticate as the admin user
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('user-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # We have 2 users: the one created in setUp and the admin user

    def test_get_user_list_as_non_admin(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_user_list_unauthenticated(self):
        url = reverse('user-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

  

    def test_user_str_returns_email(self):
        self.assertEqual(str(self.user), "test@example.com")

    def test_user_is_active_by_default(self):
        self.assertTrue(self.user.is_active)

    def test_superuser_has_is_staff_true(self):
        self.assertTrue(self.admin_user.is_staff)
        self.assertTrue(self.admin_user.is_superuser)