from rest_framework.pagination import PageNumberPagination

class EventPaginator(PageNumberPagination):
    page_size = 2