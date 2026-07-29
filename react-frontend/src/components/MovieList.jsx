import MovieCard from "./MovieCard";

export default function MovieList({
  title,
  movies,
  wantedMovieIds,
  onToggleWantToWatch,
  emptyMessage,
  isLoading = false
}) {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>

      {isLoading
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
                  wantToWatch={wantedMovieIds.includes(movie.id)}
                  onToggleWantToWatch={onToggleWantToWatch}
                />
              ))}
            </section>
          )}
    </main>
  );
}