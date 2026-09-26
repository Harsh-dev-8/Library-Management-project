from rest_framework.test import APITestCase
from datetime import timedelta
from django.utils import timezone
from library.models import Book,Borrow_record,Fine
from accounts.models import User
from library.fake_data import BookFactory, BorrowRecordFactory, FineFactory, UserFactory, create_dummy_dataset
from django.urls import reverse
from rest_framework import status

#Fine Tests
class FineTest(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def test_fine_creation(self):
        book = BookFactory(available=False)
        borrow_record = BorrowRecordFactory(user=self.user, book=book,borrowed_date=timezone.now()-timedelta(days=6),expected_return_date=timezone.now()-timedelta(days=2))

        url = reverse("ReturnBook")
        data = {"book": book.id}
        response = self.client.post(url,data,format="json")
    
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['message']) 
        self.assertEqual(Fine.objects.filter(borrow_record=borrow_record,user=self.user,book=book).count(), 1)

    def test_fine_creation_if_book_return_on_time(self):
        book = BookFactory(available=False)
        borrow_record = BorrowRecordFactory(user=self.user, book=book,borrowed_date=timezone.now()-timedelta(days=6),expected_return_date=timezone.now()+timedelta(days=2))

        url = reverse("ReturnBook")
        data = {"book": book.id}
        response = self.client.post(url,data,format="json")
    
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['message']) 
        self.assertEqual(Fine.objects.filter(borrow_record=borrow_record,user=self.user,book=book).count(), 0)

# Pay Fine Test
class PayFineTest(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def test_paying_a_fine(self):
        book = BookFactory()
        borrow_record = BorrowRecordFactory(user=self.user, book=book, return_date=None)
        fine= FineFactory(borrow_record=borrow_record, book=book, user=self.user)

        url = reverse("PayFine")
        data = {"fine_id": fine.id}
        response = self.client.post(url,data,format="json")

        paid_fine = Fine.objects.get(user=self.user, book=book, borrow_record=borrow_record)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['message']) 
        self.assertEqual(paid_fine.status, "paid")


 





