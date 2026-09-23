from rest_framework import serializers
from library.models import Book,Borrow_record,Fine
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
        fields = ['expected_return_date', 'book']

    def validate_book(self,data):
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

        # Couldn't borrow more than 5 books!
        record = Borrow_record.objects.filter(user=user,return_date=None).count()
        if record >= 6:
            raise serializers.ValidationError("You can't borrow more than 5 books!")
        # Couldn't borrow if fine is 3+
        fine = Fine.objects.filter(user=user,status='unpaid').count()
        if fine >= 3:
            raise serializers.ValidationError("You have to pay your fines to borrow more books!")
        return data

# Return Book Serializer
class ReturnBookSerializer(serializers.Serializer):
    book = serializers.IntegerField()

    def validate(self,data):
        try:
            book = Book.objects.get(id=data['book'])
        except Book.DoesNotExist:
            raise serializers.ValidationError("Book doesn't exist")
        
        if book.available:
            raise serializers.ValidationError("You haven't borrowed this book!")

        user = self.context['request'].user
        try:
            record = Borrow_record.objects.get(user=user,book=book,return_date=None)
        except Borrow_record.DoesNotExist:
            raise serializers.ValidationError("record doesn't exist")
        
        mydata = {
            "book": book,
            "record": record}
        return mydata

#GetFine Serializer
class GetFineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fine
        fields = '__all__'

#MyBooks Serializer
class MyBooksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Borrow_record
        fields = ['book','borrowed_date','expected_return_date']

#Pay Fine Serializer
class PayFineSerializer(serializers.Serializer):
    fine_id = serializers.IntegerField(max_value=999)

    def validate_fine_id(self,data):
        user = self.context['request'].user
        fine = None
        try:
            fine = Fine.objects.get(id=data,user=user,status='unpaid')
        except Fine.DoesNotExist:
            raise serializers.ValidationError("Fine doesn't exist")
        return fine
