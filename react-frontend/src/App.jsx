import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";

export default function MovieList() {
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

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">New releases</h1>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            wantToWatch={wantedMovieIds.includes(movie.id)}
            onToggleWantToWatch={toggleWantToWatch}
          />
        ))}
      </section>
    </main>
  );
}