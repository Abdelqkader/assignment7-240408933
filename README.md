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
