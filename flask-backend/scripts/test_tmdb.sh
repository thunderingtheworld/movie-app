#!/usr/bin/env bash

set -a
source .env
set +a

curl --request GET \
  --url 'https://api.themoviedb.org/3/movie/11' \
  --header "Authorization: Bearer $TMDB_TOKEN" |
  jq

# run like "bash test_tmdb.sh"