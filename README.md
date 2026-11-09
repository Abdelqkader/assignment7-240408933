# Assignment 7 - Mini Shop (React Router, Context, Zustand)

A small online shop made with React and Vite. It loads products from the DummyJSON API,
lets you filter them (the filters live in the URL), shows a detail page for each product,
and has a cart that needs a signed-in user. The cart and the light/dark theme are kept
between visits.

## How to run

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

Demo account:

- Username: `240408933@st.biruni.edu.tr`
- Password: `demo123456`

> **Note:** the login and the protected cart page only run in the browser. This is a
> user-experience feature, **not security**. See "Protected routes" below.

## File Organization

```
src/
├─ api/
│  ├─ productsApi.js     fetchProducts(signal) and fetchProduct(id, signal). Plain fetch, no React.
│  └─ authApi.js         login(username, password): a fake server call that resolves after ~500 ms.
├─ hooks/
│  ├─ useFetch.js        loading / error / data with useReducer, aborts the request on cleanup.
│  └─ useLocalStorage.js same shape as useState, but reads and writes localStorage.
├─ context/
│  └─ AuthContext.jsx    AuthProvider (useReducer with LOGGED_IN / LOGGED_OUT) and useAuth().
├─ store/
│  └─ cartStore.js       Zustand store for the cart, saved to localStorage with subscribe().
├─ components/
│  ├─ Layout.jsx         NavBar + <Outlet /> + footer, applies the theme class.
│  ├─ NavBar.jsx         NavLinks, cart count, theme toggle, Login or username + Logout.
│  ├─ ProductCard.jsx    one product in the list, with an Add to cart button.
│  └─ ProtectedRoute.jsx sends signed-out users to /login and remembers where they were going.
├─ pages/
│  ├─ Home.jsx
│  ├─ ProductList.jsx    filters in the query string, filtered list derived during render.
│  ├─ ProductDetail.jsx  reads :id from the URL, Back button, Next product link.
│  ├─ Cart.jsx           quantities, remove, total, clear, empty message.
│  ├─ Login.jsx          controlled form, loading and error message, redirect back.
│  └─ NotFound.jsx
├─ App.jsx               all routes (products are nested under /products).
├─ main.jsx              BrowserRouter + AuthProvider around <App />.
└─ index.css             minimal styles and the light/dark colours (CSS custom properties).
```

### Routes

| Path            | Page          | Access              |
| --------------- | ------------- | ------------------- |
| `/`             | Home          | Public              |
| `/products`     | ProductList   | Public              |
| `/products/:id` | ProductDetail | Public              |
| `/cart`         | Cart          | Signed-in users only |
| `/login`        | Login         | Public              |
| anything else   | NotFound      | Public              |

All pages render inside `Layout`, which uses `<Outlet />` for the matched child page.
`ProductList` and `ProductDetail` are nested routes under `/products` (an index route and `:id`).

## Reasoning Questions

### 1. State choices

- **Signed-in user:** in `AuthContext` (Context + `useReducer`). Many parts of the app need it
  (NavBar, ProtectedRoute, Login), it changes very rarely, and the reducer gives two clear
  transitions, `LOGGED_IN` and `LOGGED_OUT`.
- **Cart:** in the Zustand store `cartStore.js`. It changes often (every add, +, −, remove) and
  is read by components far apart (NavBar count, cards, detail page, cart page). With selectors,
  each component only re-renders for the part it reads.
- **Filter values:** in the URL query string (`?q=...&category=...`), read with
  `useSearchParams`. That way a link or a refresh shows the same filtered view, and the back
  button works.
- **Product list:** local to `ProductList` through `useFetch`. It is server data used by one
  page, so it does not need to be global. The filtered list is not state at all; it is
  computed from the products and the URL during render.
- **Theme:** in `Layout`, with `useLocalStorage`. Only the layout wrapper and the toggle in the
  NavBar need it, and it has to survive a reload.

### 2. Context versus store

