import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { FiMenu, FiX } from 'react-icons/fi';
import logoCyber from '../../assets/images/header/logo.svg';
import searchIcon from '../../assets/images/header/search-icon.png';
import cartIcon from '../../assets/images/header/cart-icon.png';
import userIcon from '../../assets/images/header/user-icon.png';
import { useUser, useClerk } from '@clerk/clerk-react';

const Header: React.FC = () => {
  const { cart } = useContext(CartContext) || {};
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (cart && cart.items) {
      setCartCount(cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0));
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(localCart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0));
    }
  }, [cart]);
  const location = useLocation(); 
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const { signOut, openSignIn } = useClerk();

  const closeMenu = () => setIsMenuOpen(false);

  const handleCartClick = () => {
    navigate('/shoppingcart');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between p-4 gap-4 px-4">
        <Link to="/home" onClick={closeMenu}>
          <img src={logoCyber} alt="Logo da Cyber" className="w-[66px] h-[23px]" />
        </Link>
        <div className="hidden lg:flex items-center flex-grow justify-evenly gap-8">
          <div className="relative max-w-lg">
            <img src={searchIcon} alt="Ícone de Busca." className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              className="w-[372px] h-[56px] text-gray-400 rounded-md bg-gray-100 py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-8">
            <nav>
              <ul className="flex items-center gap-6">
                <li><Link to="/home" className={location.pathname === '/home' ? 'font-bold text-black' : 'text-gray-400 hover:text-black'}>Home</Link></li>
                <li><Link to="/products_page" className={location.pathname.startsWith('/products_page') ? 'font-bold text-black' : 'text-gray-400 hover:text-black'}>Shop</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-black">Contact Us</a></li>
                <li><Link to="#" className="text-gray-400 hover:text-black">Blog</Link></li>
              </ul>
            </nav>
            <div className="flex items-center gap-4">
              <button className="hover:opacity-75 relative" onClick={handleCartClick}>
                <img src={cartIcon} alt="Ícone do Carrinho" className="w-8 h-8" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white rounded-full text-xs px-2 py-0.5 font-bold">{cartCount}</span>
                )}
              </button>
              {user ? (
                <button onClick={() => signOut()} className="hover:opacity-75"><img src={userIcon} alt="Ícone de Usuário" className="w-8 h-8" /></button>
              ) : (
                <button onClick={() => openSignIn()} className="hover:opacity-75"><img src={userIcon} alt="Ícone de Usuário" className="w-8 h-8" /></button>
              )}
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl text-gray-800">
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden bg-white px-4 pb-4 border-t border-gray-200">
          <nav>
            <ul className="flex flex-col items-start gap-4 pt-4">
              <li><Link to="/home" onClick={closeMenu} className={location.pathname === '/home' ? 'font-bold text-gray-900' : 'text-gray-700'}>Home</Link></li>
              <li><Link to="/products_page" onClick={closeMenu} className={location.pathname.startsWith('/products_page') ? 'font-bold text-gray-900' : 'text-gray-700'}>Shop</Link></li>
              <li><a href="#" onClick={closeMenu} className="text-gray-700">Contact Us</a></li>
              <li><Link to="#" onClick={closeMenu} className="text-gray-700">Blog</Link></li>
            </ul>
          </nav>
          <div className="flex items-center gap-6 mt-6">
            <button className="hover:opacity-75 relative" onClick={() => { handleCartClick(); closeMenu(); }}>
              <img src={cartIcon} alt="Ícone do Carrinho" className="w-8 h-8" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white rounded-full text-xs px-2 py-0.5 font-bold">{cartCount}</span>
              )}
            </button>
            {user ? (
              <button onClick={() => { signOut(); closeMenu(); }} className="hover:opacity-75"><img src={userIcon} alt="Ícone de Usuário" className="w-8 h-8" /></button>
            ) : (
              <button onClick={() => { openSignIn(); closeMenu(); }} className="hover:opacity-75"><img src={userIcon} alt="Ícone de Usuário" className="w-8 h-8" /></button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;