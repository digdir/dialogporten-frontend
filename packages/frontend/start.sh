#!/bin/sh
# packages/frontend/start.sh

# Substitute environment variables in the JSON template and create the config.json
envsubst '$APPLICATION_INSIGHTS_INSTRUMENTATION_KEY' < /usr/share/nginx/html/config.template.json > /usr/share/nginx/html/config.json

echo "Starting Nginx!!!"

# Start Nginx
nginx -g 'daemon off;'