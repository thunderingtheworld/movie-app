import { useEffect, useState } from "react";

function MovieCard({ movie }) {

  function formatVoteCount(voteCount) {
    if (voteCount >= 1_000_000) {
      return `${(voteCount / 1_000_000).toFixed(1)}m`;
    }

    if (voteCount >= 1_000) {
      return `${(voteCount / 1_000).toFixed(1)}k`;
    }

    return voteCount.toLocaleString();
  }

  // text gets more prominent as confidence increases:
  function getVoteCountClasses(voteCount) {
    if (voteCount >= 5_000) {
      return "font-semibold text-gray-700";
    }

    if (voteCount >= 1_000) {
      return "font-medium text-gray-600";
    }

    return "font-normal text-gray-500";
  }

  return (
    <article className="flex overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      {movie.poster_path !== null
      ? (
          <img
            className="w-1/3 object-cover"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`${movie.title} poster`}
          />
        )
      : null}

      <div className="flex w-2/3 flex-col gap-2 p-4">
        <h2 className="text-xl font-semibold">
          {movie.title}
        </h2>

        {movie.year !== null && movie.year !== undefined
          ? (
              <p className="font-light text-gray-500">
                {movie.year}
              </p>
            )
          : null}

        <p className="mb-4">
          <span className="text-yellow-500">★</span>

          <span className="ml-1 font-semibold">
            {movie.rating.toFixed(1)}
          </span>

          <span className="text-sm font-light text-gray-500">
            {" "}/ 10
          </span>

          <span className="mx-2 text-gray-400">·</span>

          <span className="text-sm text-gray-500">
            <span className={`${getVoteCountClasses(movie.vote_count)}`}>
              {formatVoteCount(movie.vote_count)}
            </span> votes
          </span>
        </p>

        <button 
          className="
            mt-auto self-end rounded border border-gray-300 bg-gray-100
            px-3 py-2 text-gray-600 transition
            hover:border-green-500 hover:bg-green-50 hover:text-green-700
            active:scale-95 active:bg-green-100
          "
        >
          Want to watch
        </button>
      </div>
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