"""
WSGI config for securehelp project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
from django.conf import settings
from whitenoise import WhiteNoise
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'securehelp.settings')

# Get wsgi application (standard approach)
application = get_wsgi_application()


if settings.PRODUCTION:
    # Use whitenoise to configure the static path
    application = WhiteNoise(application, root=settings.STATIC_ROOT)


