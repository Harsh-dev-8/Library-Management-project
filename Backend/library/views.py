from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView 
from library.serializers import BookSerializer,BorrowBookSerializer,ReturnBookSerializer,GetFineSerializer,MyBooksSerializer,PayFineSerializer
from rest_framework import status
from library.models import Book,Borrow_record,Fine
from rest_framework.permissions import AllowAny
from django.utils import timezone
from .services import calculate_fine
from drf_spectacular.utils import extend_schema,OpenApiResponse
from .filter import BookFilter
from django_filters.rest_framework import DjangoFilterBackend

# Get all Books
class GetBooksAPIView(ListAPIView):
    serializer_class = BookSerializer
    ordering_fields = ['title','author','category']
    ordering = ['title', 'id']
    filterset_class = BookFilter    
    filter_backends = [DjangoFilterBackend,OrderingFilter]    

    def get_queryset(self):
        queryset = Book.objects.all()
        return queryset

# Borrow Book 
class BorrowBookAPIView(APIView):
    def post(self, request):
        serializer = BorrowBookSerializer(data=request.data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)

        book = serializer.validated_data['book']
        book.available = False
        book.save()

        return Response({"message": f"you have successfully borrowed {book}"},status=status.HTTP_201_CREATED)

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

# Get User's Fine
class GetFineAPIView(APIView):
    def get(self,request):
        fine = Fine.objects.filter(user=request.user,status="unpaid")
        serializer = GetFineSerializer(fine, many=True)
        return Response({"fine": serializer.data})

# MyBooks
class MyBooks(APIView):
    def get(self,request):
        books = Borrow_record.objects.filter(user=request.user,return_date=None)
        if not books.exists():
            return Response("You haven't borrow any book")
        serializer = MyBooksSerializer(books, many=True) 
        return Response({"books": serializer.data})

#Pay Fine
class PayFine(APIView):
    def post(self,request):
        serializer = PayFineSerializer(data=request.data,context={"request": request})
        if serializer.is_valid(raise_exception=True):
            fine = serializer.validated_data['fine_id']
            fine.status = 'paid'
            fine.save()
            return Response({"message": "Fine paid successfully"})





