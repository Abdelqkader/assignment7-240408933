import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore.js';

export default function ProductCard({ product }) {
  const location = useLocation();
  // Only the action is needed, so only the action is selected.
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="card">
      <Link to={`/products/${product.id}`} state={{ listSearch: location.search }}>
        <img src={product.thumbnail} alt={product.title} className="card-image" loading="lazy" />
        <h3 className="card-title">{product.title}</h3>
      </Link>
      <p className="muted">{product.category}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <button type="button" onClick={() => addItem(product)}>
        Add to cart
      </button>
    </article>
  );
}
