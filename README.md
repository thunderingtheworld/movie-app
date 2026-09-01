# Movie night

A full-stack movie discovery app built around how I like to find new movies: narrowing recent releases into a manageable shortlist using rating and audience-vote thresholds, then saving interesting ones to a watchlist.

The filtering thresholds are fixed for this MVP. More features may be added in the future.

**Stack:** React, Flask, SQLite, CSS, and the TMDB API.

## Features

- Filtered view of recent movie releases
- Movie details
- Persistent, browser-specific watchlists without sign-in
- Responsive layouts
- Loading and error states

Watchlists use anonymous users to avoid sign-in friction now, while preserving a natural path to accounts later.

## Live demo and screenshots

### [Try Movie night live →](https://movie-night-alpha-liart.vercel.app/)

### New releases

[![New releases](docs/new_releases.png)](docs/new_releases.png)

### Movie details

[![Movie details](docs/movie_details.png)](docs/movie_details.png)

### Mobile view

[![Mobile view](docs/mobile_view.png)](docs/mobile_view.png)

## Local setup

Create the backend environment file:

```bash
cp flask-backend/.env.example flask-backend/.env
```

Add your [The Movie Database (TMDB)](https://www.themoviedb.org) API read access token to `flask-backend/.env`. The example `FRONTEND_URL` already matches the local frontend server.

No frontend environment file is required locally because the app defaults to `http://localhost:5000/api`.

Install the backend dependencies:

```bash
cd flask-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

Install the frontend dependencies:

```bash
cd react-frontend
npm install
cd ..
```

Start the backend and frontend in separate terminals.

Terminal 1:

```bash
bash start_backend.sh
```

Terminal 2:

```bash
bash start_frontend.sh
```

## Deployment variables

- Backend: `TMDB_TOKEN`, `FRONTEND_URL`, and `DATABASE_PATH`
- Frontend: `VITE_API_URL`, including the `/api` path

Set `FRONTEND_URL` to the deployed frontend origin and `VITE_API_URL` to the deployed Flask URL, for example `https://api.example.com/api`. Configure `VITE_API_URL` only when overriding the local default, such as in the Vercel production environment.

The optional `DATABASE_PATH` variable controls where Flask stores the SQLite database; locally it defaults to `flask-backend/instance/movie-app.sqlite3`. In production, point it to a persistent writable location such as `/data/movie-night.sqlite3`.

Asset credits and licensing notes are in [`/react-frontend/public/ASSETS.md`](/react-frontend/public/ASSETS.md).

## Next steps

- Migrate the React frontend from JavaScript to TypeScript
- Add automated tests
- Add CI
