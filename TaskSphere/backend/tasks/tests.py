from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from .models import Task

class TaskAPITests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="user1", password="password123")
        self.user2 = User.objects.create_user(username="user2", password="password123")
        
        self.token1 = Token.objects.create(user=self.user1)
        self.token2 = Token.objects.create(user=self.user2)
        
        self.task1 = Task.objects.create(title="User 1 Task", description="User 1 Desc", owner=self.user1)
        self.task2 = Task.objects.create(title="User 2 Task", description="User 2 Desc", owner=self.user2)
        
        self.list_create_url = reverse('task-list')
        self.detail_url1 = reverse('task-detail', kwargs={'pk': self.task1.id})
        self.detail_url2 = reverse('task-detail', kwargs={'pk': self.task2.id})

    def test_unauthenticated_access(self):
        self.client.credentials()
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.post(self.list_create_url, {"title": "New Task"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_task(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        payload = {"title": "Task created by User 1", "description": "Some description", "status": "In Progress"}
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], payload['title'])
        self.assertEqual(response.data['owner'], self.user1.username)

        task = Task.objects.get(id=response.data['id'])
        self.assertEqual(task.owner, self.user1)
        self.assertEqual(task.status, "In Progress")

    def test_list_tasks(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.task1.id)

    def test_retrieve_task_owner(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.get(self.detail_url1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.task1.title)

    def test_retrieve_task_non_owner(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.get(self.detail_url2)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_task_owner(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        payload = {"title": "Updated Title", "status": "Completed"}
        response = self.client.put(self.detail_url1, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], payload['title'])
        self.assertEqual(response.data['status'], payload['status'])

        self.task1.refresh_from_db()
        self.assertEqual(self.task1.title, "Updated Title")
        self.assertEqual(self.task1.status, "Completed")

    def test_update_task_non_owner(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        payload = {"title": "Updated Title by Non-owner"}
        response = self.client.put(self.detail_url2, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_task_owner(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.delete(self.detail_url1)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(id=self.task1.id).exists())

    def test_delete_task_non_owner(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.delete(self.detail_url2)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Task.objects.filter(id=self.task2.id).exists())
