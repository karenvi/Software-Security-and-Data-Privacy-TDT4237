#!/bin/sh

# Code to run after building the image.
# This script runs the application in dev mode. 
# The application will watch for changes in the code.
# This script does not run in production mode.

echo "REACT_APP_API_URL='${PROTOCOL}://${DOMAIN}:${PORT_PREFIX}${GROUP_ID}/api'" > ./.env

PORT=5000 npm start
