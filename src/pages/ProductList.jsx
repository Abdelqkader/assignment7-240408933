import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../api/productsApi.js';
import { useFetch } from '../hooks/useFetch.js';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductList() {
  const { loading, error, data: products } = useFetch(fetchProducts, []);
  const [searchParams, setSearchParams] = useSearchParams();

  // The filters live in the URL, so a link or a refresh shows the same view.
  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';

  // Change one parameter and keep the others.
  function updateParam(name, value) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) {
          next.set(name, value);
        } else {
          next.delete(name);
        }
        return next;
      },
      { replace: true },
    );
  }

  if (loading) {
    return <p role="status">Loading products…</p>;
  }

  if (error) {
    return (
      <p role="alert" className="error">
        Could not load the products: {error.message}
      </p>
    );
  }

  // Derived during render: nothing here is stored in state.
  const categories = [...new Set(products.map((product) => product.category))].sort();
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(normalizedQuery) && (category === '' || product.category === category),
  );

  return (
    <section>
      <h1>Products</h1>

      <div className="filters">
        <label>
          Search by title{' '}
          <input type="search" value={query} onChange={(event) => updateParam('q', event.target.value)} />
        </label>
        <label>
          Category{' '}
          <select value={category} onChange={(event) => updateParam('category', event.target.value)}>
            <option value="">All categories</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        {(query || category) && (
          <button type="button" onClick={() => setSearchParams({}, { replace: true })}>
            Clear filters
          </button>
        )}
      </div>

      <p className="muted" role="status">
        {visibleProducts.length} of {products.length} products
      </p>

      {visibleProducts.length === 0 ? (
        <p className="empty">No products match these filters.</p>
      ) : (
        <div className="grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
