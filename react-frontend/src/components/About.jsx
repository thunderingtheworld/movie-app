export default function About() {
  return (
    <main className="about-page">
      <h1>About Movie night</h1>

      <section className="about-panel">
        <p>
          Movie night is a small full-stack movie discovery project for browsing
          new releases, saving a watchlist, and finding something worth watching.
        </p>

        <a
          className="github-link"
          href="https://github.com/thunderingtheworld/movie-app"
          target="_blank"
          rel="noreferrer"
        >
          View source on GitHub
          <span aria-hidden="true">↗</span>
        </a>

        <div className="tmdb-credit">
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            <img
              className="tmdb-logo-stacked"
              src="/tmdb-logo.svg"
              alt="The Movie Database (TMDB)"
            />
            <img
              className="tmdb-logo-long"
              src="/tmdb-logo-long.svg"
              alt="The Movie Database (TMDB)"
            />
          </a>
          <div>
            <h2>Movie data</h2>
            <p>
              Movie information and poster images are provided by The Movie
              Database (TMDB).
            </p>
            <p>
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
