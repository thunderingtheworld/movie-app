import MovieCard from "./MovieCard";

export default function MovieList({
  title,
  movies,
  wantedMovieIds,
  onToggleWantToWatch
}) {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>

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
    </main>
  );
}