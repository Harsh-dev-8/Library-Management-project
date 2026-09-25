import factory
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from library.models import Book, Borrow_record, Fine

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ('username',)

    username = factory.Sequence(lambda n: f"test_user_{n}")
    role = "member"

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        password = kwargs.pop("password", "12345")
        user = super()._create(model_class, *args, **kwargs)
        user.set_password(password)
        user.save()
        return user

class BookFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Book

    title = factory.Sequence(lambda n: f"Book Title {n}")
    author = factory.Faker("name")
    category = factory.Iterator(["Fiction", "Science Fiction", "Self Improvement", "Business", "Programming"])
    available = True

class BorrowRecordFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Borrow_record

    book = factory.SubFactory(BookFactory)
    user = factory.SubFactory(UserFactory)
    expected_return_date = factory.LazyFunction(lambda: timezone.now() + timedelta(days=7))
    return_date = None

class FineFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Fine

    borrow_record = factory.SubFactory(BorrowRecordFactory)
    user = factory.SelfAttribute("borrow_record.user")
    book = factory.SelfAttribute("borrow_record.book")
    amount = 100.00
    fine_days = 1
    status = "unpaid"


def create_dummy_dataset(count=5):
    """
    Production-grade helper to generate `count` dummy instances of each model
    on-demand inside tests or database sessions, wiring relationships explicitly
    to avoid duplicate cascade generation.
    """
    books = BookFactory.create_batch(count)
    borrow_records = [BorrowRecordFactory(book=books[i]) for i in range(count)]
    fines = [FineFactory(borrow_record=borrow_records[i], book=books[i], user=borrow_records[i].user) for i in range(count)]
    return {
        "books": books,
        "borrow_records": borrow_records,
        "fines": fines,
    }
