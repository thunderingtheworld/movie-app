import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import formatVoteCount from "../utils/formatVoteCount";

export default function MovieDetails({
  watchlistMovieIds,
  onToggleWatchlistMovie,
  isWatchlistLoading,
}) {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [isMovieLoading, setIsMovieLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdatingWatchlist, setIsUpdatingWatchlist] = useState(false);

  useEffect(() => {
    async function loadMovie() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/movies/${movieId}`
        );

        if (!response.ok) {
          throw new Error("Movie could not be loaded.");
        }

        setMovie(await response.json());
      } catch (error) {
        setError(error.message);
      } finally {
        setIsMovieLoading(false);
      }
    }

    loadMovie();
  }, [movieId]);

  async function handleWatchlistToggle() {
    setIsUpdatingWatchlist(true);

    try {
      await onToggleWatchlistMovie(movie);
    } finally {
      setIsUpdatingWatchlist(false);
    }
  }

  if (isMovieLoading || isWatchlistLoading) {
    return (
      <main className="mx-auto flex max-w-5xl items-center gap-2 p-6 text-gray-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
        <span>Loading...</span>
      </main>
    );
  }

  if (error) {
    return <main className="mx-auto max-w-5xl p-6 text-red-600">{error}</main>;
  }

  const isInWatchlist = watchlistMovieIds.includes(movie.id);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link className="text-gray-600 hover:underline" to="/">
        ← Back to movies
      </Link>

      <article className="mt-6 grid gap-8 sm:grid-cols-[minmax(220px,1fr)_2fr]">
        {movie.poster_path
          ? (
              <img
                className="w-full rounded-lg shadow-sm"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
              />
            )
          : (
              <div className="flex min-h-80 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                No poster available
              </div>
            )}

        <div>
          <h1 className="text-4xl font-bold">{movie.title}</h1>

          <p className="mt-3 text-gray-500">
            {[movie.year, movie.runtime ? `${movie.runtime} min` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {movie.genres.length > 0
            ? <p className="mt-2 text-gray-600">{movie.genres.join(", ")}</p>
            : null}

          <p className="mt-5">
            <span className="text-yellow-500">★</span>{" "}
            <span className="font-semibold">{movie.rating.toFixed(1)}</span>
            <span className="text-gray-500"> / 10</span>
            <span className="ml-2 text-gray-500">
              ({formatVoteCount(movie.vote_count)} {movie.vote_count === 1 ? "vote" : "votes"})
            </span>
          </p>
          <p className="mt-6 leading-7 text-gray-700">
            {movie.description || "No description available."}
          </p>

          <button
            className={`mt-8 inline-flex h-10 w-24 items-center justify-center rounded border px-3 transition ${
              isInWatchlist
                ? "border-green-600 bg-green-600 text-white hover:bg-green-700"
                : "border-gray-300 bg-gray-100 text-gray-600 hover:border-green-500 hover:bg-green-50 hover:text-green-700"
            }`}
            disabled={isUpdatingWatchlist}
            onClick={handleWatchlistToggle}
          >
            {isUpdatingWatchlist
              ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent" />
              : (isInWatchlist ? "✓ Saved" : "♡ Save")}
          </button>
        </div>
      </article>
    </main>
  );
}