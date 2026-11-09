import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchProduct } from '../api/productsApi.js';
import { useFetch } from '../hooks/useFetch.js';
import { useCartStore } from '../store/cartStore.js';

export default function ProductDetail() {
  // Route parameters are always strings.
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const addItem = useCartStore((state) => state.addItem);

  // id is a dependency, so editing the URL to another product loads it.
  const { loading, error, data: product } = useFetch((signal) => fetchProduct(id, signal), [id]);

  const numericId = Number(id);
  const listSearch = location.state?.listSearch ?? '';

  function goBack() {
    navigate(`/products${listSearch}`);
  }

  if (loading) {
    return <p role="status">Loading product…</p>;
  }

  if (error) {
    return (
      <section>
        <p role="alert" className="error">
          {error.status === 404 ? `Product not found (id "${id}").` : `Could not load the product: ${error.message}`}
        </p>
        <button type="button" onClick={goBack}>
          Back to the products
        </button>
      </section>
    );
  }

  return (
    <section className="detail">
      <button type="button" onClick={goBack}>
        ← Back to the products
      </button>
      <img src={product.thumbnail} alt={product.title} className="detail-image" />
      <h1>{product.title}</h1>
      <p className="muted">{product.category}</p>
      <p>{product.description}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <div className="detail-actions">
        <button type="button" onClick={() => addItem(product)}>
          Add to cart
        </button>
        {Number.isInteger(numericId) && (
          <Link to={`/products/${numericId + 1}`} state={location.state}>
            Next product →
          </Link>
        )}
      </div>
    </section>
  );
}
