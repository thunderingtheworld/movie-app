# Movie night

A full-stack movie discovery app for browsing new releases and saving a watchlist.

**Stack:** React, Flask, SQLite, CSS, and the TMDB API.

![Movie night new releases page](docs/movie-night.png)

## Local setup

Create the environment files:

```bash
cp flask-backend/.env.example flask-backend/.env
cp react-frontend/.env.example react-frontend/.env
```

Add your [The Movie Database (TMDB)](https://www.themoviedb.org) API read access token to `flask-backend/.env`. The example URLs already match the local development servers.

Install the backend and frontend dependencies, then start each side in a separate terminal:

```bash
pip install -r flask-backend/requirements.txt
npm --prefix react-frontend install
bash start_backend.sh
bash start_frontend.sh
```


## Deployment variables

- Backend: `TMDB_TOKEN` and `FRONTEND_URL`
- Frontend: `VITE_API_URL`, including the `/api` path

Set `FRONTEND_URL` to the deployed frontend origin and `VITE_API_URL` to the deployed Flask URL, for example `https://api.example.com/api`.

Asset credits and licensing notes are in [`/react-frontend/public/ASSETS.md`](/react-frontend/public/ASSETS.md). 