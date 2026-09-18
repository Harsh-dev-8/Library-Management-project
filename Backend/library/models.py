from django.db import models
from django.conf import settings

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=50)
    author = models.CharField(max_length=50)
    category = models.CharField(max_length=50)
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.title 
    
class Borrow_record(models.Model):
    book_id = models.ForeignKey(Book,on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    borrowed_date = models.DateTimeField(auto_now_add=True) 
    expected_return_date = models.DateTimeField()
    return_date = models.DateTimeField(blank=True,null=True)

class Fine(models.Model):

    STATUS = [
        ("paid", "Paid"),
        ("unpaid", "Unpaid"),
        ("waived", "Waived")
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT)
    book = models.ForeignKey(Book,on_delete=models.CASCADE)
    borrow_record = models.OneToOneField(Borrow_record,on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    fine_days = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS)
    created_at = models.DateTimeField(auto_now_add=True)