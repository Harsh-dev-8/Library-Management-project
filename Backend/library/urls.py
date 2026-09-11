from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/register/', views.RegisterAPIView.as_view()),
    path('api/v1/login/', views.LoginAPIView.as_view()),
    path('api/v1/logout/', views.LogoutAPIView.as_view()),
    path('api/v1/home/', views.HomeAPIView.as_view())
]