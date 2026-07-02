from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class RegistrationTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.valid_payload = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "strongpassword123",
            "password_confirm": "strongpassword123"
        }

    def test_successful_registration(self):
        response = self.client.post(self.register_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], "testuser")
        self.assertEqual(response.data['email'], "test@example.com")
        self.assertIn("message", response.data)
        
        user = User.objects.get(username="testuser")
        self.assertTrue(user.check_password("strongpassword123"))

    def test_password_mismatch(self):
        payload = self.valid_payload.copy()
        payload['password_confirm'] = "differentpassword"
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password_confirm", response.data)

    def test_password_too_short(self):
        payload = self.valid_payload.copy()
        payload['password'] = "short"
        payload['password_confirm'] = "short"
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_duplicate_username(self):
        User.objects.create_user(username="testuser", email="other@example.com", password="somepassword")
        response = self.client.post(self.register_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

    def test_duplicate_email(self):
        User.objects.create_user(username="otheruser", email="test@example.com", password="somepassword")
        response = self.client.post(self.register_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
