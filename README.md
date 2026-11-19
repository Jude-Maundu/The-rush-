# The Rush

A React and Bootstrap site for the student short film **The Rush**. The app includes the film landing page, synopsis and production photos, cast and crew, trailer, sign-in-gated film player, per-account resume progress and watch history, reviews, and an admin dashboard.

## Run locally

1. Start the API by following [`../backend/README.md`](../backend/README.md).
2. From this directory, run `npm install` and then `npm start`.
3. Configure `REACT_APP_API_URL` if the API is not at the default hosted backend `https://the-rush-backend.onrender.com`.

Cast and crew names, roles, biographies, and portraits come from the backend and are managed in the admin dashboard; there are no frontend cast/crew defaults. Run the latest `../backend/supabase/schema.sql` to remove untouched legacy sample records and use the database table for admin-managed profiles. The film player and trailer use details in `src/data/film.js`. The About page's campus/team photographs are illustrative; replace them with your production's own behind-the-scenes photos when available.

Each cast or crew member added in the dashboard has a page at `/cast/<slug>`. Set `REACT_APP_CONTACT_EMAIL` to enable the Contact form; official social handles and screening dates should be added when confirmed.

## Checks

- `npm run build`
- `CI=true npm test -- --watchAll=false --runInBand`
