import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import CartSyncHandler from './components/CartSyncHandler';
import { CartContext } from './contexts/CartContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutStepsPage from './pages/CheckoutStepsPage';

interface CartItemType {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    name: string;
    url_image: string;
    price: number;
    description: string;
    tag: string;
  };
  subtotal: number;
}

interface CartData {
  items: CartItemType[];
  subtotal: number;
  estimatedTax: number;
  shipping: number;
  total: number;
}

function App() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [cart, setCart] = useState<CartData | null>(null);
  const addToCart = async (productId: number, options?: { color?: string; memory?: string }) => {
    if (user) {
      await fetch('/api/shopping_carts/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, ...options }),
      });
      fetch('/api/shopping_carts/me')
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
          }
          const data = await res.json();
          setCart(data);
        })
        .catch(() => {
          setCart({ items: [], subtotal: 0, estimatedTax: 0, shipping: 0, total: 0 });
        });
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const res = await fetch(`/api/products/${productId}`);
      let product = await res.json();
      if (!product.url_image) product.url_image = 'https://via.placeholder.com/80x80?text=Produto';
      if (!product.price) product.price = 0;
      let colorName = options?.color;
      if (options?.color && product.colors) {
        const found = product.colors.find((c: any) => c.hex_code === options.color);
        if (found) colorName = found.name;
      }
      const existing = localCart.find((item: any) =>
        item.productId === productId &&
        item.color === colorName &&
        item.memory === options?.memory
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        localCart.push({ productId, quantity: 1, ...options, color: colorName, product });
      }
      localStorage.setItem('cart', JSON.stringify(localCart));
      setCart({ items: localCart, subtotal: 0, estimatedTax: 0, shipping: 0, total: 0 });
    }
  };

  useEffect(() => {
    if (cart?.items && cart.items.length > 0) return;
    if (user) {
      (async () => {
        const token = await getToken();
        fetch('http://localhost:3001/api/shopping_carts/me', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
          .then(res => res.json())
          .then(data => {
            if (data && data.items) setCart(data);
          });
      })();
    } else {
      const localCart = window.localStorage.getItem('cart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch {}
      }
    }
  }, [user, setCart]);

  return (
    <CartContext.Provider value={{ addToCart, cart, setCart }}>
      <BrowserRouter>
        <CartSyncHandler user={user} setCart={setCart} />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path='/products_page' element={<ProductsPage />} />
              <Route path='/products_page/:categoryName' element={<ProductsPage />} />
              <Route path='/product/:productId' element={<ProductDetailsPage />} />
              <Route path='/home' element={<HomePage />} />
              <Route path='/shoppingcart' element={<CartPage />} />
              <Route path='/checkoutsteps' element={<CheckoutStepsPage />} />
              <Route path='*' element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;
