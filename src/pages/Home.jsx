import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section>
      <h1>Welcome to the Mini Shop</h1>
      <p>Browse the catalogue, filter it, open a product and add it to your cart.</p>
      <p>
        <Link to="/products">Go to the products</Link>
      </p>
    </section>
  );
}
