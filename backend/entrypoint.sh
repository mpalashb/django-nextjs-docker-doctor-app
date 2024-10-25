#!/bin/sh

# Collect static files
echo "Migrating..."
python manage.py migrate

# Collect static files
echo "Collect static files"
python3 manage.py collectstatic --no-input

# Start server
echo "Starting server"
# python3 manage.py runserver 0.0.0.0:8000
gunicorn doctors.wsgi:application --bind 0.0.0.0:8000

exec "$@"