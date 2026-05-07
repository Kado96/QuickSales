from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ministry, MinistryActivity, MinistryPage
from .serializers import MinistrySerializer, MinistryActivitySerializer, MinistryPageSerializer

class MinistryPageViewSet(viewsets.ModelViewSet):
    queryset = MinistryPage.objects.all()
    serializer_class = MinistryPageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get', 'put', 'patch'])
    def current(self, request):
        obj = MinistryPage.objects.first()
        if not obj:
            obj = MinistryPage.objects.create()
            
        if request.method == 'GET':
            serializer = self.get_serializer(obj)
            return Response(serializer.data)
            
        elif request.method in ['PUT', 'PATCH']:
            # Permissions should already be checked by the class permission_classes, but double-check
            serializer = self.get_serializer(obj, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)

class MinistryViewSet(viewsets.ModelViewSet):
    queryset = Ministry.objects.all().prefetch_related('activities').order_by('order')
    serializer_class = MinistrySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = None

    @action(detail=True, methods=['post'])
    def activities(self, request, pk=None):
        ministry = self.get_object()
        serializer = MinistryActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(ministry=ministry)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class MinistryActivityViewSet(viewsets.ModelViewSet):
    queryset = MinistryActivity.objects.all()
    serializer_class = MinistryActivitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    http_method_names = ['post', 'delete', 'patch', 'put']
