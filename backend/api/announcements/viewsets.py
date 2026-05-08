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

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['announcement', 'parent']

    def get_queryset(self):
        # On peut filtrer par parent=null pour n'avoir que les commentaires racines au début
        qs = Comment.objects.all().select_related('user', 'parent')
        if not self.request.user.is_staff:
            qs = qs.filter(is_approved=True)
        return qs

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create', 'like']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=True, methods=['post'], url_path='like')
    def like(self, request, pk=None):
        """Action pour incrémenter le compteur de likes"""
        try:
            comment = self.get_object()
            comment.likes += 1
            comment.save()
            return Response({'likes': comment.likes}, status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
