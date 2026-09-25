from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.serializers import RegisterSerializer, LoginSerializer 
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema,OpenApiResponse
# Create your views here.

# Register
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(
        request=RegisterSerializer,
        responses={201: OpenApiResponse(description="Account created successfully")})

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Your Account has been created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login
class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(
        request=LoginSerializer,
        responses={200: OpenApiResponse(description="Successfully logged in")})

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = authenticate(**serializer.validated_data)

        if user is not None:
            login(request, user)
            return Response({"message": f"{request.user} successfully logged in"}, status=status.HTTP_200_OK)

        return Response({"message": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# Logout
class LogoutAPIView(APIView):
    @extend_schema(
        request=None,
        responses={200: OpenApiResponse(description="Successfully logged out")})
    def get(self, request):
        logout(request)
        return Response({"message": f"{request.user} successfully logged out"}, status=status.HTTP_200_OK)
