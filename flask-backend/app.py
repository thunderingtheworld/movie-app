import os
import sqlite3

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app) # TODO: Restrict allowed origins before deployment.

TMDB_TOKEN = os.getenv("TMDB_TOKEN")
app.config["DATABASE"] = os.path.join(app.instance_path, "movie-app.sqlite3")


def get_db():
    os.makedirs(app.instance_path, exist_ok=True)
    database = sqlite3.connect(app.config["DATABASE"])
    database.row_factory = sqlite3.Row
    database.execute(
        """
        CREATE TABLE IF NOT EXISTS watchlist (
            movie_id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            year INTEGER,
            rating REAL NOT NULL,
            vote_count INTEGER NOT NULL,
            poster_path TEXT
        )
        """
    )
    return database


@app.get("/")
def home():
    return "Flask movie API is running"


@app.get("/api/movies")
def get_movies():
    if not TMDB_TOKEN:
        return jsonify({"error": "TMDB_TOKEN is missing"}), 500

    page = request.args.get("page", default=1, type=int)
    if page < 1:
        return jsonify({"error": "page must be a positive integer"}), 400

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
            "page": page,
        },
        timeout=10,
    )

    if not response.ok:
        return jsonify({
            "error": "TMDB request failed",
            "status": response.status_code,
        }), 502

    tmdb_data = response.json()
    tmdb_movies = tmdb_data["results"]

    movies = [
        {
            "id": movie["id"],
            "title": movie["title"],
            "release_date": movie.get("release_date"),
            "year": (
                int(movie["release_date"][:4])
                if movie.get("release_date")
                else None
            ),
            "rating": movie.get("vote_average") or 0,
            "vote_count": movie.get("vote_count") or 0,
            "description": movie["overview"],
            "poster_path": movie["poster_path"],
        }
        for movie in tmdb_movies
    ]

    # Pass pagination metadata through so React knows when to hide Load more.
    return jsonify({
        "movies": movies,
        "page": tmdb_data["page"],
        "total_pages": tmdb_data["total_pages"],
    })


@app.get("/api/movies/<int:movie_id>")
def get_movie(movie_id):
    if not TMDB_TOKEN:
        return jsonify({"error": "TMDB_TOKEN is missing"}), 500

    response = requests.get(
        f"https://api.themoviedb.org/3/movie/{movie_id}",
        headers={
            "Authorization": f"Bearer {TMDB_TOKEN}",
            "accept": "application/json",
        },
        params={"language": "en-US"},
        timeout=10,
    )

    if not response.ok:
        return jsonify({"error": "Movie could not be loaded"}), response.status_code

    movie = response.json()
    return jsonify({
        "id": movie["id"],
        "title": movie["title"],
        "year": (
            int(movie["release_date"][:4])
            if movie.get("release_date")
            else None
        ),
        "rating": movie.get("vote_average") or 0,
        "vote_count": movie.get("vote_count") or 0,
        "description": movie.get("overview"),
        "poster_path": movie.get("poster_path"),
        "runtime": movie.get("runtime"),
        "genres": [genre["name"] for genre in movie.get("genres", [])],
    })

@app.get("/api/watchlist")
def get_watchlist():
    with get_db() as database:
        movies = database.execute(
            """
            SELECT movie_id AS id, title, year, rating, vote_count, poster_path
            FROM watchlist
            ORDER BY title
            """
        ).fetchall()
    return jsonify([dict(movie) for movie in movies])


@app.post("/api/watchlist")
def add_to_watchlist():
    movie = request.get_json(silent=True)
    required_fields = ("id", "title")

    if not isinstance(movie, dict) or any(
        field not in movie for field in required_fields
    ):
        return jsonify({"error": "movie card data is missing"}), 400

    with get_db() as database:
        database.execute(
            """
            INSERT OR REPLACE INTO watchlist
                (movie_id, title, year, rating, vote_count, poster_path)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                movie["id"],
                movie["title"],
                movie.get("year"),
                movie.get("rating") or 0,
                movie.get("vote_count") or 0,
                movie.get("poster_path"),
            ),
        )
    return jsonify(movie), 201


@app.delete("/api/watchlist/<int:movie_id>")
def remove_from_watchlist(movie_id):
    with get_db() as database:
        database.execute("DELETE FROM watchlist WHERE movie_id = ?", (movie_id,))
    return "", 204


if __name__ == "__main__":
    app.run(debug=True)