from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('', views.home, name='home'),
    path('logout/', views.logout_view, name='logout'),
    path("record_view/<int:book_id>/", views.record_view, name="record_view"),
    path('register/', views.register, name='register'),
    path('return_book/<int:book_id>/', views.return_book, name='return_book')
]