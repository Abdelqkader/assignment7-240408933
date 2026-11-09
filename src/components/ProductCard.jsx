import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <article className="card">
      <Link to={`/products/${product.id}`}>
        <img src={product.thumbnail} alt={product.title} className="card-image" loading="lazy" />
        <h3 className="card-title">{product.title}</h3>
      </Link>
      <p className="muted">{product.category}</p>
      <p className="price">${product.price.toFixed(2)}</p>
    </article>
  );
}
