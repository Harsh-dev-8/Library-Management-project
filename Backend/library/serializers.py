from rest_framework import serializers
from django.contrib.auth.models import User
from library.models import Book,Borrow_record
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User.objects.create_user(password=password, **validated_data)

        return user

# Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)

# Get all books Serializer
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

# Borrow Book Serializer
class BorrowBookSerializer(serializers.ModelSerializer):
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

        if record >= 5:
            raise serializers.ValidationError("You can't borrow more than 5 books!")

        return data