#!/usr/bin/env bash

# bash test_watchlist.sh

FLASK_URL=http://127.0.0.1:5000
# Use an obviously fake ID so the test does not replace a real saved movie.
TEST_MOVIE_ID=999999999

echo "Current watchlist:"
curl --silent "$FLASK_URL/api/watchlist"
echo

echo "Adding movie $TEST_MOVIE_ID:"
curl --include --request POST "$FLASK_URL/api/watchlist" \
  --header "Content-Type: application/json" \
  --data "{\"id\": $TEST_MOVIE_ID, \"title\": \"Test Movie\", \"year\": 2026, \"rating\": 8.1, \"vote_count\": 5000, \"poster_path\": null}"
echo

echo "Watchlist after adding:"
curl --silent "$FLASK_URL/api/watchlist"
echo

echo "Deleting movie $TEST_MOVIE_ID:"
curl --include --request DELETE "$FLASK_URL/api/watchlist/$TEST_MOVIE_ID"
echo

echo "Watchlist after deleting:"
curl --silent "$FLASK_URL/api/watchlist"
echo
