import { useState } from "react";
import { Link } from "react-router";
import formatVoteCount from "../utils/formatVoteCount";

function getVoteCountClasses(voteCount) {
  // Context: as of mid-2026, the most-voted movie on TMDB is at 40k votes.
  if (voteCount >= 10_000) {
    return "font-semibold text-gray-700";
  }

  if (voteCount >= 5_000) {
    return "font-medium text-gray-600";
  }

  return "font-normal text-gray-500";
}
export default function MovieCard({
  movie,
  isInWatchlist,
  onToggleWatchlistMovie,
  variant = "default",
}) {
  const [isUpdatingWatchlist, setIsUpdatingWatchlist] = useState(false);
  const isWatchlistView = variant === "watchlist";

  async function handleWatchlistToggle() {
    setIsUpdatingWatchlist(true);

    try {
      await onToggleWatchlistMovie(movie);
    } finally {
      setIsUpdatingWatchlist(false);
    }
  }

  return (
    <article
      aria-busy={isUpdatingWatchlist}
      className={`
        flex overflow-hidden rounded-lg border transition-all duration-200
        ${isInWatchlist && !isWatchlistView
          ? "border-green-300 bg-green-50 shadow-none"
          : "border-gray-200 bg-white shadow-sm"}
        ${isUpdatingWatchlist ? "opacity-70" : "opacity-100"}
      `}
    >
      <Link className="relative w-1/3" to={`/movies/${movie.id}`}>
        {movie.poster_path !== null
          ? (
              <img
                className="h-full w-full object-cover"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
              />
            )
          : (
              <div className="flex h-full items-center justify-center bg-gray-100 p-3 text-center text-sm text-gray-500">
                No poster available
              </div>
            )}

        {isInWatchlist && !isWatchlistView
          ? <div className="absolute inset-0 bg-gray-900/15" />
          : null}
      </Link>

      <div className="flex w-2/3 flex-col gap-2 p-4">
        <Link className="hover:underline" to={`/movies/${movie.id}`}>
          <h2 className="text-xl font-semibold">
            {movie.title}
          </h2>
        </Link>

        {movie.year !== null && movie.year !== undefined
          ? (
              <p className="font-light text-gray-500">
                {movie.year}
              </p>
            )
          : null}

        <p className="mb-4">
          <span className="text-yellow-500">★</span>{" "}
          <span className="font-semibold">{movie.rating.toFixed(1)}</span>
          <span className="text-sm font-light text-gray-500"> / 10</span>
          <span className="mx-2 text-gray-400">·</span>
          <span className="text-sm text-gray-500">
            <span className={getVoteCountClasses(movie.vote_count)}>
              {formatVoteCount(movie.vote_count)}
            </span> {movie.vote_count === 1 ? "vote" : "votes"}
          </span>
        </p>
        <button
          className={
            isWatchlistView
              ? `
                  mt-auto inline-flex h-10 items-center justify-center self-end rounded border border-gray-300 bg-white
                  px-3 py-2 text-gray-600 transition
                  hover:border-red-500 hover:bg-red-50 hover:text-red-700
                  active:scale-95 active:bg-red-100
                  disabled:cursor-default disabled:opacity-70
                `
              : isInWatchlist
              ? `
                  mt-auto inline-flex h-10 w-24 items-center justify-center self-end rounded border border-green-600 bg-green-600
                  px-3 py-2 text-white transition
                  hover:bg-green-700 active:scale-95
                  disabled:cursor-default disabled:opacity-70
                `
              : `
                  mt-auto inline-flex h-10 w-24 items-center justify-center self-end rounded border border-gray-300 bg-gray-100
                  px-3 py-2 text-gray-600 transition
                  hover:border-green-500 hover:bg-green-50 hover:text-green-700
                  active:scale-95 active:bg-green-100
                  disabled:cursor-default disabled:opacity-70
                `
          }
          disabled={isUpdatingWatchlist}
          onClick={handleWatchlistToggle}
        >
          {isUpdatingWatchlist
            ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent" />
            : (isWatchlistView ? "× Remove" : isInWatchlist ? "✓ Saved" : "♡ Save")}
        </button>
      </div>
    </article>
  )
}