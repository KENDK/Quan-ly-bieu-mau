#!/bin/sh
set -e

echo "Running Django migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "Collecting static files for Nginx..."
python manage.py collectstatic --noinput

echo "Ensuring admin superuser exists..."
python create_superuser.py || true

echo "Executing container startup command..."
exec "$@"
