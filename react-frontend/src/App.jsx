import { Link, NavLink, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import MovieDetails from "./components/MovieDetails";
import MovieList from "./components/MovieList";

function getNavLinkClasses({ isActive }) {
  const baseClasses = "rounded-full px-3 py-2 transition";

  return isActive
    ? `${baseClasses} bg-gray-100 font-medium text-gray-900`
    : `${baseClasses} text-gray-600 hover:bg-gray-50 hover:text-gray-900`;
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [wantedMovies, setWantedMovies] = useState([]);

  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [totalMoviePages, setTotalMoviePages] = useState(1);

  const [isMoviesLoading, setIsMoviesLoading] = useState(true);
  const [isLoadingMoreMovies, setIsLoadingMoreMovies] = useState(false);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(true);

  async function loadMoreMovies() {
    setIsLoadingMoreMovies(true);
    const nextPage = currentMoviePage + 1;

    try {
      const response = await fetch(
        `http://localhost:5000/api/movies?page=${nextPage}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const newMovies = data.movies;

      setMovies(previousMovies => [
        ...previousMovies,
        ...newMovies,
      ]);
      setCurrentMoviePage(data.page);
      setTotalMoviePages(data.total_pages);
    } finally {
      setIsLoadingMoreMovies(false);
    }
  }

  async function toggleWantToWatch(movieToToggle) {
    const wasAlreadyWanted = wantedMovieIds.includes(movieToToggle.id);
    let response;

    if (wasAlreadyWanted) {
      response = await fetch(
        `http://localhost:5000/api/watchlist/${movieToToggle.id}`,
        { method: "DELETE" }
      );
    } else {
      response = await fetch("http://localhost:5000/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieToToggle),
      });
    }

    if (!response.ok) {
      return;
    }

    if (wasAlreadyWanted) {
      setWantedMovies(previousWantedMovies =>
        previousWantedMovies.filter(
          wantedMovie => wantedMovie.id !== movieToToggle.id
        )
      );
    } else {
      setWantedMovies(previousWantedMovies => [
        ...previousWantedMovies,
        movieToToggle,
      ]);
    }
  }

  useEffect(() => {
    async function loadMovies() {
      const response = await fetch("http://localhost:5000/api/movies?page=1");
      const data = await response.json();

      setMovies(data.movies);
      // currentMoviePage is already 1 so no need to set it
      setTotalMoviePages(data.total_pages);
      setIsMoviesLoading(false);
    }

    async function loadWatchlist() {
      const response = await fetch("http://localhost:5000/api/watchlist");
      const savedMovies = await response.json();

      setWantedMovies(savedMovies);
      setIsWatchlistLoading(false);
    }

    loadMovies();
    loadWatchlist();
  }, []);

  const wantedMovieIds = wantedMovies.map(movie => movie.id);

  // We have more movies unless we are at last page (or out of bounds):
  const hasMoreMovies = currentMoviePage < totalMoviePages;
  
  // We want to both have movies & know if we should mark them as saved already:
  const isNewReleasesLoading = isMoviesLoading || isWatchlistLoading;

  return (
    <>
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-4">
          <Link
            className="mr-auto flex items-center gap-2 text-xl font-bold tracking-tight"
            to="/"
          >
            <img
              className="size-8"
              src="/favicon.svg"
              alt=""
            />
            Movie Night
          </Link>

          <NavLink
            className={getNavLinkClasses}
            to="/"
          >
            New releases
          </NavLink>
          <NavLink
            className={getNavLinkClasses}
            to="/watchlist"
          >
            Watchlist {wantedMovieIds.length > 0
              ? `(${wantedMovieIds.length})`
              : null}
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <MovieList
              title="✨ New releases"
              movies={movies}
              wantedMovieIds={wantedMovieIds}
              onToggleWantToWatch={toggleWantToWatch}
              isInitialLoading={isNewReleasesLoading}
              onLoadMoreMovies={hasMoreMovies ? loadMoreMovies : null}
              isLoadingMoreMovies={isLoadingMoreMovies}
            />
          }
        />

        <Route
          path="/watchlist"
          element={
            <MovieList
              title="❤️ Watchlist"
              movies={wantedMovies}
              wantedMovieIds={wantedMovieIds}
              onToggleWantToWatch={toggleWantToWatch}
              emptyMessage="Your watchlist is empty."
              isInitialLoading={isWatchlistLoading}
            />
          }
        />

        <Route
          path="/movies/:movieId"
          element={
            <MovieDetails
              wantedMovieIds={wantedMovieIds}
              onToggleWantToWatch={toggleWantToWatch}
              isWatchlistLoading={isWatchlistLoading}
            />
          }
        />
      </Routes>
    </>
  );
}