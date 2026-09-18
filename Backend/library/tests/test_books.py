from django.test import TestCase,RequestFactory
from library.models import Book,Borrow_record,Fine
from django.contrib.auth import get_user_model
User = get_user_model()
from django.utils import timezone
from datetime import timedelta
from library.services import calculate_fine

# Create your tests here.
class FineCreationTest(TestCase):
    def test_fine_creation_when_book_returns_late(self):
        user = User.objects.create_user(username="harsh",password="harsh123")
        book = Book.objects.create(title="Rich dad poor dad", author="robert",category="knowledge",available=True)
        record = Borrow_record.objects.create(book_id=book,user=user,expected_return_date=timezone.now()-timedelta(days=5),return_date=timezone.now())
        factory = RequestFactory()
        request = factory.get("/")
        request.user = user
        data = {
            "record": record,
            "book": book,
            "request": request
        }
        calculate_fine(data)
        fine = Fine.objects.get(id=1)
        self.assertEqual(fine.amount,500)
        self.assertEqual(fine.status,'unpaid')
        
        