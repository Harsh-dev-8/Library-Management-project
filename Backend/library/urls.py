from django.urls import path
from . import views

urlpatterns = [
    path('GetBooks/', views.GetBooksAPIView.as_view(),name='GetBooks'),
    path('BorrowBook/', views.BorrowBookAPIView.as_view(),name='BorrowBook'),
    path('ReturnBook/', views.ReturnBookAPIView.as_view()),
    path('GetFine/', views.GetFineAPIView.as_view()),
    path('MyBooks/',views.MyBooks.as_view()),
    path('PayFine/',views.PayFine.as_view()),
]
