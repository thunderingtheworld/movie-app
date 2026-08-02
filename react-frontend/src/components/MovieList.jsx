import MovieCard from "./MovieCard";

export default function MovieList({
  title,
  movies,
  watchlistMovieIds,
  onToggleWatchlistMovie,
  emptyMessage,
  isInitialLoading = false,
  error,
  onLoadMoreMovies,
  isLoadingMoreMovies = false,
  variant = "default",
}) {
  return (
    <main className="movie-page">
      <h1 className="page-title">{title}</h1>

      {isInitialLoading
        ? (
            <div className="loading-state">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
              <span>Loading...</span>
            </div>
          )
        : error
        ? (
            <section className="empty-state error-state" role="alert">
              <strong>We ran into an error</strong>
              <p>{error}</p>
            </section>
          )
        : movies.length === 0
        ? (
            <section className="empty-state">
              <strong>Nothing here yet</strong>
              <p>{emptyMessage}</p>
            </section>
          )
        : (
            <section className="movie-grid">
              {movies.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWatchlist={watchlistMovieIds.includes(movie.id)}
                  onToggleWatchlistMovie={onToggleWatchlistMovie}
                  variant={variant}
                />
              ))}
            </section>
          )}
      {/* Only render pagination when the parent provides a load-more action. */}
      {onLoadMoreMovies && !isInitialLoading && !error && movies.length > 0
        ? (
            <div className="mt-8 flex justify-center">
              <button
                className="load-more"
                disabled={isLoadingMoreMovies}
                onClick={onLoadMoreMovies}
              >
                {isLoadingMoreMovies
                  ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent" />
                  : "Load more"}
              </button>
            </div>
          )
        : null}
    </main>
  );
}