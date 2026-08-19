#!/usr/bin/env bash

# Run with: bash test_watchlist.sh

FLASK_URL=http://127.0.0.1:5000 # Run locally

# Use an obviously fake ID so the test does not replace a real saved movie:
TEST_MOVIE_ID=999999999
USER_ONE=11111111-1111-4111-8111-111111111111
USER_TWO=22222222-2222-4222-8222-222222222222

echo "==============================================================="
echo "User 1's current watchlist:"
curl --silent "$FLASK_URL/api/watchlist" \
  --header "X-Anonymous-User-ID: $USER_ONE"
echo

echo "==============================================================="
echo "Adding movie $TEST_MOVIE_ID for user 1:"
curl --include --request POST "$FLASK_URL/api/watchlist" \
  --header "Content-Type: application/json" \
  --header "X-Anonymous-User-ID: $USER_ONE" \
  --data "{\"id\": $TEST_MOVIE_ID, \"title\": \"Test Movie\", \"year\": 2026, \"rating\": 8.1, \"vote_count\": 5000, \"poster_path\": null}"
echo

echo "==============================================================="
echo "User 1's watchlist after adding:"
curl --silent "$FLASK_URL/api/watchlist" \
  --header "X-Anonymous-User-ID: $USER_ONE"
echo

echo "==============================================================="
echo "User 2's watchlist remains empty:"
curl --silent "$FLASK_URL/api/watchlist" \
  --header "X-Anonymous-User-ID: $USER_TWO"
echo

echo "==============================================================="
echo "Deleting movie $TEST_MOVIE_ID for user 1:"
curl --include --request DELETE "$FLASK_URL/api/watchlist/$TEST_MOVIE_ID" \
  --header "X-Anonymous-User-ID: $USER_ONE"
echo

echo "==============================================================="
echo "User 1's watchlist after deleting:"
curl --silent "$FLASK_URL/api/watchlist" \
  --header "X-Anonymous-User-ID: $USER_ONE"
echo
