from django.urls import path
from . import views

urlpatterns = [
    path('GetBooks/', views.GetBooksAPIView.as_view()),
    path('BorrowBook/', views.BorrowBookAPIView.as_view()),
    path('ReturnBook/', views.ReturnBookAPIView.as_view()),
    path('GetFine/', views.GetFineAPIView.as_view())
]