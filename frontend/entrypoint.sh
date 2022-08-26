#!/bin/sh

# Code to run after building the image

npm run-script build

serve -s build -l 5000
