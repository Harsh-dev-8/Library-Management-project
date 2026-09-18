from rest_framework.response import Response
from rest_framework.views import APIView
from library.serializers import BookSerializer,BorrowBookSerializer,ReturnBookSerializer
from rest_framework import status
from library.models import Book,Borrow_record
from rest_framework.permissions import AllowAny
from django.utils import timezone
from .services import calculate_fine

# Get all Books
class GetBooksAPIView(APIView):
    def get(self,request):
        books = Book.objects.all()
        serializer = BookSerializer(books,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Borrow Book 
class BorrowBookAPIView(APIView):
    def post(self, request):
        serializer = BorrowBookSerializer(data=request.data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
        
        book = serializer.validated_data['book_id']
        book.available = False
        book.save()

        return Response({"message:": f"you have successfully borrowed {book}"})

# Return Book 
class ReturnBookAPIView(APIView):
    def post(self,request):
        serializer = ReturnBookSerializer(data=request.data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            record = serializer.validated_data.get('record')
            book = serializer.validated_data.get('book')

            record.return_date = timezone.now()
            record.save()
            book.available = True
            book.save()
            serializer.validated_data['request'] = request

            calculate_fine(serializer.validated_data)

            return Response({"message": f"{book} is returned successfully"})

class GetFineAPIView(APIView):
    pass