import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, Image } from 'antd';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getProductType = () => {
    switch(product.estatus) {
      case 1: // Nuevo
        return { text: 'Novedades', color: 'bg-blue-500' };
      case 2: // Oferta
        return { text: 'Oferta', color: 'bg-green-500' };
      case 3: // Liquidacion
        return { text: 'Liquidacion', color: 'bg-yellow-500' };
      default:
        return null;
    }
  };

  const productType = getProductType();
  const productImage = "https://backmars2025-production.up.railway.app/images/"+product.sku+".jpg" || 'https://backmars2025-production.up.railway.app/images/esqueleto.jpg';

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:-translate-y-1 transition-transform relative"
      >
        {/* Badge de tipo de producto */}
        {productType && (
          <div className={`absolute top-2 right-2 ${productType.color} text-white text-xs font-bold px-2 py-1 rounded-full z-10`}>
            {productType.text}
          </div>
        )}

        <div onClick={showModal} className="cursor-pointer">
          <img 
            src={productImage}
            alt={product.titulo}
            className="w-[90%] h-48 object-cover m-4"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://backmars2025-production.up.railway.app/images/esqueleto.jpg'; }}
          />
        </div>
        
        <div className="p-4">
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-2">
            {product.categoria}
          </span>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.titulo}</h3>
          <p className="text-xs text-gray-500 mb-1">SKU: {product.id}</p>
          
          {product.precio_especial && product.precio_especial !== "0.00" ? (
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-gray-900">${product.precio_mayorista}</p>
              <p className="text-sm text-gray-500 line-through">${product.precio_mayorista}</p>
            </div>
          ) : (
            <p className="text-xl font-bold text-gray-900">${product.precio_mayorista}</p>
          )}
          
          <p className={`mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-600 font-bold'}`}>
            {product.stock > 0 ? `Disponible: ${product.stock}` : 'Sin Stock'}
          </p>
          
          {product.stock > 0 && (
            <div className="space-y-2">
              <div className="text-gray-600 flex items-center justify-between border border-gray-200 rounded px-2 py-1">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="bg-gray-100 px-2 py-1 rounded disabled:opacity-50"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  disabled={quantity >= product.stock}
                  className="bg-gray-100 px-2 py-1 rounded disabled:opacity-50"
                >
                  +
                </button>
              </div>
              
              <motion.button 
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Añadir al pedido
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      <Modal 
        open={isModalOpen} 
        onCancel={handleCancel} 
        footer={null}
        centered
        width="auto"
        className="image-modal"
      >
        <Image
          src={productImage}
          alt={product.titulo}
          style={{ maxHeight: '80vh', maxWidth: '100%' }}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://backmars2025-production.up.railway.app/images/esqueleto.jpg'; }}
          preview={{
            visible: false, // Desactivamos el preview interno de Antd ya que estamos usando nuestro propio modal
          }}
        />
      </Modal>
    </>
  );
};

export default ProductCard;
