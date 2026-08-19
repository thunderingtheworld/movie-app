CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER,
    rating REAL NOT NULL,
    vote_count INTEGER NOT NULL,
    poster_path TEXT
);

CREATE TABLE IF NOT EXISTS watchlist (
    user_id TEXT NOT NULL,
    movie_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);
