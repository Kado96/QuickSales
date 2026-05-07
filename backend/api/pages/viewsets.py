from rest_framework import viewsets, permissions, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import TimelineEvent, MissionAxe, VisionValue, TeamMember, DiocesePresentation, ParoissesPresentation, ContactMessage
from .serializers import (
    TimelineEventSerializer, 
    MissionAxeSerializer, 
    VisionValueSerializer, 
    TeamMemberSerializer,
    DiocesePresentationSerializer,
    ParoissesPresentationSerializer,
    ContactMessageSerializer
)
from django.core.mail import send_mail
from django.conf import settings
from api.settings.models import SiteSettings

class TimelineEventViewSet(viewsets.ModelViewSet):
    queryset = TimelineEvent.objects.all()
    serializer_class = TimelineEventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class MissionAxeViewSet(viewsets.ModelViewSet):
    queryset = MissionAxe.objects.all()
    serializer_class = MissionAxeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class VisionValueViewSet(viewsets.ModelViewSet):
    queryset = VisionValue.objects.all()
    serializer_class = VisionValueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DiocesePresentationViewSet(viewsets.GenericViewSet):
    queryset = DiocesePresentation.objects.all()
    serializer_class = DiocesePresentationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return DiocesePresentation.objects.all()

    def get_object(self):
        obj, created = DiocesePresentation.objects.get_or_create(id=1)
        return obj

    @action(detail=False, methods=['get', 'put', 'patch'])
    def current(self, request):
        obj = self.get_object()

        if request.method == 'GET':
            serializer = self.get_serializer(obj)
            return Response([serializer.data]) # 🔥 TOUJOURS UNE LISTE
        
        elif request.method in ['PUT', 'PATCH']:
            if not request.user.is_authenticated:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            serializer = self.get_serializer(obj, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response([serializer.data]) # 🔥 TOUJOURS UNE LISTE
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ParoissesPresentationViewSet(viewsets.GenericViewSet):
    queryset = ParoissesPresentation.objects.all()
    serializer_class = ParoissesPresentationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj, created = ParoissesPresentation.objects.get_or_create(id=1)
        return obj

    @action(detail=False, methods=['get', 'put', 'patch'])
    def current(self, request):
        obj = self.get_object()

        if request.method == 'GET':
            serializer = self.get_serializer(obj)
            return Response([serializer.data]) # 🔥 TOUJOURS UNE LISTE
        
        elif request.method in ['PUT', 'PATCH']:
            if not request.user.is_authenticated:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            serializer = self.get_serializer(obj, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response([serializer.data]) # 🔥 TOUJOURS UNE LISTE
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        message = serializer.save()
        # Envoyer l'email
        try:
            site_settings = SiteSettings.objects.get(pk=1)
            recipient_email = site_settings.contact_email
            
            if recipient_email:
                send_mail(
                    subject=f"Nouveau message de contact: {message.subject}",
                    message=f"Nom: {message.name}\nEmail: {message.email}\nSujet: {message.subject}\n\nMessage:\n{message.message}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[recipient_email],
                    fail_silently=True,
                )
        except Exception as e:
            # Ne pas bloquer la sauvegarde si l'email échoue
            pass

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = ContactMessage.objects.filter(is_read=False).count()
        return Response({"unread_count": count})
