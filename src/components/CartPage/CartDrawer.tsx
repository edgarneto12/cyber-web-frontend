import React from 'react';
import CartItem from '../CartPage/CartItem';
import OrderSummary from '../CartPage/OrderSummary';

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

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartData | null;
  loading: boolean;
  onQuantityChange: (itemId: number, newQuantity: number) => void;
  onRemove: (itemId: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose, cart, loading, onQuantityChange, onRemove }) => {
  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Carrinho</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-black">×</button>
        </div>
        <div className="p-4 flex flex-col gap-4 h-[calc(100vh-64px)] overflow-y-auto">
          {loading ? (
            <div>Carregando...</div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">Carrinho vazio</div>
          ) : (
            <>
              <div className="flex-1">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onQuantityChange={onQuantityChange}
                    onRemove={onRemove}
                  />
                ))}
              </div>
              <OrderSummary
                subtotal={cart.subtotal}
                estimatedTax={cart.estimatedTax}
                shipping={cart.shipping}
                total={cart.total}
              />
            </>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
