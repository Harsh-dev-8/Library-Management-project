from rest_framework import serializers
from library.models import Book,Borrow_record
from django.utils import timezone
from datetime import timedelta
from .services import calculate_fine
import zoneinfo

# Get all books Serializer
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

# Borrow Book Serializer
class BorrowBookSerializer(serializers.ModelSerializer):
    expected_return_date = serializers.DateTimeField(
        default_timezone=zoneinfo.ZoneInfo("Asia/Kolkata")
    )
    class Meta:
        model = Borrow_record
        fields = ['expected_return_date', 'book_id']

    def validate_book_id(self,data):
        if not data.available:
            raise serializers.ValidationError("The Book is unavailable")
        return data
        
    def validate_expected_return_date(self,data):
        if data <= timezone.now():
            raise serializers.ValidationError("Date must be in future!")

        if data >= timezone.now() + timedelta(days=30):
            raise serializers.ValidationError("You can't borrow a book more than 30 days!")
        
        return data

    def validate(self,data):
        user = self.context['request'].user

        # Only count active records
        record = Borrow_record.objects.filter(user=user,return_date=None).count()
        if record >= 6:
            raise serializers.ValidationError("You can't borrow more than 5 books!")
        return data

# Return Book Serializer
class ReturnBookSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()

    def validate(self,data):
        try:
            book = Book.objects.get(id=data['book_id'])
        except Book.DoesNotExist:
            raise serializers.ValidationError("Book doesn't exist")
        
        if book.available:
            raise serializers.ValidationError("You haven't borrowed this book!")

        user = self.context['request'].user
        try:
            record = Borrow_record.objects.get(user=user,book_id=book,return_date=None)
        except Borrow_record.DoesNotExist:
            raise serializers.ValidationError("record doesn't exist")
        
        mydata = {
            "book": book,
            "record": record}
        return mydata