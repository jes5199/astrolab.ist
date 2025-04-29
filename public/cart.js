const STORAGE_KEY = 'astro-cart';

function loadCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { items: [] };
  } catch (e) {
    console.error('Failed to load cart:', e);
    return { items: [] };
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}

// In-memory cart (loaded from LocalStorage)
let cart = loadCart();

// Listen for cart updates from other tabs/windows
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY) {
    cart = loadCart();
    // You could also fire a callback here to update your UI
  }
});

export const Cart = {
  getItems() {
    return cart.items;
  },

  addItem(priceId, quantity = 1) {
    const existing = cart.items.find(item => item.priceId === priceId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ priceId, quantity });
    }
    saveCart(cart);
  },

  removeItem(priceId) {
    cart.items = cart.items.filter(item => item.priceId !== priceId);
    saveCart(cart);
  },

  updateQuantity(priceId, quantity) {
    const item = cart.items.find(item => item.priceId === priceId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeItem(priceId);
      } else {
        saveCart(cart);
      }
    }
  },

  clear() {
    cart.items = [];
    saveCart(cart);
  }
}; 