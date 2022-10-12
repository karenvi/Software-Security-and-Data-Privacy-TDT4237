# Use the official Python image from the Docker Hub
FROM python:3.8.5-alpine

# These two environment variables prevent __pycache__/ files.
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Enable bash
RUN apk add --no-cache bash

# Install psycopg2 dependencies
RUN apk update \
    && apk add --virtual build-deps gcc python3-dev musl-dev \
    && apk add postgresql-dev gcc python3-dev musl-dev libffi-dev \
    && apk del build-deps \
    && apk --no-cache add musl-dev linux-headers g++

# Create the app dir
RUN mkdir /app

# Select app dir
WORKDIR /app

# Create unprevileged user
RUN addgroup -S django && adduser -S django -G django

# Set ownership of the application folder
RUN chown django:django /app

# Use the django user
USER django

# Set path for django
ENV PATH /home/django/.local/bin:$PATH

# Copy the application with ownership of the django user
COPY --chown=django:django . ./

# Update pip and install dependencies
RUN pip install --upgrade pip && pip install --user -r requirements.txt

# Convert entrypoint script to unix format if PC is running windows
RUN dos2unix entrypoint.sh

# Convert entrypoint.dev script to unix format if PC is running windows
RUN dos2unix entrypoint.dev.sh

# Run the startup script
CMD ["/bin/bash", "/app/entrypoint.sh"]
