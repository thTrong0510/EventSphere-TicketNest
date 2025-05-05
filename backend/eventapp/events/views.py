from rest_framework.response import Response

from . import serializers, paginators
from rest_framework.decorators import action
from rest_framework import viewsets, generics, status, parsers, permissions
from .models import (
    User, Event,TicketClass, Ticket, Payment, Notification, Rating,
    Report, ChatMessage, EventSuggestion, DiscountCode, TicketDiscount
)


# Create your views here.
class EventViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = serializers.EventSerializer
    pagination_class = paginators.EventPaginator
    lookup_field = 'name'

    def get_queryset(self): #tim kiem
        queries = self.queryset
        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(name__icontains=q)
        return queries
    @action(methods=['get'], detail=True)
    def ticket_class(self, request, name=None):
        event = self.get_object()
        if not event.active:
            return Response({"detail": "Event is not active."}, status=status.HTTP_404_NOT_FOUND)

        ticket_class = self.get_object().ticketclass_set.all()
        return Response(serializers.TicketClassSerializer(ticket_class, many= True).data, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ViewSet,generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True).all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.action.__eq__('current_user'):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['get'], url_name='current-user', detail=False)
    def current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)


