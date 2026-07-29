from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Message(models.Model):
    """Simple internal messaging model."""
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='sent_messages', null=True, blank=True
    )
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='received_messages', null=True, blank=True
    )
    subject = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'

    def __str__(self):
        return f"Message from {self.sender} to {self.recipient}: {self.subject[:50]}"
