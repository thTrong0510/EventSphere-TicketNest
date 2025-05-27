from django.conf import settings
from rest_framework.response import Response
from . import serializers, paginators, perms
from rest_framework.decorators import action
from rest_framework import viewsets, generics, status, parsers, permissions
from django.utils.timezone import now, localdate
from datetime import timedelta, datetime
from django.core.mail import send_mail, EmailMessage
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from django.db import transaction
from django.utils import timezone
import qrcode
from io import BytesIO
import uuid
from .momo import create_momo_payment
from .models import (
    User, Event,TicketClass, Ticket, Payment, Notification, Rating,
    Report, ChatMessage, EventSuggestion, DiscountCode, TicketDiscount, Like, Comment
)


#Event.
class EventViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    serializer_class = serializers.EventDetailSerializer
    pagination_class = paginators.EventPaginator

    def get_queryset(self):
        q = self.request.query_params.get("q")
        if q:
            return Event.objects.filter(active=True, name__icontains=q)
        return Event.objects.filter(active=True)

    #Chung thuc
    def get_permissions(self):
        if self.action in ['add_comment', 'like']:
            return [permissions.IsAuthenticated(), perms.IsAttendee()]
        elif self.action in ['create']:
            return [permissions.IsAuthenticated(), perms.IsOrganizer()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.action == 'create':
            return serializers.EventSerializer
        return serializers.EventDetailSerializer

    #Like event
    @action(methods=['post'], url_path='like', detail=True)
    def like(self, request, pk):
        like, created = Like.objects.get_or_create(user=request.user, event=self.get_object())
        if not created:
            like.active = not like.active
            like.save()
        return Response(serializers.EventDetailSerializer(self.get_object(),context={'request':request}).data, status=status.HTTP_200_OK)

    #Nhan xet su kien
    @action(methods=['post'], url_path='comments', detail=True)
    def add_comment(self, request, pk):
        c = Comment.objects.create(user=request.user, event=self.get_object(), content=request.data.get('content'))
        return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

    #Tim hang ve cua su kien
    @action(methods=['get'], detail=True)
    def ticket_class(self, request, pk):
        event = self.get_object()
        if not event.active:
            return Response({"detail": "Event is not active."}, status=status.HTTP_404_NOT_FOUND)

        ticket_class = event.ticketclass_set.all()
        return Response(serializers.TicketClassSerializer(ticket_class, many= True).data, status=status.HTTP_200_OK)

    #Lọc danh sách comment của event
    @action(methods=['get'], detail=True)
    def list_comments(self, request, pk):
        event = self.get_object()
        if not event.active:
            return Response({"detail": "Event is not active."}, status=status.HTTP_404_NOT_FOUND)

        comment = event.comment_set.all()
        return Response(serializers.CommentSerializer(comment, many=True).data, status=status.HTTP_200_OK)




#Xoa, Cap nhat nhan xet
class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView, generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.OwnerIsAuthenticated]


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

