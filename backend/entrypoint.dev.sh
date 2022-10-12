#!/bin/sh

# Code to run after building the image
# This script runs the application in dev mode. 
# The application will watch for changes in the code.
# This script does not run in production mode.

python manage.py migrate

python manage.py collectstatic --noinput

DJANGO_SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME} \
DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD} \
DJANGO_SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL} \
python manage.py createsuperuser --noinput || \
echo "WARNING: This error is ignored as it most likely is 'That username is already taken.'" \
&& echo "If you wish to alter the user credentials, then delete the user first."
#python manage.py loaddata initial.json # Add some initial data

gunicorn securehelp.wsgi --log-file - -b 0.0.0.0:8000 --reload
