from django.template.context_processors import request

from .models import (
    User, Event,TicketClass, Ticket, Payment, Notification, Rating,
    Report, ChatMessage, EventSuggestion, DiscountCode, TicketDiscount
)
from rest_framework import serializers

class TicketClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketClass
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(source='image')
    def get_image(self, event):

        if event.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri('/static/%s' % event.image.name)
            return '/static/%s' % event.image.name
    class Meta:
        model = Event
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','avatar','email','username','password']
        extra_kwargs ={
            'password':{
                'write_only': True
            }
        }

    def create(self, validated_data):
        data = validated_data.copy()
        user = User(**data)
        user.set_password(data['password'])
        user.save()
        return user
