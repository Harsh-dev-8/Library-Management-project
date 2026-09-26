from rest_framework.test import APITestCase
from datetime import timedelta,datetime
from library.models import Book,Borrow_record,Fine
from accounts.models import User
from library.fake_data import BookFactory, BorrowRecordFactory, FineFactory, UserFactory, create_dummy_dataset
from django.urls import reverse
from rest_framework import status

#Borrow Book 
class Borrow_Book_Test(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def test_borrowing_a_book(self):
        book = BookFactory()
        url = reverse('BorrowBook') 
        data = {"book": book.id, "expected_return_date": datetime.now() + timedelta(days=5)}
        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertTrue(response.data['message'])

    def test_invalid_field_1(self):
        url = reverse('BorrowBook') 
        data1 = {"book": 9990443, "expected_return_date": 5985235}
        response1 = self.client.post(url,data1,format='json')

        self.assertEqual(response1.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertIn('book',response1.data)
        self.assertIn('expected_return_date',response1.data)
        self.assertTrue(response1.data['book'])
        self.assertTrue(response1.data['expected_return_date'])

    def test_invalid_field_2(self):
        url = reverse('BorrowBook') 
        data2 = {"book": "fsja", "": "djgsjdg"}
        response2 = self.client.post(url,data2,format='json')

        self.assertEqual(response2.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertIn('book',response2.data)
        self.assertIn('expected_return_date',response2.data)
        self.assertTrue(response2.data['book'])
        self.assertTrue(response2.data['expected_return_date'])

    def test_invalid_field_3(self):
        url = reverse('BorrowBook') 
        data3 = {"": 1, "expected_return_date": ""}
        response3 = self.client.post(url,data3,format='json')

        self.assertEqual(response3.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertIn('book',response3.data)
        self.assertIn('expected_return_date',response3.data)
        self.assertTrue(response3.data['book'])
        self.assertTrue(response3.data['expected_return_date'])

    def test_book_availablility(self):
        book = BookFactory(available=False)

        url = reverse('BorrowBook') 
        data  = {"book": book.id, "expected_return_date":datetime.now() + timedelta(days=5)}
        response= self.client.post(url,data,format='json')
        self.assertEqual(response.status_code,status.HTTP_409_CONFLICT)
        self.assertTrue(response.data['book'])

    def test_expected_return_date_validation(self):
        book = BookFactory()
        url = reverse('BorrowBook') 

        # Checks if date is in past
        data1  = {"book": book.id, "expected_return_date":datetime.now() + timedelta(days=-5)}
        response1 = self.client.post(url,data1,format='json')
        self.assertEqual(response1.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response1.data['expected_return_date'])

        # Checks if date is within 1 month
        data2  = {"book": book.id, "expected_return_date":datetime.now() + timedelta(days=35)}
        response2 = self.client.post(url,data2,format='json')
        self.assertEqual(response2.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response2.data['expected_return_date'])

    def test_can_not_borrow_more_than_5_books(self, count=5):
        book1 = BookFactory()
        books = BookFactory.create_batch(count)
        Borrow_records = [BorrowRecordFactory(book=books[i], user=self.user) for i in range(count)]
        data = {"book": book1.id, "expected_return_date": datetime.now() + timedelta(days=5)}
        url = reverse("BorrowBook")

        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.assertTrue(response.data['message'])

    def test_cant_borrow_if_3_or_more_unpaid_fines(self,count=3):
        book1 = BookFactory()
        books = BookFactory.create_batch(count)
        Borrow_records = [BorrowRecordFactory(book=books[i], user=self.user) for i in range(count)]
        fines = [FineFactory(
            borrow_record=Borrow_records[i], book=books[i], user=Borrow_records[i].user) for i in range(count)]

        data = {"book": book1.id, "expected_return_date": datetime.now() + timedelta(days=5)}
        url = reverse("BorrowBook")
        response = self.client.post(url,data,format='json')

        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.assertTrue(response.data['message'])
        








