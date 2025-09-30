import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import CartItem from '../components/CartPage/CartItem';
import OrderSummary from '../components/CartPage/OrderSummary';


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

const CartPage: React.FC = () => {

  const { user } = useUser();
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const { openSignIn } = useClerk();
  const { getToken } = useAuth();

  useEffect(() => {
    if (user) {
      (async () => {
        const token = await getToken();
        fetch('/api/shopping_carts/me', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
          .then(async (res) => {
            if (!res.ok) {
              const text = await res.text();
              throw new Error('Failed to fetch cart: ' + text);
            }
            const data = await res.json();
            if (setCart) {
              setCart(data);
            }
            setLoading(false);
          })
          .catch((err) => {
            if (setCart) setCart({ items: [], subtotal: 0, estimatedTax: 0, shipping: 0, total: 0 });
            setLoading(false);
          });
      })();
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (localCart.length === 0) {
        if (setCart) setCart({ items: [], subtotal: 0, estimatedTax: 0, shipping: 0, total: 0 });
        setLoading(false);
        return;
      }
      Promise.all(localCart.map(async (item: any) => {
        let product = item.product?.data || item.product;
        if (!product) {
          const res = await fetch(`/api/products/${item.productId}`);
          product = await res.json();
        }
        if (!product.url_image) product.url_image = 'https://via.placeholder.com/80x80?text=Produto';
        if (!product.price) product.price = 0;
        return {
          id: item.productId,
          product_id: item.productId,
          quantity: item.quantity,
          product: {
            ...product,
            color: item.color,
            memory: item.memory,
          },
          subtotal: product.price * item.quantity,
        };
      })).then((items: any[]) => {
        const subtotal = items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
        const estimatedTax = Math.round(subtotal * 0.1);
        const shipping = subtotal > 0 ? 20 : 0;
        const total = subtotal + estimatedTax + shipping;
        if (setCart) setCart({ items, subtotal, estimatedTax, shipping, total });
        setLoading(false);
      });
    }
  }, [user]);

  const handleQuantityChange = async (itemId: number, newQuantity: number, color?: string, memory?: string) => {
    if (!cart) return;
    if (newQuantity < 1) return;
    if (user) {
      try {
        const res = await fetch(`/api/shopping_carts/items/${itemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQuantity }),
        });
        if (!res.ok) throw new Error('Failed to update quantity');
        const token = await getToken();
        const cartRes = await fetch('/api/shopping_carts/me', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const cartData = await cartRes.json();
        if (setCart) setCart(cartData);
      } catch (e) {
        alert('Erro ao atualizar quantidade do item!');
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const idx = localCart.findIndex((item: any) =>
        item.productId === itemId &&
        item.color === color &&
        item.memory === memory
      );
      if (idx !== -1) {
        localCart[idx].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(localCart));
        const items = localCart.map((item: any) => ({
          id: item.productId,
          product_id: item.productId,
          quantity: item.quantity,
          product: {
            ...(item.product?.data || item.product),
            color: item.color,
            memory: item.memory,
          },
          subtotal: (item.product?.data?.price || item.product?.price || 0) * item.quantity,
        }));
        localStorage.setItem('cart', JSON.stringify(items));
        const subtotal = items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
        const estimatedTax = Math.round(subtotal * 0.1);
        const shipping = subtotal > 0 ? 20 : 0;
        const total = subtotal + estimatedTax + shipping;
        if (setCart) setCart({ items, subtotal, estimatedTax, shipping, total });
      }
    }
  };

  const handleRemove = async (itemId: number, color?: string, memory?: string) => {
    if (!cart) return;
    if (user) {
      try {
        const res = await fetch(`/api/shopping_carts/items/${itemId}`, {
          method: 'DELETE',
          headers: {},
        });
  if (!res.ok) throw new Error('Failed to remove item');
        if (setCart) setCart((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.filter((item: any) => item.id !== itemId),
          };
        });
      } catch (e) {
        alert('Erro ao remover item do carrinho!');
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const newCart = localCart.filter((item: any) =>
        !(item.productId === itemId && item.color === color && item.memory === memory)
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      const items = newCart.map((item: any) => ({
        id: item.productId,
        product_id: item.productId,
        quantity: item.quantity,
        product: {
          ...(item.product?.data || item.product),
          color: item.color,
          memory: item.memory,
        },
        subtotal: (item.product?.data?.price || item.product?.price || 0) * item.quantity,
      }));
      localStorage.setItem('cart', JSON.stringify(items));
      const subtotal = items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
      const estimatedTax = Math.round(subtotal * 0.1);
      const shipping = subtotal > 0 ? 20 : 0;
      const total = subtotal + estimatedTax + shipping;
      if (setCart) setCart({ items, subtotal, estimatedTax, shipping, total });
    }
  };


  if (loading) return <div className="p-8 text-gray-500">Carregando...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-2xl font-semibold mb-2">Seu carrinho está vazio</div>
        <div className="text-gray-500 mb-6">Adicione produtos para começar suas compras!</div>
        <a
          href="/products_page"
          className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition"
        >
          Shop Now
        </a>
      </div>
    );
  }

  return (
    <>
  <main className="w-full min-h-[70vh] flex justify-center items-start bg-white py-6">
    <div className="max-w-[1200px] w-full flex flex-col md:flex-row gap-6 md:gap-10">
  <section className="bg-white rounded-xl shadow p-2 md:p-8 w-full md:flex-1 md:max-w-none max-w-[420px] mx-auto">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
        {cart.items.map((item: any) => (
          <CartItem
            key={item.id}
            {...item}
            product={{
              ...item.product,
              color: item.color ?? item.product?.color,
              memory: item.memory ?? item.product?.memory,
            }}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
          />
        ))}
      </section>
      <aside className="w-full md:w-auto md:min-w-[340px] md:max-w-[340px] flex justify-center">
        <div className="w-full md:w-auto md:max-w-[340px] max-w-[420px] mx-auto">
          <OrderSummary
            subtotal={cart.subtotal}
            estimatedTax={cart.estimatedTax}
            shipping={cart.shipping}
            total={cart.total}
            onCheckout={async () => {
              if (user) {
                navigate('/checkoutsteps');
              } else {
                if (openSignIn) {
                  openSignIn();
                }
              }
            }}
          />
        </div>
      </aside>
    </div>
  </main>
    </>
  );
};

export default CartPage;
