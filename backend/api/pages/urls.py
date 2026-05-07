from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import (
    TimelineEventViewSet, 
    MissionAxeViewSet, 
    VisionValueViewSet,
    TeamMemberViewSet,
    DiocesePresentationViewSet,
    ParoissesPresentationViewSet,
    ContactMessageViewSet
)

router = DefaultRouter()
router.register(r'timeline', TimelineEventViewSet)
router.register(r'axes', MissionAxeViewSet)
router.register(r'values', VisionValueViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'diocese-presentation', DiocesePresentationViewSet, basename='diocese-presentation')
router.register(r'paroisses-presentation', ParoissesPresentationViewSet, basename='paroisses-presentation')
router.register(r'messages', ContactMessageViewSet, basename='contact-messages')

urlpatterns = [
    path('', include(router.urls)),
]
