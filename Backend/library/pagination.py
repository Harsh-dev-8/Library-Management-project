from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 10

    def get_paginated_response(self,data):
        return Response({
            "total_books": self.page.paginator.count,
            "next_page": self.get_next_link(),
            "previous_page": self.get_previous_link(),
            "books": data
            }) 
