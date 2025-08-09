import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiX, FiTrash2 } from 'react-icons/fi';

const CartSidebar = () => {
  const {
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const toggleCart = () => setIsOpen(!isOpen);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      alert('Compra realizada con éxito!');
      clearCart();
      setIsCheckingOut(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={toggleCart}
        className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg z-50"
      >
        <FiShoppingCart size={24} />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white h-full flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold">
                  Tu pedido ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                </h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Tu pedido está vacío
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 py-4 border-b">
                      <img 
                        //src={item.image} 
                        src={"https://backmars2025-production.up.railway.app/images/"+item.sku+".jpg" || 'https://backmars2025-production.up.railway.app/images/esqueleto.jpg'} 
                        alt={item.title} 
                        className="w-20 h-20 object-cover rounded"
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="font-bold text-gray-800">${item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                          
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 p-1 rounded hover:bg-gray-100"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-4 border-t">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className={`w-full py-3 px-4 rounded font-bold mb-2 ${
                      isCheckingOut ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                    } text-white transition-colors`}
                  >
                    {isCheckingOut ? 'Procesando...' : 'Finalizar Compra'}
                  </button>
                  
                  <button 
                    onClick={clearCart}
                    className="w-full py-2 px-4 rounded border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Vaciar pedido
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;
