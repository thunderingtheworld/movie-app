import MovieCard from "./MovieCard";

export default function MovieList({
  title,
  movies,
  watchlistMovieIds,
  onToggleWatchlistMovie,
  emptyMessage,
  isInitialLoading = false,
  onLoadMoreMovies,
  isLoadingMoreMovies = false,
  variant = "default",
}) {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>

      {isInitialLoading
        ? (
            <div className="flex items-center gap-2 text-gray-500">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
              <span>Loading...</span>
            </div>
          )
        : movies.length === 0
        ? (
            <p className="text-gray-500">{emptyMessage}</p>
          )
        : (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      {onLoadMoreMovies && !isInitialLoading && movies.length > 0
        ? (
            <div className="mt-8 flex justify-center">
              <button
                className="inline-flex h-10 w-full items-center justify-center rounded border border-gray-300 bg-white px-5 text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-default disabled:opacity-70 sm:w-auto"
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