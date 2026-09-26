from django.urls import path
from . import views

urlpatterns = [
    path('GetBooks/', views.GetBooksAPIView.as_view(),name='GetBooks'),
    path('BorrowBook/', views.BorrowBookAPIView.as_view(),name='BorrowBook'),
    path('ReturnBook/', views.ReturnBookAPIView.as_view(),name='ReturnBook'),
    path('GetFine/', views.GetFineAPIView.as_view(),name='GetFine'),
    path('MyBooks/',views.MyBooks.as_view(),name='MyBooks'),
    path('PayFine/',views.PayFine.as_view(),name='PayFine')
]
