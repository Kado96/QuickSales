from django.apps import AppConfig


class MessagesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.messages'
    label = 'api_messages'  # Avoid conflict with Django's built-in messages framework
