import { Link, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import MovieList from "./components/MovieList";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [wantedMovieIds, setWantedMovieIds] = useState([]);

  function toggleWantToWatch(movieId) {
    if (wantedMovieIds.includes(movieId)) {
      setWantedMovieIds(
        wantedMovieIds.filter(id => id !== movieId)
      );
      return;
    }

    setWantedMovieIds([
      ...wantedMovieIds,
      movieId,
    ]);
  }

  useEffect(() => {
    async function loadMovies() {
      const response = await fetch("http://localhost:5000/api/movies");
      const data = await response.json();

      setMovies(data);
    }

    loadMovies();
  }, []);

  const wantedMovies = movies.filter(movie =>
    wantedMovieIds.includes(movie.id)
  );

  return (
    <>
      <nav className="mx-auto flex max-w-7xl gap-4 p-6">
        <Link to="/">New releases</Link>
        <Link to="/watchlist">
          Watchlist ({wantedMovieIds.length})
        </Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <MovieList
              title="New releases"
              movies={movies}
              wantedMovieIds={wantedMovieIds}
              onToggleWantToWatch={toggleWantToWatch}
            />
          }
        />

        <Route
          path="/watchlist"
          element={
            <MovieList
              title="Watchlist"
              movies={wantedMovies}
              wantedMovieIds={wantedMovieIds}
              onToggleWantToWatch={toggleWantToWatch}
              emptyMessage="Your watchlist is empty."
            />
          }
        />
      </Routes>
    </>
  );
}