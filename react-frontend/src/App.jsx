import { Link, NavLink, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import About from "./components/About";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";
import MovieList from "./components/MovieList";
import "./styles/global.css";
import "./styles/navigation.css";
import "./styles/movie-list.css";
import "./styles/movie-card.css";
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
      try {
        const response = await fetch("http://localhost:5000/api/movies?page=1");

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
        const response = await fetch("http://localhost:5000/api/watchlist");

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
          >
            <img src="/moon-crescent.png" alt="" />
            <span>Movie night</span>
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
              isInitialLoading={!moviesError && isNewReleasesLoading}
              onLoadMoreMovies={hasMoreMovies ? loadMoreMovies : null}
              isLoadingMoreMovies={isLoadingMoreMovies}
              error={moviesError}
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
              error={watchlistError}
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
            />
          }
        />
      </Routes>

      <Footer />
    </>
  );
}