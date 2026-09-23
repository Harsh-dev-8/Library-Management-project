from django.contrib import admin
from .models import Fine,Borrow_record

# Register your models here.
class BorrowRecord(admin.ModelAdmin):
    list_display = ('book','user','borrowed_date','expected_return_date','return_date')

class Fines(admin.ModelAdmin):
    list_display = ('user','book','borrow_record', 'amount', 'fine_days','status', 'created_at')

admin.site.register(Borrow_record, BorrowRecord)
admin.site.register(Fine, Fines)
