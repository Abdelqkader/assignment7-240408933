import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>There is no page at this address.</p>
      <Link to="/">Back to the home page</Link>
    </section>
  );
}
