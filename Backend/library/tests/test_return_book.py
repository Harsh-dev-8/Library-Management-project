from rest_framework.test import APITestCase
from datetime import timedelta
from django.utils import timezone
from library.models import Book,Borrow_record,Fine
from accounts.models import User
from library.fake_data import BookFactory, BorrowRecordFactory, FineFactory, UserFactory, create_dummy_dataset
from django.urls import reverse
from rest_framework import status

#Return Book Tests
class ReturnBookTest(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def test_return_a_book(self):
        book = BookFactory(available=False)
        borrow_record = BorrowRecordFactory(user=self.user, book=book, return_date=None)

        url = reverse("ReturnBook")
        data = {"book": book.id}
        response = self.client.post(url,data,format="json")
    
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['message']) 

    def test_invaild_field_check_1(self):
        book = BookFactory(available=False)
        borrow_record = BorrowRecordFactory(user=self.user, book=book, return_date=None)

        url = reverse("ReturnBook")
        data = {"book": 99999}
        response = self.client.post(url,data,format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response.data['message']) 

    def test_havent_borrow_this_book_(self):
        book = BookFactory()
        borrow_record = BorrowRecordFactory(user=self.user, book=book, return_date=None)

        url = reverse("ReturnBook")
        data = {"book": book.id}
        response = self.client.post(url,data,format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response.data['message']) 

    def test_returning_someone_elses_borrowed_book(self):
        book = BookFactory(available=False)
        user = UserFactory()
        borrow_record = BorrowRecordFactory(user=user, book=book, return_date=None)
        
        url = reverse("ReturnBook")
        data = {"book": book.id}
        response = self.client.post(url,data,format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response.data['message']) 

    def test_already_returned_book(self):
        book = BookFactory()
        borrow_record = BorrowRecordFactory(user=self.user, book=book,borrowed_date=timezone.now(),expected_return_date=timezone.now()+timedelta(days=5), return_date=timezone.now()+timedelta(days=4))

        url = reverse("ReturnBook")
        data = {"book": book.id}
        response = self.client.post(url,data,format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response.data['message']) 







