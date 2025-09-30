import React from 'react';

interface CartItemProps {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    name: string;
    url_image: string;
    price: number;
    description: string;
    tag: string;
    memory?: string;
    color?: string;
  };
  subtotal: number;
  onQuantityChange: (itemId: number, newQuantity: number, color?: string, memory?: string) => void;
  onRemove: (itemId: number, color?: string, memory?: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ id, product, product_id, quantity, subtotal, onQuantityChange, onRemove }) => {
  return (
    <div className="flex items-center border-b border-gray-200 py-4 gap-4">
      <img src={product.url_image} alt={product.name} className="w-20 h-20 object-contain rounded-lg bg-gray-100" />
      <div className="flex-1">
        <div className="font-semibold text-base">
          {product.name}
          {/* Exibe memória e cor se existirem */}
          {product.memory && (
            <span className="ml-1 text-gray-500">- {product.memory}</span>
          )}
          {product.color && (
            <span className="ml-1 text-gray-500">- {product.color}</span>
          )}
        </div>
        <div className="text-gray-500 text-sm">#{product_id}</div>
      </div>
      <div className="flex items-center gap-2 border border-gray-300 rounded-md px-2 py-1 bg-gray-50">
        <button
          onClick={() => onQuantityChange(id, quantity - 1, product.color, product.memory)}
          disabled={quantity <= 1}
          className="text-lg w-7 h-7 flex items-center justify-center rounded-full transition disabled:text-gray-300 disabled:cursor-not-allowed"
        >-</button>
        <span>{quantity}</span>
        <button
          onClick={() => onQuantityChange(id, quantity + 1, product.color, product.memory)}
          className="text-lg w-7 h-7 flex items-center justify-center rounded-full transition"
        >+</button>
      </div>
      <div className="font-medium text-base min-w-[70px] text-right">${product.price}</div>
      <button
        className="ml-2 text-red-600 text-2xl hover:text-red-800 transition"
        onClick={() => onRemove(id, product.color, product.memory)}
      >×</button>
    </div>
  );
};

export default CartItem;
