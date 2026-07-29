import { useState } from "react";

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
  // Context: after checking mid-2026 the most voted film 
  // on TMDB has 40k votes
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
  wantToWatch,
  onToggleWantToWatch,
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleToggle() {
    setIsUpdating(true);

    try {
      await onToggleWantToWatch(movie.id);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <article
      className={
        wantToWatch
          ? `
              flex overflow-hidden rounded-lg border border-green-300
              bg-green-50 opacity-85 shadow-none transition
            `
          : `
              flex overflow-hidden rounded-lg border border-gray-200
              bg-white shadow-sm transition
            `
      }
    >
      <div className="relative w-1/3">
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

        {wantToWatch
          ? <div className="absolute inset-0 bg-gray-900/15" />
          : null}
      </div>

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
            <span className={getVoteCountClasses(movie.vote_count)}>
              {formatVoteCount(movie.vote_count)}
            </span> votes
          </span>
        </p>

        <button 
          className={
            wantToWatch
              ? `
                  mt-auto w-24 self-end rounded border border-green-600 bg-green-600
                  px-3 py-2 text-white transition
                  hover:bg-green-700 active:scale-95
                  disabled:cursor-default disabled:opacity-70
                `
              : `
                  mt-auto w-24 self-end rounded border border-gray-300 bg-gray-100
                  px-3 py-2 text-gray-600 transition
                  hover:border-green-500 hover:bg-green-50 hover:text-green-700
                  active:scale-95 active:bg-green-100
                  disabled:cursor-default disabled:opacity-70
                `
          }
          disabled={isUpdating}
          onClick={handleToggle}
        >
          {isUpdating
            ? <span className="inline-block animate-spin">↻</span>
            : (wantToWatch ? "✓ Saved" : "♡ Save")}
        </button>
      </div>
    </article>
  )
}