import os
import sqlite3

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app) # TODO: Restrict allowed origins before deployment.

TMDB_TOKEN = os.getenv("TMDB_TOKEN")
app.config["DATABASE"] = os.path.join(app.instance_path, "movie-app.sqlite3")


def get_db():
    os.makedirs(app.instance_path, exist_ok=True)
    database = sqlite3.connect(app.config["DATABASE"])
    database.execute("CREATE TABLE IF NOT EXISTS watchlist (movie_id INTEGER PRIMARY KEY)")
    return database


@app.get("/")
def home():
    return "Flask movie API is running"


@app.get("/api/movies")
def get_movies():
    if not TMDB_TOKEN:
        return jsonify({"error": "TMDB_TOKEN is missing"}), 500

    response = requests.get(
        "https://api.themoviedb.org/3/discover/movie",
        headers={
            "Authorization": f"Bearer {TMDB_TOKEN}",
            "accept": "application/json",
        },
        params={
            "include_adult": "false",
            "include_video": "false",
            "language": "en-US",
            "sort_by": "primary_release_date.desc",
            "vote_average.gte": 7,
            "vote_count.gte": 1000,
            "page": 1,
        },
        timeout=10,
    )

    if not response.ok:
        return jsonify({
            "error": "TMDB request failed",
            "status": response.status_code,
        }), 502

    tmdb_movies = response.json()["results"]

    movies = [
        {
            "id": movie["id"],
            "title": movie["title"],
            "release_date": movie.get("release_date"),
            "year": (
                movie["release_date"][:4]
                if movie.get("release_date")
                else None
            ),
            "rating": movie["vote_average"],
            "vote_count": movie["vote_count"],
            "description": movie["overview"],
            "poster_path": movie["poster_path"],
        }
        for movie in tmdb_movies
    ]

    return jsonify(movies)


@app.get("/api/watchlist")
def get_watchlist():
    with get_db() as database:
        rows = database.execute("SELECT movie_id FROM watchlist ORDER BY movie_id").fetchall()
    return jsonify([row[0] for row in rows])


@app.post("/api/watchlist/<int:movie_id>")
def add_to_watchlist(movie_id):
    if movie_id <= 0:
        return jsonify({"error": "movie_id must be a positive integer"}), 400
    with get_db() as database:
        result = database.execute("INSERT OR IGNORE INTO watchlist (movie_id) VALUES (?)", (movie_id,))
    return jsonify({"movie_id": movie_id}), 201 if result.rowcount == 1 else 200


@app.delete("/api/watchlist/<int:movie_id>")
def remove_from_watchlist(movie_id):
    with get_db() as database:
        database.execute("DELETE FROM watchlist WHERE movie_id = ?", (movie_id,))
    return "", 204


if __name__ == "__main__":
    app.run(debug=True)