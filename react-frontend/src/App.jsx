import { NavLink, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import MovieList from "./components/MovieList";

function getNavLinkClasses({ isActive }) {
  const baseClasses = "rounded-full px-3 py-2 transition";

  return isActive
    ? `${baseClasses} bg-gray-100 font-medium text-gray-900`
    : `${baseClasses} text-gray-600 hover:bg-gray-50 hover:text-gray-900`;
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isMoviesLoading, setIsMoviesLoading] = useState(true);
  const [wantedMovies, setWantedMovies] = useState([]);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(true);

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
      const response = await fetch("http://localhost:5000/api/movies");
      const data = await response.json();

      setMovies(data);
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
  const isNewReleasesLoading = isMoviesLoading || isWatchlistLoading;

  return (
    <>
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-4">
          <span className="mr-auto text-xl font-bold tracking-tight">
            Movie Night
          </span>

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
              isLoading={isNewReleasesLoading}
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
              isLoading={isWatchlistLoading}
            />
          }
        />
      </Routes>
    </>
  );
}