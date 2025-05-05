from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from django.utils.safestring import mark_safe
from django.utils.html import mark_safe
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget

from .models import (
    Role, Event,TicketClass, Ticket, Payment, Notification, Rating,
    Report, ChatMessage, EventSuggestion, DiscountCode, TicketDiscount
)

User = get_user_model()

class TicketClassInline(admin.TabularInline):  # Hoac admin.StackedInline
    model = TicketClass

class NotificationForm(forms.ModelForm):
    message = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Notification
        fields = '__all__'

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name',  'email', 'role', 'avatar', 'username', 'password']

class UserAdmin(admin.ModelAdmin):
    form = UserForm
    list_display = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'created_at', 'updated_at']
    search_fields = ['last_name', 'email']
    list_filter = ['role']
    ordering = ['id']
    readonly_fields = ['avatarImage']
    def avatarImage(self, user):
        if user:
            return mark_safe(
                '<img src="/static/{url}" width="120" />' \
                    .format(url=user.avatar.name)
            )

    class Media:
        css = {
            'all': ('/static/css/style.css',)
        }


class RoleAdmin(admin.ModelAdmin):
    search_fields = ['name']


class EventAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'image', 'organizer', 'event_type', 'start_time', 'end_time','active']
    readonly_fields = ['created_at', 'updated_at','EventImage']
    def EventImage(self, event):
        if event:
            return mark_safe(
                '<img src="/static/{url}" width="120" />' \
                    .format(url=event.image.name)
            )
    search_fields = ['name']
    list_filter = ['event_type']
    list_display_links = ['name']
    date_hierarchy = 'start_time'
    autocomplete_fields = ['organizer']
    inlines = [TicketClassInline]

class TicketClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'event', 'price', 'type', 'total_available')
    list_filter = ('event', 'type')
    search_fields = ('name', 'event__name')

class TicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_class', 'user', 'ticket_code', 'price_paid', 'status', 'booked_at')
    list_filter = ('ticket_class__event', 'status')
    search_fields = ('ticket_code', 'user__email', 'ticket_class__name')
    readonly_fields = ('price_paid', 'booked_at')
    fieldsets = [
        (None, {
            'fields': ('ticket_class', 'user', 'status')
        })
    ]


class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'ticket', 'amount', 'payment_method', 'status', 'payment_time']
    readonly_fields = ['payment_time']
    search_fields = ['ticket__ticket_code']


class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'type', 'is_read', 'created_at']
    search_fields = ['message']
    list_editable = ['is_read']
    form = NotificationForm


class RatingAdmin(admin.ModelAdmin):
    list_display = ['id', 'event', 'user', 'rate', 'created_at']
    list_filter = ['rate']
    search_fields = ['event__title', 'user__username']


class ReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'event', 'total_tickets_sold', 'total_revenue', 'interest_score', 'generated_at']
    readonly_fields = ['generated_at']


class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'event', 'user', 'sent_at']
    search_fields = ['message']
    autocomplete_fields = ['user', 'event']


class EventSuggestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'preferred_type', 'created_at']
    list_filter = ['preferred_type']


class DiscountCodeAdmin(admin.ModelAdmin):
    list_display = ['id', 'code', 'discount_percent', 'valid_from', 'valid_to', 'usage_limit']
    list_editable = ['usage_limit']
    search_fields = ['code']


class TicketDiscountAdmin(admin.ModelAdmin):
    list_display = ['id', 'ticket', 'discount', 'applied_at']
    autocomplete_fields = ['ticket', 'discount']

admin.site.register(User, UserAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(TicketClass, TicketClassAdmin)
admin.site.register(Ticket, TicketAdmin)
admin.site.register(Payment, PaymentAdmin)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(Rating, RatingAdmin)
admin.site.register(Report, ReportAdmin)
admin.site.register(ChatMessage, ChatMessageAdmin)
admin.site.register(EventSuggestion, EventSuggestionAdmin)
admin.site.register(DiscountCode, DiscountCodeAdmin)
admin.site.register(TicketDiscount, TicketDiscountAdmin)
