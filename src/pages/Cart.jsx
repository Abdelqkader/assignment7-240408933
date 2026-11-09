import { Link } from 'react-router-dom';
import { selectTotalPrice, useCartStore } from '../store/cartStore.js';

export default function Cart() {
  // items is an existing array reference; the total is a number.
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore(selectTotalPrice);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  if (items.length === 0) {
    return (
      <section>
        <h1>Your cart</h1>
        <p className="empty">Your cart is empty.</p>
        <Link to="/products">Browse the products</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <span className="cart-title">{item.title}</span>
            <span>${item.price.toFixed(2)}</span>
            <span className="quantity">
              <button
                type="button"
                aria-label={`Decrease quantity of ${item.title}`}
                onClick={() => setQuantity(item.id, item.quantity - 1)}
              >
                −
              </button>
              <span aria-live="polite">{item.quantity}</span>
              <button
                type="button"
                aria-label={`Increase quantity of ${item.title}`}
                onClick={() => setQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </span>
            <button type="button" onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p className="total">Total: ${totalPrice.toFixed(2)}</p>
      <button type="button" onClick={clear}>
        Clear cart
      </button>
    </section>
  );
}
