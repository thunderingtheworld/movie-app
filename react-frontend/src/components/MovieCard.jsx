import { useState } from "react";
import { Link } from "react-router";
import { HeartIcon, XIcon } from "./ActionIcons";
import formatVoteCount from "../utils/formatVoteCount";

function getVoteCountClass(voteCount) {
  return voteCount >= 5_000 ? "popular-votes" : undefined;
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
      className={`movie-card${isUpdatingWatchlist ? " updating" : ""}${isInWatchlist ? " saved" : ""}${isWatchlistView ? " watchlist" : ""}`}
    >
      <Link className="poster" to={`/movies/${movie.id}`}>
        {movie.poster_path !== null
          ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
              />
            )
          : <span>No poster available</span>}
      </Link>

      <div className="metadata">
        <Link className="heading" to={`/movies/${movie.id}`}>
          <h2 title={movie.title}>{movie.title}</h2>
          {movie.year !== null && movie.year !== undefined
            ? <span>{movie.year}</span>
            : null}
        </Link>

        <div className="actions">
          <div className="score">
            <span className="star" aria-hidden="true">★</span>
            <strong>{movie.rating.toFixed(1)}</strong>
            <span className="votes">
              <b className={getVoteCountClass(movie.vote_count)}>
                {formatVoteCount(movie.vote_count)}
              </b>{" "}{movie.vote_count === 1 ? "vote" : "votes"}
            </span>
          </div>

          <button
            className={`save${isWatchlistView ? " remove" : isInWatchlist ? " saved" : ""}`}
            disabled={isUpdatingWatchlist}
            onClick={handleWatchlistToggle}
          >
            {isUpdatingWatchlist
              ? <span className="spinner" />
              : <>{isWatchlistView ? <XIcon /> : <HeartIcon filled={isInWatchlist} />}<span>{isWatchlistView ? "Remove" : isInWatchlist ? "Saved" : "Save"}</span></>}
          </button>
        </div>
      </div>
    </article>
  );
}