The user changes once per login, so Context is enough: when it changes, everything that reads
it should re-render anyway. The cart changes many times, and a Context re-renders every
consumer on every change, even a component that only shows the item count or only needs the
`addItem` action. If the cart were in Context, all product cards and the NavBar would re-render
on every quantity click. If the user were in Zustand it would still work, but we would lose the
simple provider/reducer pattern for no gain, and nothing would force the app to be wrapped in a
provider (`useAuth` throws a clear error if it is used outside `AuthProvider`).

### 3. Custom hooks

`useFetch` shares the **logic**: the reducer with `FETCH_START` / `FETCH_SUCCESS` /
`FETCH_ERROR`, the effect that calls the fetcher, and the `AbortController` cleanup. It does
**not** share the **state**: `ProductList` and `ProductDetail` each call the hook and each get
their own `useReducer`, so loading the list never changes the detail page's data. The hook also
does not know what it fetches; the page passes the fetching function and its inputs.

### 4. Route parameters

`useParams()` always returns strings, so `id` is the string `"3"`, not the number `3`. It
mattered for the "Next product" link: `id + 1` would give `"31"`, so I convert it first with
`Number(id) + 1`, and only show the link when it is an integer. The cart uses `product.id`
from the API response (a number), not the URL value, so comparing ids inside the store with
`===` works.

### 5. Protected routes

`ProtectedRoute` only decides what the browser shows. Anyone can open the developer tools,
change the JavaScript or the state, and see the page; the "password" is even inside the
bundle. Real security needs a server: it checks the password, gives back a session or a token
(for example in an httpOnly cookie), and refuses to send private data (like a real cart or
orders) unless that token is valid. The client check would then only be for a nicer
experience.

### 6. Deep links

On a plain static file server, reloading `/products/3` asks the server for a file called
`/products/3`. That file does not exist, so the server answers 404 and React never loads. The
Vite dev server has a fallback for single-page apps: for unknown paths it sends back
`index.html`, React Router starts, reads the URL and shows the right page. In production the
server needs the same rewrite rule (send `index.html` for every route).

## Self-Study Notes

- **Updating one query parameter and keeping the others.** In the React Router docs I found
  that `setSearchParams` also accepts a function that gets the current params. In
  `ProductList` I copy them with `new URLSearchParams(previous)`, then `set` or `delete` only
  the one that changed, so changing the category keeps the search text. I pass
  `{ replace: true }` so typing in the search box does not add a history entry for every
  letter.
- **Starting the store from localStorage safely.** `localStorage.getItem` returns `null` when
  the key is missing, `JSON.parse` throws on broken text, and the saved value could have the
  wrong shape. `loadItems()` handles all three: `null` → empty cart, `try/catch` around the
  parse, and it keeps only items with a number `id` and `price`, a string `title` and a
  positive integer `quantity`. Saving is done with `useCartStore.subscribe(...)`, which the
  Zustand docs describe for reacting to changes outside React.
- **Light/dark theme.** I used CSS custom properties: the `.app` wrapper defines `--bg`,
  `--text`, `--surface`, ..., and `.app.theme-dark` gives them other values. Every rule uses
  the variables, so changing one class name on the wrapper changes the whole page.

## Challenges

- **Back button and filters.** When going from a filtered list to a product and back, the
  filters were lost. I pass the list's query string in the link state and the Back button
  navigates to `/products` plus that query string.
- **Re-renders of the NavBar.** Selecting the whole `items` array in the NavBar and counting it
  there would re-render the bar on every change to any item. Selecting the count as a number
  with `selectItemCount` avoids that, because Zustand compares the selected value and a number
  only changes when the count changes.
- **Login redirect without a history entry.** After signing in, the user should not come back
  to the login page with the back button. `navigate(redirectTo, { replace: true })` replaces it.
- **Aborted requests.** In development `StrictMode` runs effects twice, so the first request is
  aborted. `useFetch` ignores `AbortError` so it does not show a false error.
