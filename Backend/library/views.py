from rest_framework.response import Response
from rest_framework.views import APIView
from library.serializers import RegisterSerializer,LoginSerializer,BookSerializer
from rest_framework import status
from django.contrib.auth import authenticate,login,logout
from library.models import Book,Borrow_record
from rest_framework.permissions import AllowAny

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("Account has been created successfully",status=status.HTTP_201_CREATED)    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            user = authenticate(**serializer.validated_data)

        if user is not None:
            login(request, user)
            return Response({"message": "successfully logged in"})

        return Response({"message": "invaild credentials"})

class LogoutAPIView(APIView):
    def get(self,request):
        logout(request)
        return Response({"message": "successfully logged out"})

class GetBooksAPIView(APIView):
    def get(self,request):
        books = Book.objects.all()
        serializer = BookSerializer(books,many=True)
        return Response(serializer.data)