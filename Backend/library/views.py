from rest_framework.response import Response
from rest_framework.views import APIView
from library.serializers import RegisterSerializer,LoginSerializer,BookSerializer,BorrowBookSerializer
from rest_framework import status
from django.contrib.auth import authenticate,login,logout
from library.models import Book,Borrow_record
from rest_framework.permissions import AllowAny
from django.utils import timezone

# Register
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("Your Account has been created successfully",status=status.HTTP_201_CREATED)    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            user = authenticate(**serializer.validated_data)

        if user is not None:
            login(request, user)
            return Response({"message": f"{request.user} successfully logged in"},status=status.HTTP_200_OK)

        return Response({"message": "invaild credentials"},status=status.HTTP_400_BAD_REQUEST)

# Logout
class LogoutAPIView(APIView):
    def get(self,request):
        logout(request)
        return Response({"message": f"{request.user} successfully logged out"},status=status.HTTP_200_OK)

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
        try:
            book = Book.objects.get(id=request.data.get('book_id'))
        except book.DoesNotExist:
            return Response({"message": "Book Doesn't Exist!"})

        record = Borrow_record.objects.get(user=request.user, book_id=book)

        record.return_date = timezone.now()
        record.save()

        return Response({"message": f"{book} is returned successfully"})