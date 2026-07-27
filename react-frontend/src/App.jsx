import { useEffect, useState } from "react";

function MovieCard({ movie }) {
  return (
    <article className="rounded-lg border border-gray-200 p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold">
        {movie.title} {movie.year !== null && movie.year !== undefined
          ? `(${movie.year})`
          : null}
      </h2>

      <p className="mb-3 font-medium">
        Rating: {movie.rating.toFixed(1)}
      </p>
      <p className="text-gray-600">{movie.description}</p>
    </article>
  )
}

export default function MovieList() {
  const [movies, setMovies] = useState([]);

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
      <h1 className="mb-6 text-3xl font-bold">Movies</h1>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </section>
    </main>
  );
}