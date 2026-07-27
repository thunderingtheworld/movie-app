#!/usr/bin/env bash

set -e

cd flask-backend
source .venv/bin/activate

echo "Starting Flask backend..."
echo "API: http://localhost:5000"

flask --app app run --debug

# run this via "bash bash_start_backend.sh"