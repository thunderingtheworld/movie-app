import { useEffect, useState } from "react";

function MovieCard({ movie }) {
  return (
    <article>
      <h2>
        {movie.title} {movie.year !== null && movie.year !== undefined
          ? `(${movie.year})`
          : null}
      </h2>

      <p>Rating: {movie.rating.toFixed(1)}</p>
      <p>{movie.description}</p>
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
    <main>
      <h1>Movies</h1>

      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </main>
  );
}