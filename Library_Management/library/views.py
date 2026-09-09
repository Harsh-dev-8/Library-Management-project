from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse,JsonResponse
from library.models import Book, Borrow_record
from django.contrib.auth import login,authenticate,logout,get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from django.db.models.functions import Now



def login_view(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username,password=password)
        

        if user is not None:
            login(request, user)
            return redirect("home")

        else:
            messages.error(request, "Invalid username or password.")
    return render(request,"login.html")


@login_required(login_url="/login/")
def home(request):
    books_obj = Book.objects.all()
    my_borrow_books = Borrow_record.objects.filter(user=request.user, return_date__isnull=True)

    return render(request, "home.html",
    {
        "books": books_obj,
        "my_borrow_book": my_borrow_books,
    })


def logout_view(request):
    logout(request)
    return redirect("login")

def register(request):
    if request.method == "POST":
        fname= request.POST["fname"]
        lname= request.POST["lname"]
        username= request.POST["username"]
        email= request.POST["email"]
        password= request.POST["password"]
        confirm_password= request.POST["confirm-password"]

        if User.objects.filter(username=username).exists():
            messages.error(request, "please enter another username")

        elif password != confirm_password:
            messages.error(request, "password and confirm password didn't matched")
        else:
            user = User.objects.create_user(
            first_name=fname,
            last_name=lname,
            username=username,
            email=email,
            password=password)

            return redirect("login")

    return render(request, 'register.html')

@login_required(login_url="/login/")
def record_view(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    
    if not book.available:
        return HttpResponse("The book is not available")
    
    if request.method == "POST":
        date = request.POST["date"]

        record = Borrow_record()

        record.expected_return_date = date
        record.book = book
        record.user = request.user

        book.available = False

        book.save()
        record.save()

        return redirect("home")
    return HttpResponse("invaild request method")

@login_required(login_url="/login/")
def return_book(request, book_id):
    if request.method == "POST":
        book = get_object_or_404(Book, id=book_id)
        # Find the exact borrow record for this user and book
        record = Borrow_record.objects.filter(user=request.user, book=book, return_date__isnull=True).first()
        
        if record:
            record.return_date = Now()
            record.save()
            
            book.available = True
            book.save()
            
        return redirect("home")
    return redirect("home")