import { Link, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";

function MovieList({
  title,
  movies,
  wantedMovieIds,
  onToggleWantToWatch
}) {

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            wantToWatch={wantedMovieIds.includes(movie.id)}
            onToggleWantToWatch={onToggleWantToWatch}
          />
        ))}
      </section>
    </main>
  );
}

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
            />
          }
        />
      </Routes>
    </>
  );
}