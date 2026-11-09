import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../api/authApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user, logIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Where the user wanted to go before ProtectedRoute sent them here.
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search ?? ''}` : '/';

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const signedInUser = await login(username, password);
      logIn(signedInUser);
      // replace: the login page is not left in the history.
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
      setLoading(false);
    }
  }

  return (
    <section className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="email"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      {loading && <p role="status">Checking your details…</p>}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </section>
  );
}
