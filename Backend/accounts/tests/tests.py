from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from accounts.models import User

# Create your tests here.
class RegisterTest(APITestCase):
    def test_registering_a_user(self):
        url = reverse('register')
        data = {"username": "test_user","password": "12345"}
        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'test_user')

    def test_invalid_fields(self):
        url = reverse('register')
        data = {"username": 21411348,"password":"12345"}
        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn("username must not be only integers", response.data['username'])

    def test_empty_fields(self):
        url = reverse('register')
        data = {"username": "","password":""}
        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('username', response.data)
        self.assertIn('password', response.data)
        self.assertIn("This field may not be blank", response.data['username'][0])

    def test_duplicate_user(self):
        user = User.objects.create_user(username='test_user',password='test_user_password')
        
        url = reverse('register')
        data = {"username": "test_user","password":"test_user_password"}
        response = self.client.post(url,data,format='json')
        self.assertIn("This username already exists", response.data['username'])
         
#Login Tests
class LoginTest(APITestCase):
    def test_login_a_user(self):
        User.objects.create_user(username='test_user',password='test_user_password')
        url = reverse('login')
        data = {"username": "test_user","password":"test_user_password"}
        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual('test_user successfully logged in', response.data['message'])

    def test_wrong_password(self):
        User.objects.create_user(username='test_user',password='test_user_password')
        url = reverse('login')
        data = {"username": "test_user","password":"wrong_password"}
        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code, 401)
        self.assertIn('invalid credentials', response.data['message'])

    def test_if_user_doesnt_exist(self):
        url = reverse('login')
        data = {"username": "test_user","password":"test_user_password"}
        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code, 401)
        self.assertIn('invalid credentials', response.data['message'])
