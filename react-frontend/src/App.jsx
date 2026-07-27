import { useEffect, useState } from "react";

function MovieCard({ movie }) {
  const maxDescriptionLength = 180;

  let description = movie.description;

  if (description.length > maxDescriptionLength) {
    description = `${description.slice(0, maxDescriptionLength)}...`;
  }

  return (
    <article className="rounded-lg border border-gray-200 p-5 shadow-sm">
      <h2 className="mb-3 flex items-start justify-between gap-3 text-xl font-semibold">
        {movie.title}
        {movie.year !== null && movie.year !== undefined
          ? (<span className="shrink-0 font-light text-gray-500">{movie.year}</span>)
          : null}
      </h2>

      <p className="mb-3">
        <span className="font-medium">{movie.rating.toFixed(1)}</span>
        <span className="ml-2 text-sm font-light text-gray-500">
          {movie.vote_count.toLocaleString()} votes
        </span>
      </p>
      <p className="text-gray-600">{description}</p>
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
      <h1 className="mb-6 text-3xl font-bold">New releases</h1>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </section>
    </main>
  );
}