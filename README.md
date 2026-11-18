# The Rush

A React and Bootstrap site for the student short film **The Rush**. The app includes the film landing page, synopsis and production photos, cast and crew, trailer, sign-in-gated film player, per-account resume progress and watch history, reviews, and an admin dashboard.

## Run locally

1. Start the API by following [`../backend/README.md`](../backend/README.md).
2. From this directory, run `npm install` and then `npm start`.
3. Configure `REACT_APP_API_URL` if the API is not at the default hosted backend `https://the-rush-backend.onrender.com`.

The film player and trailer use the YouTube video ID configured in `src/data/film.js`. The hero and poster are locally stored copies of that video's public thumbnails. The About page's campus/team photographs are illustrative Unsplash images; replace them with your production's own behind-the-scenes photos and cast portraits when available.

Each named cast or crew member has a page at `/cast/<slug>`. Portrait paths are set on the matching entries in `src/data/film.js`; add remaining portraits and approved biographies there. Set `REACT_APP_CONTACT_EMAIL` to enable the Contact form; official social handles and screening dates should be added when confirmed.

## Checks

- `npm run build`
- `CI=true npm test -- --watchAll=false --runInBand`