#Tạo hạng vé cho event (lọc theo id) events/<int:event_id>/add-ticket-class/
class TicketClassViewSet(viewsets.ViewSet, generics.CreateAPIView):
    serializer_class = serializers.TicketClassSerializer
    permission_classes = [perms.IsOrganizer]

    def create(self, request, event_id=None):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({'detail': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        if event.organizer != request.user:
            return Response({'detail': 'You are not the organizer of this event.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(data=request.data, context={'event': event})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#Thong bao
class EventReminderViewSet(viewsets.GenericViewSet):
    permission_classes = [perms.IsAdmin]

    @action(methods=['post'], detail=False)
    def send_reminder(self, request):
        today = now()
        target_date = today + timedelta(days=2)

        events = Event.objects.filter(start_time__date=target_date, active=True)
        sent_count = 0
        for event in events:
            tickets = Ticket.objects.filter(ticket_class__event=event).select_related('user')

            for ticket in tickets:
                user = ticket.user
                if user.email:
                    send_mail(
                        subject=f"[Nhắc nhở] Sự kiện '{event.name}' sắp diễn ra",
                        message=(
                            f"Xin chào {user.first_name or user.username},\n\n"
                            f"Sự kiện bạn đã đặt vé: '{event.name}' sẽ diễn ra vào lúc {event.start_time.strftime('%H:%M %d/%m/%Y')}.\n"
                            "Hãy chuẩn bị tham gia đúng giờ nhé!\n\n"
                            "Cảm ơn bạn đã sử dụng hệ thống đặt vé của chúng tôi."
                        ),
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=False
                    )
                sent_count += 1


        return Response({"message": f"Đã gửi {sent_count} email nhắc nhở thành công. {target_date}"}, status=status.HTTP_200_OK)


#Tìm sự kiện theo loại (có sẵn), và theo tên, mô tả (có chứa hoặc gần đúng)
class EventSearchView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Event.objects.filter(active=True)
    serializer_class = serializers.EventSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['event_type'] #Lọc chính xác theo loại sự kiện có sẵn
    search_fields = ['name', 'description'] #Lọc gần đúng theo tên, mô tả sự kiện
    permission_classes = [permissions.IsAuthenticated]


#Dat ve
class TicketViewSet(viewsets.ViewSet, generics.CreateAPIView):
    serializer_class = serializers.TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'check_in':
            return serializers.QRCheckInSerializer
        return serializers.TicketSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # Truyền context để dùng request.user trong serializer
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        # Kiểm tra đã thanh toán chưa
        # if not request.data.get('payment_confirmed', False):
        #     return Response({"error": "Bạn cần thanh toán trước qua MoMo hoặc VNPAY."},
        #                     status=status.HTTP_400_BAD_REQUEST)

        ticket = serializer.save()
        user = request.user
        event = ticket.ticket_class.event

        qr_file_path = serializers.TicketSerializer.create_qr_image(ticket.ticket_code)

        # Soạn email có file đính kèm QR
        email = EmailMessage(
            subject=f"[Đặt vé thành công] {event.name}",
            body=(
                f"Xin chào {user.get_full_name() or user.username},\n\n"
                f"Bạn đã đặt vé thành công cho sự kiện: {event.name}.\n"
                f"Thời gian: {event.start_time.strftime('%H:%M %d/%m/%Y')}\n"
                f"Mã vé của bạn: {ticket.ticket_code}\n\n"
                "Hãy đem mã QR đính kèm để check-in tại sự kiện.\n\n"
                "Cảm ơn bạn đã sử dụng hệ thống!"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )

        # Đính kèm QR vào email
        with open(qr_file_path, 'rb') as qr_file:
            email.attach(f'{ticket.ticket_code}.png', qr_file.read(), 'image/png')

        email.send()

        return Response({
            "message": "Đặt vé thành công. Mã QR đã được gửi qua email.",
            "ticket_code": ticket.ticket_code
        }, status=status.HTTP_201_CREATED)


    #check in
    @action(detail=False, methods=['post'], url_path='check-in')
    def check_in(self, request):
        ticket_code = request.data.get("ticket_code")

        if not ticket_code:
            return Response({"error": "Vui lòng cung cấp mã vé."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ticket = Ticket.objects.select_related("ticket_class__event", "user").get(ticket_code=ticket_code)
        except Ticket.DoesNotExist:
            return Response({"error": "Mã vé không hợp lệ."}, status=status.HTTP_404_NOT_FOUND)

        if ticket.is_checked_in:
            return Response({"error": "Vé đã được check-in."}, status=status.HTTP_400_BAD_REQUEST)

        event = ticket.ticket_class.event
        if event.start_time > now():
            return Response(f'error: Sự kiện chưa bắt đầu. Ngày bắt đầu sự kiện: {event.start_time}, Ngày hiện tại: {now()}',status=status.HTTP_400_BAD_REQUEST)

        # Cập nhật trạng thái check-in
        ticket.is_checked_in = True
        ticket.check_in_time = now()
        ticket.save()

        return Response({
            "message": "Check-in thành công.",
            "ticket_code": ticket.ticket_code,
            "user": ticket.user.get_full_name() or ticket.user.username,
            "event": event.name,
            "ticket_class": ticket.ticket_class.name,
            "check_in_time": ticket.check_in_time,
        }, status=status.HTTP_200_OK)

class MomoPaymentInitView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        ticket_class_id = request.data.get("ticket_class")
        method = request.data.get("method", "momo")

        try:
            ticket_class = TicketClass.objects.get(pk=ticket_class_id)
        except TicketClass.DoesNotExist:
            return Response({"error": "Không tìm thấy hạng vé"}, status=status.HTTP_400_BAD_REQUEST)

        if ticket_class.total_available <= 0:
            return Response({"error": "Hạng vé đã bán hết."}, status=status.HTTP_400_BAD_REQUEST)

        amount = ticket_class.price
        order_id = str(uuid.uuid4())

        # Tạo log
        log = PaymentLog.objects.create(
            user=request.user,
            ticket_class=ticket_class,
            amount=amount,
            method=method,
            status='pending'
        )

        # Gọi API MoMo
        momo_response = create_momo_payment(
            amount=amount,
            order_id=order_id,
            redirect_url="https://yourdomain.com/payment-success/",
            ipn_url="https://yourdomain.com/api/payment/momo/ipn/"
        )

        pay_url = momo_response.get("payUrl")
        if not pay_url:
            return Response({"error": "Không thể tạo thanh toán MoMo"}, status=500)

        # Lưu transaction_id nếu có
        log.transaction_id = order_id
        log.save()

        return Response({"payUrl": pay_url})


class MomoCallbackView(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]  # MoMo gọi không có token

    def post(self, request):
        data = request.data
        order_id = data.get("orderId")
        result_code = data.get("resultCode")

        if result_code == 0:
            # Thanh toán thành công → Tạo vé ở đây hoặc lưu trạng thái "đã thanh toán"
            ...
            return Response({"message": "Thanh toán thành công."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Thanh toán thất bại."}, status=status.HTTP_400_BAD_REQUEST)