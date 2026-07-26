import os

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app) # TODO: Restrict allowed origins before deployment.

TMDB_TOKEN = os.getenv("TMDB_TOKEN")


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
            "vote_average.gte": 6,
            "vote_count.gte": 100,
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
            "description": movie["overview"],
            "poster_path": movie["poster_path"],
        }
        for movie in tmdb_movies
    ]

    return jsonify(movies)


if __name__ == "__main__":
    app.run(debug=True)