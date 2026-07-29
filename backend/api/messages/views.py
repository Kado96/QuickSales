from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Message


class UnreadCountView(APIView):
    """
    GET /api/messages/unread_count/
    Returns the number of unread messages for the authenticated user.
    If the user is not authenticated, returns 0 silently.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            count = Message.objects.filter(
                recipient=request.user,
                is_read=False
            ).count()
            return Response({'unread_count': count}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'unread_count': 0}, status=status.HTTP_200_OK)
