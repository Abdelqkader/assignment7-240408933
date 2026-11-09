import { create } from 'zustand';

const STORAGE_KEY = 'cart-items';

function isValidItem(item) {
  return (
    item !== null &&
    typeof item === 'object' &&
    typeof item.id === 'number' &&
    typeof item.title === 'string' &&
    typeof item.price === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

// Start from what was saved, but never trust it: a missing key, broken JSON or
// wrong shape all give an empty cart instead of crashing the app.
function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
  } catch {
    return [];
  }
}

export const useCartStore = create((set) => ({
  items: loadItems(),

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }
      return {
        items: [...state.items, { id: product.id, title: product.title, price: product.price, quantity: 1 }],
      };
    }),

  removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

  setQuantity: (id, quantity) =>
    set((state) => {
      if (quantity < 1) {
        return { items: state.items.filter((item) => item.id !== id) };
      }
      return { items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)) };
    }),

  clear: () => set({ items: [] }),
}));

// Save the items whenever they change. This runs outside React, so no component
// has to remember to do it.
useCartStore.subscribe((state, previousState) => {
  if (state.items === previousState.items) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch {
    // Ignore: the cart still works for this visit.
  }
});

// Derived values are computed from items, never stored. Both return numbers,
// so a component using them only re-renders when the number changes.
export const selectItemCount = (state) => state.items.reduce((count, item) => count + item.quantity, 0);
export const selectTotalPrice = (state) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);
