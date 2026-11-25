# Crew Registry

React SPA for managing the crew of an orbital station. Built with React, React Router v6, Redux Toolkit, Firebase Authentication and Vite.


| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |


## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/crew` | Crew list (search, 3 filters, sorting, pagination, all in URL params) |
| `/crew/:id` | Crew member details |
| `/crew/new`, `/crew/:id/edit` | Add / edit form |
| `/dashboard` | Statistics, breakdowns, department filter |
| `/login` | Email/password and Google sign-in |
| `/signup` | Registration with validation and password confirmation |
| `/profile` | Protected page with email, UID and logout |
| `*` | Not found (404) |

## Authentication

- Firebase Authentication with Email/Password and Google providers.
- `AuthProvider` and `useAuth` (`src/context/AuthContext.jsx`) track the user with `onAuthStateChanged` and expose `user`, `loading`, `error`, `signup`, `login`, `loginWithGoogle`, `logout`.
- Sessions persist after refresh (`browserLocalPersistence`); `loading` stays true until Firebase restores the session, so protected routes never redirect too early.
- `ProtectedRoute` redirects unauthenticated users to `/login` and returns them to the page they asked for after login.
- The NavBar shows Login/Signup or Profile/Logout depending on the auth state.
- All Firebase calls live in `src/firebase.js` and `src/services/authService.js`.

## Redux Toolkit state

The app uses one Redux Toolkit store with three feature slices:

- `crew` stores paginated lists by their URL query and individual crew details. Its `createAsyncThunk` operations load lists and details and create, update, or delete crew members. `extraReducers` track each request's `loading`, `success`, and `error` state and keep an edited detail in sync.
- `dashboard` loads the complete roster for the statistics page and records loading and error states.
- `app` stores online/offline status and whether a saved response has been shown. Authentication stays in `AuthContext`, while form inputs and temporary menu state remain local to their components.

The service layer in `src/services/service.js` is separate from slices and calls the existing API and offline snapshot cache. Custom hooks in `src/hooks/` dispatch thunks and expose state to UI pages. `src/store/selectors.js` exports reusable selectors, including memoized dashboard statistics and department options. After a successful mutation, cached list queries and the loaded dashboard roster are refreshed.

Search, filters, sorting and pagination remain in URL search parameters. Search input is debounced by 300 ms before updating the URL and loading a new result set. The existing local API, authentication, protected routes, PWA caching, and offline fallback continue to be used.

## Structure

```
src/
  api/         fake API (localStorage, random delays and errors)
  components/  NavBar, ProtectedRoute, CrewCard, Pagination, ...
  context/     AuthContext (AuthProvider, useAuth)
  hooks/       useCrewList, useCrewMember, useAllCrew, useCrewMutations
  layouts/     RootLayout (NavBar + Outlet + Suspense)
  pages/       one file per route
  services/    service.js (API and offline fallback), authService.js (Firebase)
  store/       configured Redux store, crew/dashboard/app slices and selectors
  firebase.js  Firebase initialization
  styles/      index.css
  App.jsx      routes only
```



