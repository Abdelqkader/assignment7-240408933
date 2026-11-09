import { Link, useLocation } from 'react-router-dom';

export default function ProductCard({ product }) {
  const location = useLocation();

  return (
    <article className="card">
      <Link to={`/products/${product.id}`} state={{ listSearch: location.search }}>
        <img src={product.thumbnail} alt={product.title} className="card-image" loading="lazy" />
        <h3 className="card-title">{product.title}</h3>
      </Link>
      <p className="muted">{product.category}</p>
      <p className="price">${product.price.toFixed(2)}</p>
    </article>
  );
}
