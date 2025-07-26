import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiUser } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-xl font-bold"
        >
          <Link to="/">Tiendas MARS</Link>
        </motion.div>

        <div className="hidden md:flex gap-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `relative py-2 ${isActive ? 'text-blue-400' : 'text-white'}`
            }
          >
            Inicio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
          </NavLink>
          <NavLink 
            to="/catalog" 
            className={({ isActive }) => 
              `relative py-2 ${isActive ? 'text-blue-400' : 'text-white'}`
            }
          >
            Catálogo
          </NavLink>
          {/* <NavLink 
            to="/about" 
            className={({ isActive }) => 
              `relative py-2 ${isActive ? 'text-blue-400' : 'text-white'}`
            }
          >
            Nosotros
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              `relative py-2 ${isActive ? 'text-blue-400' : 'text-white'}`
            }
          >
            Contacto
          </NavLink> */}
        </div>

        <div className="flex items-center gap-6">
          {/* <motion.button 
            whileHover={{ scale: 1.1 }}
            className="text-white p-2"
          >
            <FiSearch size={20} />
          </motion.button> */}
          
          {/* <Link to="/account" className="text-white">
            <FiUser size={20} />
          </Link> */}
          
          <Link to="/cart" className="relative text-white">
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;