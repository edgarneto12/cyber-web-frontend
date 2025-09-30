import React from 'react';


interface OrderSummaryProps {
  subtotal: number;
  estimatedTax: number;
  shipping: number;
  total: number;
  onCheckout?: () => void;
}


const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, estimatedTax, shipping, total, onCheckout }) => {
  return (
    <div className="bg-white rounded-xl shadow p-8 min-w-[340px] max-w-[340px]">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <input
        id="discount-code"
        name="discountCode"
        className="w-full mb-3 p-2 border border-gray-300 rounded text-base"
        placeholder="Discount code / Promo code"
      />
      <input
        id="bonus-card-number"
        name="bonusCardNumber"
        className="w-full mb-3 p-2 border border-gray-300 rounded text-base"
        placeholder="Your bonus card number"
      />
      <button className="w-full mb-4 py-2 bg-gray-900 text-white rounded font-medium transition hover:bg-gray-800">Apply</button>
      <div className="flex justify-between mb-2 text-base"><span>Subtotal</span><span>${subtotal}</span></div>
      <div className="flex justify-between mb-2 text-base"><span>Estimated Tax</span><span>${estimatedTax}</span></div>
      <div className="flex justify-between mb-2 text-base"><span>Estimated shipping & Handling</span><span>${shipping}</span></div>
      <div className="flex justify-between font-semibold text-lg my-4"><span>Total</span><span>${total}</span></div>
      <button
        className="w-full py-3 bg-black text-white rounded-lg text-lg font-bold transition hover:bg-gray-900"
        onClick={onCheckout}
      >
        Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
