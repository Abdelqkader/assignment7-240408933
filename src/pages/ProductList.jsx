import { fetchProducts } from '../api/productsApi.js';
import { useFetch } from '../hooks/useFetch.js';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductList() {
  const { loading, error, data: products } = useFetch(fetchProducts, []);

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

  return (
    <section>
      <h1>Products</h1>
      {products.length === 0 ? (
        <p className="empty">There are no products.</p>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
