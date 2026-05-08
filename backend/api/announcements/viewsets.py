from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Announcement, AnnouncementImage, Comment
from .serializers import AnnouncementSerializer, CommentSerializer

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.filter(is_active=True).prefetch_related('gallery')
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']

class AdminAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all().prefetch_related('gallery')
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_active']

    def perform_create(self, serializer):
        item = serializer.save()
        images = self.request.FILES.getlist('gallery_images')
        for img in images:
            AnnouncementImage.objects.create(announcement=item, image=img)

    def perform_update(self, serializer):
        item = serializer.save()
        images = self.request.FILES.getlist('gallery_images')
        for img in images:
            AnnouncementImage.objects.create(announcement=item, image=img)

    @action(detail=True, methods=['post'], url_path='remove-image')
    def remove_image(self, request, pk=None):
        image_id = request.data.get('image_id')
        try:
            image = AnnouncementImage.objects.get(id=image_id, announcement_id=pk)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except AnnouncementImage.DoesNotExist:
            return Response({'error': 'Image non trouvée'}, status=status.HTTP_404_NOT_FOUND)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['announcement']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Comment.objects.all().select_related('user')
        return Comment.objects.filter(is_approved=True).select_related('user')

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
