import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import formatVoteCount from "../utils/formatVoteCount";
import { HeartIcon } from "./ActionIcons";

function formatRuntime(runtime) {
  if (!runtime) return null;

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;

  return `${hours}h ${minutes}m`;
}

export default function MovieDetails({
  watchlistMovieIds,
  onToggleWatchlistMovie,
  isWatchlistLoading,
}) {
  const { movieId } = useParams();
  const navigate = useNavigate();
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
      <main className="movie-details status">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
        <span>Loading...</span>
      </main>
    );
  }

  if (error) {
    return <main className="movie-details status error">{error}</main>;
  }

  const isInWatchlist = watchlistMovieIds.includes(movie.id);

  return (
    <main className="movie-details">
      <button
        className="back"
        type="button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <article className="layout" data-saved={isInWatchlist}>
        {movie.poster_path
          ? (
              <img
                className="details-poster"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
              />
            )
          : (
              <div className="poster-placeholder">
                No poster available
              </div>
            )}

        <div className="movie-details-copy">
          <h1 className="title">{movie.title}</h1>

          <p className="facts">
            {[movie.year, formatRuntime(movie.runtime)]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {movie.genres.length > 0
            ? <p className="genres">{movie.genres.join(", ")}</p>
            : null}

          <p className="details-score">
            <span className="details-star">★</span>
            <strong>{movie.rating.toFixed(1)}</strong>
            <span className="rating-scale">/ 10</span>
            <span className="score-separator">·</span>
            <span className="vote-total">
              {formatVoteCount(movie.vote_count)} {movie.vote_count === 1 ? "vote" : "votes"}
            </span>
          </p>
          <p className="description">
            {movie.description || "No description available."}
          </p>

          <button
            data-saved={isInWatchlist}
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
              : <><HeartIcon filled={isInWatchlist} /><span>{isInWatchlist ? "Saved" : "Save"}</span></>}
          </button>
        </div>
      </article>
    </main>
  );
}