import { Link, NavLink, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import API_URL from "./config";
import About from "./components/About";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";
import MovieList from "./components/MovieList";
import getAnonymousUserId from "./utils/anonymousUserId";
import "./styles/global.css";
import "./styles/navigation.css";
import "./styles/movie-list.css";
import "./styles/movie-card.css";
import "./styles/saved-card.css";
import "./styles/movie-details.css";
import "./styles/footer-about.css";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);

  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [totalMoviePages, setTotalMoviePages] = useState(1);

  const [isMoviesLoading, setIsMoviesLoading] = useState(true);
  const [isLoadingMoreMovies, setIsLoadingMoreMovies] = useState(false);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(true);
  
  const [moviesError, setMoviesError] = useState("");
  const [watchlistError, setWatchlistError] = useState("");
  const [actionError, setActionError] = useState("");

  async function loadMoreMovies() {
    setIsLoadingMoreMovies(true);
    setActionError("");
    const nextPage = currentMoviePage + 1;

    try {
      const response = await fetch(
        `${API_URL}/movies?page=${nextPage}`
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      const newMovies = data.movies;

      setMovies(previousMovies => [
        ...previousMovies,
        ...newMovies,
      ]);
      setCurrentMoviePage(data.page);
      setTotalMoviePages(data.total_pages);
    } catch {
      setMoviesError("Please try again later.");
    } finally {
      setIsLoadingMoreMovies(false);
    }
  }

  async function toggleWatchlistMovie(movieToToggle) {
    setActionError("");

    try {
      const wasInWatchlist = watchlistMovieIds.includes(movieToToggle.id);
      let response;

      if (wasInWatchlist) {
        response = await fetch(
          `${API_URL}/watchlist/${movieToToggle.id}`,
          {
            method: "DELETE",
            headers: { "X-Anonymous-User-ID": getAnonymousUserId() },
          }
        );
      } else {
        response = await fetch(`${API_URL}/watchlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Anonymous-User-ID": getAnonymousUserId(),
          },
          body: JSON.stringify(movieToToggle),
        });
      }

      if (!response.ok) throw new Error();

      if (wasInWatchlist) {
        setWatchlistMovies(previousMovies =>
          previousMovies.filter(movie => movie.id !== movieToToggle.id)
        );
      } else {
        setWatchlistMovies(previousMovies => [movieToToggle, ...previousMovies]);
      }
    } catch {
      setActionError("We could not update your watchlist. Please try again later.");
    }
  }

  useEffect(() => {
    async function loadMovies() {
      try {
        const response = await fetch(`${API_URL}/movies?page=1`);

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        setMovies(data.movies);
        setTotalMoviePages(data.total_pages);
      } catch {
        setMoviesError("Please try again later.");
      } finally {
        setIsMoviesLoading(false);
      }
    }

    async function loadWatchlist() {
      try {
        const response = await fetch(`${API_URL}/watchlist`, {
          headers: { "X-Anonymous-User-ID": getAnonymousUserId() },
        });

        if (!response.ok) throw new Error();

        setWatchlistMovies(await response.json());
      } catch {
        setWatchlistError("Please try again later.");
      } finally {
        setIsWatchlistLoading(false);
      }
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
            onClick={() => setActionError("")}
          >
            <img src="/moon-crescent.png" alt="" />
            <span>Movie night</span>
          </Link>

          <NavLink
            className="nav-link"
            end
            to="/"
            onClick={() => setActionError("")}
          >
            <span className="nav-label">New releases</span>
          </NavLink>
          <NavLink
            className="nav-link"
            to="/watchlist"
            onClick={() => setActionError("")}
          >
            <span className="nav-label">Watchlist</span>
            {watchlistMovieIds.length > 0
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
              subtitle="Recent, highly rated films worth a look."
              movies={movies}
              watchlistMovieIds={watchlistMovieIds}
              onToggleWatchlistMovie={toggleWatchlistMovie}
              isInitialLoading={!moviesError && isNewReleasesLoading}
              onLoadMoreMovies={hasMoreMovies ? loadMoreMovies : null}
              isLoadingMoreMovies={isLoadingMoreMovies}
              error={moviesError || actionError}
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
              error={watchlistError || actionError}
            />
          }
        />

        <Route path="/about" element={<About />} />

        <Route
          path="/movies/:movieId"
          element={
            <MovieDetails
              watchlistMovieIds={watchlistMovieIds}
              onToggleWatchlistMovie={toggleWatchlistMovie}
              isWatchlistLoading={isWatchlistLoading}
              actionError={actionError}
            />
          }
        />
      </Routes>

      <Footer />
    </>
  );
}