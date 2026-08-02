import { Link, NavLink, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import MovieDetails from "./components/MovieDetails";
import MovieList from "./components/MovieList";
import "./styles/global.css";
import "./styles/navigation.css";
import "./styles/movie-list.css";
import "./styles/movie-card.css";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);

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

  async function toggleWatchlistMovie(movieToToggle) {
    const wasInWatchlist = watchlistMovieIds.includes(movieToToggle.id);
    let response;

    if (wasInWatchlist) {
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

    if (wasInWatchlist) {
      setWatchlistMovies(previousWatchlistMovies =>
        previousWatchlistMovies.filter(
          watchlistMovie => watchlistMovie.id !== movieToToggle.id
        )
      );
    } else {
      setWatchlistMovies(previousWatchlistMovies => [
        movieToToggle,
        ...previousWatchlistMovies,
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
      const loadedWatchlistMovies = await response.json();

      setWatchlistMovies(loadedWatchlistMovies);
      setIsWatchlistLoading(false);
    }

    loadMovies();
    loadWatchlist();
  }, []);

  const watchlistMovieIds = watchlistMovies.map(movie => movie.id);

  // We have more movies unless we are at last page (or out of bounds):
  const hasMoreMovies = currentMoviePage < totalMoviePages;

  // We want to both have movies & know if we should mark them as in watchlist already:
  const isNewReleasesLoading = isMoviesLoading || isWatchlistLoading;

  return (
    <>
      <nav className="movie-nav">
        <div className="inner">
          <Link
            className="brand"
            to="/"
          >
            Movie Night
          </Link>

          <NavLink
            className="nav-link"
            end
            to="/"
          >
            New releases
          </NavLink>
          <NavLink
            className="nav-link"
            to="/watchlist"
          >
            Watchlist {watchlistMovieIds.length > 0
              ? <b>{watchlistMovieIds.length}</b>
              : null}
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <MovieList
              title="New releases"
              movies={movies}
              watchlistMovieIds={watchlistMovieIds}
              onToggleWatchlistMovie={toggleWatchlistMovie}
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
              title="Watchlist"
              movies={watchlistMovies}
              watchlistMovieIds={watchlistMovieIds}
              onToggleWatchlistMovie={toggleWatchlistMovie}
              emptyMessage="Your watchlist is empty."
              isInitialLoading={isWatchlistLoading}
              variant="watchlist"
            />
          }
        />

        <Route
          path="/movies/:movieId"
          element={
            <MovieDetails
              watchlistMovieIds={watchlistMovieIds}
              onToggleWatchlistMovie={toggleWatchlistMovie}
              isWatchlistLoading={isWatchlistLoading}
            />
          }
        />
      </Routes>
    </>
  );
}