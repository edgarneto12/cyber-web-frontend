
import React, { useContext } from 'react';
import LocationIcon from '../assets/images/steps/location.svg';
import ShippingIcon from '../assets/images/steps/Shipping.svg';
import PaymentIcon from '../assets/images/steps/Payment.svg';
import cardImg from '../assets/images/steps/card.png';
import { CartContext } from '../contexts/CartContext';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const CheckoutStepsPage: React.FC = () => {
  const [paymentError, setPaymentError] = React.useState('');
  const [step, setStep] = React.useState(1);
  const [paymentMethod, setPaymentMethod] = React.useState('Credit Card');
  const [cardName, setCardName] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExp, setCardExp] = React.useState('');
  const [cardCVV, setCardCVV] = React.useState('');
  const [shippingMethod, setShippingMethod] = React.useState('Free');
  const [orderComplete, setOrderComplete] = React.useState(false);

  const [addresses, setAddresses] = React.useState([
    {
      id: 1,
      label: 'Thornridge',
      type: 'HOME',
      address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
      phone: '(209) 555-0104',
      selected: true,
      editing: false,
    },
    {
      id: 2,
      label: 'Headoffice',
      type: 'OFFICE',
      address: '2715 Ash Dr. San Jose, South Dakota 83475',
      phone: '(704) 555-0127',
      selected: false,
      editing: false,
    },
  ]);
  const [newAddress, setNewAddress] = React.useState({ label: '', type: 'HOME', address: '', phone: '' });
  const [showAddForm, setShowAddForm] = React.useState(false);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-start">
      <div className="w-full max-w-6xl mx-auto pt-0 px-2 md:px-0">
        <div className="flex justify-between gap-4 md:gap-16 mb-8 md:mb-16 mt-6 md:mt-8 w-full max-w-[420px] md:max-w-none mx-auto">
          <div className="flex w-full md:hidden justify-between">
            {step === 1 && (
              <>
                <div className="flex items-center gap-2">
                  <img src={LocationIcon} alt="Location" width={24} height={24} className={step === 1 ? '' : 'filter grayscale brightness-80 opacity-40'} />
                  <span className={step === 1 ? 'font-bold text-black' : 'text-gray-400'}>Step 1<br />Address</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={ShippingIcon} alt="Shipping" width={24} height={24} className={Number(step) === 2 ? '' : 'filter grayscale brightness-80 opacity-40'} />
                  <span className={Number(step) === 2 ? 'font-bold text-black' : 'text-gray-400'}>Step 2<br />Shipping</span>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="flex items-center gap-2">
                  <img src={ShippingIcon} alt="Shipping" width={24} height={24} className={step === 2 ? '' : 'filter grayscale brightness-80 opacity-40'} />
                  <span className={step === 2 ? 'font-bold text-black' : 'text-gray-400'}>Step 2<br />Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={PaymentIcon} alt="Payment" width={24} height={24} className={Number(step) === 3 ? '' : 'filter grayscale brightness-80 opacity-40'} />
                  <span className={Number(step) === 3 ? 'font-bold text-black' : 'text-gray-400'}>Step 3<br />Payment</span>
                </div>
              </>
            )}
            {step === 3 && (
              <div className="flex items-center gap-2">
                <img src={PaymentIcon} alt="Payment" width={24} height={24} className={step === 3 ? '' : 'filter grayscale brightness-80 opacity-40'} />
                <span className={step === 3 ? 'font-bold text-black' : 'text-gray-400'}>Step 3<br />Payment</span>
              </div>
            )}
          </div>
          <div className="hidden md:flex w-full justify-between">
            <div className="flex items-center gap-2">
              <img src={LocationIcon} alt="Location" width={24} height={24} className={step === 1 ? '' : 'filter grayscale brightness-80 opacity-40'} />
              <span className={step === 1 ? 'font-bold text-black' : 'text-gray-400'}>Step 1<br />Address</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={ShippingIcon} alt="Shipping" width={24} height={24} className={step === 2 ? '' : 'filter grayscale brightness-80 opacity-40'} />
              <span className={Number(step) === 2 ? 'font-bold text-black' : 'text-gray-400'}>Step 2<br />Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={PaymentIcon} alt="Payment" width={24} height={24} className={step === 3 ? '' : 'filter grayscale brightness-80 opacity-40'} />
              <span className={Number(step) === 3 ? 'font-bold text-black' : 'text-gray-400'}>Step 3<br />Payment</span>
            </div>
          </div>
        </div>
          {step === 1 && (
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4">Select Address</h2>
              <div className="w-full flex flex-col gap-4 mb-6">
                {addresses.map(addr => addr.editing ? (
                  <div key={addr.id} className="w-full bg-gray-50 rounded-xl border flex items-center justify-between px-6 py-5">
                    <div className="flex-1">
                      <input type="text" className="font-bold mb-1 mr-2" value={addr.label} placeholder="Name" onChange={e => setAddresses(addresses.map(a => a.id === addr.id ? { ...a, label: e.target.value } : a))} />
                      <input type="text" className="bg-black text-white text-xs px-2 py-1 rounded ml-2" value={addr.type} placeholder="Type (ex: HOME, OFFICE, etc)" onChange={e => setAddresses(addresses.map(a => a.id === addr.id ? { ...a, type: e.target.value } : a))} /><br />
                      <input type="text" className="text-gray-600 mb-1 w-full" value={addr.address} onChange={e => setAddresses(addresses.map(a => a.id === addr.id ? { ...a, address: e.target.value } : a))} /><br />
                      <input type="text" className="text-gray-600 w-full" value={addr.phone} onChange={e => setAddresses(addresses.map(a => a.id === addr.id ? { ...a, phone: e.target.value } : a))} />
                    </div>
                    <div className="flex gap-3">
                      <button className="text-green-700 hover:text-green-900" onClick={() => setAddresses(addresses.map(a => a.id === addr.id ? { ...a, editing: false } : a))}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg></button>
                      <button className="text-gray-700 hover:text-red-600" onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg></button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={addr.id}
                    className={`w-full bg-gray-50 rounded-xl border flex items-center justify-between px-6 py-5 cursor-pointer ${addr.selected ? 'border-black' : ''}`}
                    onClick={e => {
                      if ((e.target as HTMLElement).closest('button')) return;
                      setAddresses(addresses.map(a => ({ ...a, selected: a.id === addr.id })));
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <input type="radio" name="address" checked={addr.selected} readOnly className="mr-2 align-middle" />
                        <span className="font-bold align-middle">{addr.label}</span>
                        <span className={`ml-2 bg-${addr.type === 'HOME' ? 'black' : 'gray-700'} text-white text-xs px-2 py-1 rounded`}>{addr.type}</span>
                      </div>
                      <div className="text-gray-600 ml-6">
                        {addr.address}<br />{addr.phone}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        className="text-gray-700 hover:text-black"
                        onClick={e => {
                          e.stopPropagation();
                          setAddresses(addresses.map(a => a.id === addr.id ? { ...a, editing: true } : a));
                        }}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                      </button>
                      <button
                        className="text-gray-700 hover:text-red-600"
                        onClick={e => {
                          e.stopPropagation();
                          setAddresses(addresses.filter(a => a.id !== addr.id));
                        }}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* add novo endereço*/}
              <div className="w-full flex flex-col items-center mb-8">
                {showAddForm ? (
                  <form className="w-full max-w-md flex flex-col gap-2 mb-4 bg-gray-50 rounded-xl border p-4" onSubmit={e => {
                    e.preventDefault();
                    if (!newAddress.label || !newAddress.address || !newAddress.phone) return;
                    setAddresses([...addresses, {
                      id: Math.max(...addresses.map(a => a.id)) + 1,
                      ...newAddress,
                      selected: false,
                      editing: false,
                    }]);
                    setNewAddress({ label: '', type: 'HOME', address: '', phone: '' });
                    setShowAddForm(false);
                  }}>
                    <input className="border rounded px-2 py-1" placeholder="Name" value={newAddress.label} onChange={e => setNewAddress({ ...newAddress, label: e.target.value })} />
                    <input className="border rounded px-2 py-1" placeholder="Type (ex: HOME, OFFICE, etc)" value={newAddress.type} onChange={e => setNewAddress({ ...newAddress, type: e.target.value })} />
                    <input className="border rounded px-2 py-1" placeholder="Address" value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} />
                    <input className="border rounded px-2 py-1" placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="px-4 py-2 bg-black text-white rounded">Add</button>
                      <button type="button" className="px-4 py-2 bg-gray-200 text-black rounded" onClick={() => setShowAddForm(false)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    <button
                      className="flex flex-col items-center w-full max-w-md py-2 text-black text-base"
                      onClick={() => setShowAddForm(true)}
                    >
                      <div className="w-full flex items-center justify-center">
                        <span className="border-t border-dashed border-gray-400 flex-1"></span>
                        <span className="mx-3 text-xl font-bold">＋</span>
                        <span className="border-t border-dashed border-gray-400 flex-1"></span>
                      </div>
                      <span className="mt-2">Add New Address</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="w-full flex justify-between mt-2">
                <button className="w-40 py-3 border rounded-xl bg-white text-gray-700" disabled>Back</button>
                <button className="w-40 py-3 rounded-xl bg-black text-white" onClick={() => setStep(2)}>Next</button>
              </div>
            </div>
          )}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Shipment Method</h2>
            <div className="mb-6">
              {/* envio*/}
              <div
                className={`border rounded-lg p-4 mb-3 flex items-center justify-between bg-white cursor-pointer ${shippingMethod === 'Free' ? 'border-black' : ''}`}
                onClick={() => setShippingMethod('Free')}
                tabIndex={0}
                role="button"
              >
                <div className="flex items-center">
                  <input type="radio" name="shipping" checked={shippingMethod === 'Free'} readOnly className="mr-2" />
                  <span className="font-bold">Free <span className="bg-black text-white text-xs px-2 py-1 rounded ml-2">Regular shipment</span></span>
                </div>
                <span className="text-gray-600">17 Oct, 2023</span>
              </div>
              <div
                className={`border rounded-lg p-4 mb-3 flex items-center justify-between bg-white cursor-pointer ${shippingMethod === '$8.50' ? 'border-black' : ''}`}
                onClick={() => setShippingMethod('$8.50')}
                tabIndex={0}
                role="button"
              >
                <div className="flex items-center">
                  <input type="radio" name="shipping" checked={shippingMethod === '$8.50'} readOnly className="mr-2" />
                  <span className="font-bold">$8.50 <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded ml-2">Express</span></span>
                </div>
                <span className="text-gray-600">1 Oct, 2023</span>
              </div>
              <div
                className={`border rounded-lg p-4 mb-3 flex items-center justify-between bg-white cursor-pointer ${shippingMethod === 'Schedule' ? 'border-black' : ''}`}
                onClick={() => setShippingMethod('Schedule')}
                tabIndex={0}
                role="button"
              >
                <div className="flex items-center">
                  <input type="radio" name="shipping" checked={shippingMethod === 'Schedule'} readOnly className="mr-2" />
                  <span className="font-bold">Schedule <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded ml-2">Pick a date</span></span>
                </div>
                <span className="text-gray-600">Pick a date when you want to get your delivery</span>
              </div>
            </div>
            <div className="w-full flex justify-center gap-6 mt-2">
              <button className="w-40 py-3 border rounded-xl bg-white text-gray-700" onClick={() => setStep(1)}>Back</button>
              <button className="w-40 py-3 rounded-xl bg-black text-white" onClick={() => setStep(3)}>Next</button>
            </div>
          </div>
        )}
        {step === 3 && !orderComplete && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="block md:hidden w-full max-w-[420px] mx-auto bg-white border border-gray-300 p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Payment</h2>
              <div className="flex gap-2 mb-4">
                <button className={`px-4 py-2 rounded ${paymentMethod === 'Credit Card' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setPaymentMethod('Credit Card')}>Credit Card</button>
                <button className={`px-4 py-2 rounded ${paymentMethod === 'PayPal' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setPaymentMethod('PayPal')}>PayPal</button>
                <button className={`px-4 py-2 rounded ${paymentMethod === 'PayPal Credit' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setPaymentMethod('PayPal Credit')}>PayPal Credit</button>
              </div>
              <div className="flex justify-center mb-4">
                <img src={cardImg} alt="Credit Card" className="w-[320px] h-[200px] object-cover rounded-xl shadow" />
              </div>
              <input className="w-full mb-2 p-2 border rounded" placeholder="Cardholder Name" value={cardName} onChange={e => setCardName(e.target.value)} />
              <input className="w-full mb-2 p-2 border rounded" placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))} />
              <div className="flex gap-2 mb-2">
                <input className="w-1/2 p-2 border rounded" placeholder="Exp. Date" value={cardExp} onChange={e => setCardExp(e.target.value.replace(/[^\d\/]/g, ''))} maxLength={5} />
                <input className="w-1/2 p-2 border rounded" placeholder="CVV" value={cardCVV} onChange={e => setCardCVV(e.target.value.replace(/\D/g, '').slice(0,4))} maxLength={4} />
              </div>
              <label className="flex items-center mt-2 mb-4"><input type="checkbox" className="mr-2" /> Same as billing address</label>
              <div className="w-full flex justify-center gap-6 mt-2">
                <button className="w-40 py-3 border rounded-xl bg-white text-gray-700" onClick={() => setStep(2)}>Back</button>
                <button
                  className="w-40 py-3 rounded-xl bg-black text-white"
                  onClick={() => {
                    if (!cardName.trim()) {
                      setPaymentError('Cardholder name is required.');
                      setTimeout(() => setPaymentError(''), 3000);
                      return;
                    }
                    if (!cardNumber || isNaN(Number(cardNumber))) {
                      setPaymentError('Card number must be a valid integer.');
                      setTimeout(() => setPaymentError(''), 3000);
                      return;
                    }
                    if (!/^\d{2}\/\d{2}$/.test(cardExp)) {
                      setPaymentError('Expiration date must be in MM/YY format.');
                      setTimeout(() => setPaymentError(''), 3000);
                      return;
                    }
                    if (!cardCVV || isNaN(Number(cardCVV)) || cardCVV.length < 3) {
                      setPaymentError('CVV must be a valid integer with 3-4 digits.');
                      setTimeout(() => setPaymentError(''), 3000);
                      return;
                    }
                    setPaymentError('');
                    setOrderComplete(true);
                  }}
                >Pay</button>
              </div>
              {/* Espaço reservado para mensagem de erro abaixo do botão Pay */}
              <div style={{ minHeight: '40px' }} className="w-full flex justify-center items-center mt-2">
                {paymentError && (
                  <div className="px-4 py-2 bg-red-100 text-red-700 rounded font-semibold text-center animate-fade-in">
                    {paymentError}
                  </div>
                )}
              </div>
            </div>
            <div className="hidden md:flex flex-row gap-16 w-full mt-0">
              <div className="flex-1 bg-white border border-gray-300 p-10">
                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                {/* Produtos */}
                <div className="mb-6 flex flex-col gap-4">
                  {cart?.items && cart.items.length > 0 ? (
                    cart.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                        <span className="flex items-center gap-4">
                          <img src={item.product?.url_image || 'https://via.placeholder.com/80x80?text=Produto'} alt={item.product?.name} className="w-16 h-16 rounded-lg object-contain" />
                          <span className="font-semibold text-base">{item.product?.name}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          {item.color && <span className="text-xs bg-gray-200 px-2 py-1 rounded">{item.color}</span>}
                          {item.memory && <span className="text-xs bg-gray-200 px-2 py-1 rounded">{item.memory}</span>}
                          <span className="font-bold text-lg">${item.product?.price ? (item.product.price * item.quantity).toFixed(2) : '0.00'}</span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">Your cart is empty.</div>
                  )}
                </div>
                {/* endereco*/}
                <div className="mb-2 text-left text-sm text-gray-600">Address:<br /><span className="font-bold text-black">2118 Thornridge Cir. Syracuse, Connecticut 35624</span></div>
                {/* Forma de envio */}
                <div className="mb-2 text-left text-sm text-gray-600">Shipment method:<br /><span className="font-bold text-black">{shippingMethod}</span></div>
                {/* Forma de pagamento */}
                <div className="mb-2 text-left text-sm text-gray-600">Payment method:<br /><span className="font-bold text-black">{paymentMethod}</span></div>
                {/*Totais */}
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Subtotal<br /><span className="font-bold text-black">${cart?.subtotal?.toFixed(2) ?? '0.00'}</span></div>
                  <div className="text-sm text-gray-600 mb-2">Estimated Tax<br /><span className="font-bold text-black">${cart?.estimatedTax?.toFixed(2) ?? '0.00'}</span></div>
                  <div className="text-sm text-gray-600 mb-2">Estimated shipping & Handling<br /><span className="font-bold text-black">${cart?.shipping?.toFixed(2) ?? '0.00'}</span></div>
                  <div className="text-lg font-bold mt-2">Total<br />${cart?.total?.toFixed(2) ?? '0.00'}</div>
                </div>
              </div>
              {/* Pagamento*/}
              <div className="min-w-[400px] max-w-[440px] bg-white border border-gray-300 p-6">
                <h2 className="text-lg font-semibold mb-4">Payment</h2>
                <div className="flex gap-4 mb-4">
                  <button className={`px-4 py-2 rounded ${paymentMethod === 'Credit Card' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setPaymentMethod('Credit Card')}>Credit Card</button>
                  <button className={`px-4 py-2 rounded ${paymentMethod === 'PayPal' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setPaymentMethod('PayPal')}>PayPal</button>
                  <button className={`px-4 py-2 rounded ${paymentMethod === 'PayPal Credit' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setPaymentMethod('PayPal Credit')}>PayPal Credit</button>
                </div>
                <div className="flex justify-center mb-4">
                  <img src={cardImg} alt="Credit Card" className="w-[320px] h-[200px] object-cover rounded-xl shadow" />
                </div>
                <input className="w-full mb-2 p-2 border rounded" placeholder="Cardholder Name" value={cardName} onChange={e => setCardName(e.target.value)} />
                <input className="w-full mb-2 p-2 border rounded" placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))} />
                <div className="flex gap-2 mb-2">
                  <input className="w-1/2 p-2 border rounded" placeholder="Exp. Date" value={cardExp} onChange={e => setCardExp(e.target.value.replace(/[^\d\/]/g, ''))} maxLength={5} />
                  <input className="w-1/2 p-2 border rounded" placeholder="CVV" value={cardCVV} onChange={e => setCardCVV(e.target.value.replace(/\D/g, '').slice(0,4))} maxLength={4} />
                </div>
                <label className="flex items-center mt-2 mb-4"><input type="checkbox" className="mr-2" /> Same as billing address</label>
                <div className="w-full flex justify-center gap-6 mt-2">
                  <button className="w-40 py-3 border rounded-xl bg-white text-gray-700" onClick={() => setStep(2)}>Back</button>
                  <button
                    className="w-40 py-3 rounded-xl bg-black text-white"
                    onClick={() => {
                      if (!cardName.trim()) {
                        setPaymentError('Cardholder name is required.');
                        setTimeout(() => setPaymentError(''), 3000);
                        return;
                      }
                      if (!cardNumber || isNaN(Number(cardNumber))) {
                        setPaymentError('Card number must be a valid integer.');
                        setTimeout(() => setPaymentError(''), 3000);
                        return;
                      }
                      if (!/^\d{2}\/\d{2}$/.test(cardExp)) {
                        setPaymentError('Expiration date must be in MM/YY format.');
                        setTimeout(() => setPaymentError(''), 3000);
                        return;
                      }
                      if (!cardCVV || isNaN(Number(cardCVV)) || cardCVV.length < 3) {
                        setPaymentError('CVV must be a valid integer with 3-4 digits.');
                        setTimeout(() => setPaymentError(''), 3000);
                        return;
                      }
                      setPaymentError('');
                      setOrderComplete(true);
                    }}
                  >Pay</button>
                </div>
                <div style={{ minHeight: '40px' }} className="w-full flex justify-center items-center mt-2">
                  {paymentError && (
                    <div className="px-4 py-2 bg-red-100 text-red-700 rounded font-semibold text-center animate-fade-in">
                      {paymentError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {orderComplete && (
          <div className="flex flex-col items-center justify-center w-full py-16">
            <div className="bg-white rounded-xl border p-8 max-w-xl w-full text-center">
              <h2 className="text-2xl font-bold mb-4 text-green-600">Order completed!</h2>
              <p className="mb-6 text-gray-700">Your order was placed successfully. See the summary below:</p>
              <div className="mb-4 text-left">
                <h3 className="font-semibold mb-2">Products:</h3>
                {cart?.items && cart.items.length > 0 ? (
                  cart.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded p-2 mb-2">
                      <span className="flex items-center gap-2">
                        <img src={item.product?.url_image || 'https://via.placeholder.com/40x40?text=Product'} alt={item.product?.name} className="w-6 h-6 rounded" />
                        {item.product?.name}
                        {item.color && <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">{item.color}</span>}
                        {item.memory && <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">{item.memory}</span>}
                        {item.quantity > 1 && <span className="ml-2 text-xs">x{item.quantity}</span>}
                      </span>
                      <span className="font-bold">${item.product?.price ? (item.product.price * item.quantity).toFixed(2) : '0.00'}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">Your cart is empty.</div>
                )}
              </div>
              <div className="mb-2 text-left">Shipping method: <span className="font-bold">{shippingMethod}</span></div>
              <div className="mb-2 text-left">Payment method: <span className="font-bold">{paymentMethod}</span></div>
              <div className="mb-2 text-left">Subtotal: <span className="font-bold">${cart?.subtotal?.toFixed(2) ?? '0.00'}</span></div>
              <div className="mb-2 text-left">Tax: <span className="font-bold">${cart?.estimatedTax?.toFixed(2) ?? '0.00'}</span></div>
              <div className="mb-2 text-left">Shipping: <span className="font-bold">${cart?.shipping?.toFixed(2) ?? '0.00'}</span></div>
              <div className="mb-4 text-left text-lg">Total: <span className="font-bold">${cart?.total?.toFixed(2) ?? '0.00'}</span></div>
              <button className="mt-6 px-6 py-3 bg-black text-white rounded-xl font-semibold" onClick={() => navigate('/home')}>Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutStepsPage;
