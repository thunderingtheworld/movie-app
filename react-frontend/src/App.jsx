import { useEffect, useState } from "react";

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
        <article key={movie.id}>
          <h2>
            {movie.title} {movie.year && `(${movie.year})`}
          </h2>

          <p>Rating: {movie.rating.toFixed(1)}</p>
          <p>{movie.description}</p>
        </article>
      ))}
    </main>
  );
}