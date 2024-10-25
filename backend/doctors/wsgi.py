"""
WSGI config for doctors project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os
from dotenv import load_dotenv
from pathlib import Path
from django.core.wsgi import get_wsgi_application

# Load environment variables from .env file
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      os.getenv('DJANGO_SETTINGS_MODULE'))
application = get_wsgi_application()

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'doctors.settings')
# application = get_wsgi_application()
