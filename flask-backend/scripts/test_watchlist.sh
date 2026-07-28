#!/usr/bin/env bash

# bash test_watchlist.sh       # Test with default movie ID 550
# bash test_watchlist.sh 123   # Test with movie ID 123

FLASK_URL=http://127.0.0.1:5000
MOVIE_ID=550

if [ $# -ge 1 ]; then
  MOVIE_ID=$1
fi

echo "Current watchlist:"
curl --silent "$FLASK_URL/api/watchlist"
echo

echo "Adding movie $MOVIE_ID:"
curl --include --request POST "$FLASK_URL/api/watchlist/$MOVIE_ID"
echo

echo "Watchlist after adding:"
curl --silent "$FLASK_URL/api/watchlist"
echo

echo "Deleting movie $MOVIE_ID:"
curl --include --request DELETE "$FLASK_URL/api/watchlist/$MOVIE_ID"
echo

echo "Watchlist after deleting:"
curl --silent "$FLASK_URL/api/watchlist"
echo
