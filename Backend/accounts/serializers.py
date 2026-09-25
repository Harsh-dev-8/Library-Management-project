from rest_framework import serializers
from django.db import IntegrityError
from django.contrib.auth import get_user_model
User = get_user_model()

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=150)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self,value):
        if value.isdigit():
            raise serializers.ValidationError("username must not be only integers")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')

        try:
            user = User.objects.create_user(password=password, **validated_data)
        except IntegrityError:
            raise serializers.ValidationError({"username": "This username already exists"})

        return user

# Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
