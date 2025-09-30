import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

interface CartSyncHandlerProps {
  user: any;
  setCart: (cart: any) => void;
}

const CartSyncHandler: React.FC<CartSyncHandlerProps> = ({ user, setCart }) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    const rawCart = localStorage.getItem('cart');
    let localCart: any[] = [];
    try {
      localCart = rawCart ? JSON.parse(rawCart) : [];
      if (!Array.isArray(localCart)) localCart = [];
    } catch {
      localCart = [];
    }
    if (user) {
      if (localCart.length > 0) {
        const products = localCart.map((item: any) => ({
          product_id: item.productId,
          quantity: item.quantity,
          color: item.color,
          memory: item.memory,
        }));
        (async () => {
          const token = await getToken();
          fetch('/api/shopping_carts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ products }),
          })
            .then(async () => {
              localStorage.removeItem('cart');
              const cartRes = await fetch('/api/shopping_carts/me');
              const cartData = await cartRes.json();
              setCart(cartData);
              navigate('/checkoutsteps');
            });
        })();
      }
    }
  }, [user, setCart, navigate]);

  return null;
};

export default CartSyncHandler;
