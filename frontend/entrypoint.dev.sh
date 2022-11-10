#!/bin/sh

# Code to run after building the image.
# This script runs the application in dev mode. 
# The application will watch for changes in the code.
# This script does not run in production mode.

WATCHPACK_POLLING=true PORT=5000 npm start
