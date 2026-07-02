from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token

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

class LoginTests(APITestCase):
    def setUp(self):
        self.login_url = reverse('login')
        self.user = User.objects.create_user(
            username="loginuser",
            email="login@example.com",
            password="testpassword123"
        )
        self.valid_payload = {
            "username": "loginuser",
            "password": "testpassword123"
        }

    def test_successful_login(self):
        response = self.client.post(self.login_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertEqual(response.data['username'], "loginuser")
        self.assertEqual(response.data['email'], "login@example.com")

    def test_invalid_password(self):
        payload = self.valid_payload.copy()
        payload['password'] = "wrongpassword"
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_non_existent_user(self):
        payload = {
            "username": "doesnotexist",
            "password": "somepassword"
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_missing_credentials(self):
        response = self.client.post(self.login_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class LogoutTests(APITestCase):
    def setUp(self):
        self.logout_url = reverse('logout')
        self.user = User.objects.create_user(
            username="logoutuser",
            email="logout@example.com",
            password="testpassword123"
        )
        self.token = Token.objects.create(user=self.user)

    def test_successful_logout(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.post(self.logout_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Successfully logged out.")
        self.assertFalse(Token.objects.filter(key=self.token.key).exists())

    def test_unauthenticated_logout(self):
        response = self.client.post(self.logout_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

