import django_filters
from .models import Book

class BookFilter(django_filters.FilterSet):
    author = django_filters.CharFilter(field_name="author", lookup_expr="icontains")
    title = django_filters.CharFilter(field_name="title", lookup_expr="icontains")
    category = django_filters.CharFilter(field_name="category", lookup_expr="icontains")
    available = django_filters.BooleanFilter(field_name="available")
    
    class Meta:
        model = Book
        fields = ['title','author','category','available']
