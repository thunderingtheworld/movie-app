#!/usr/bin/env bash

# bash test_flask_movie.sh       # Test with default movie ID 11

FLASK_URL=http://127.0.0.1:5000

curl --fail --silent --show-error \
  "$FLASK_URL/api/movies/11" | \
  jq
