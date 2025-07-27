import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { productsData } from '../data/products';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const foundProduct = productsData.find(p => p.id === parseInt(id));
        
        if (!foundProduct) {
          throw new Error('Producto no encontrado');
        }
        
        const productWithImages = {
          ...foundProduct,
          images: [
            foundProduct.image || '/default-product.jpg',
            '/default-product-2.jpg',
            '/default-product-3.jpg'
          ]
        };
        
        setProduct(productWithImages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Cargando producto...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button 
          onClick={goBack}
          className="flex items-center gap-2 text-blue-500 hover:underline"
        >
          <FiArrowLeft /> Volver al catálogo
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 md:p-8"
    >
      <button 
        onClick={goBack}
        className="flex items-center gap-2 text-blue-500 hover:underline mb-8"
      >
        <FiArrowLeft /> Volver al catálogo
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <motion.img 
            src={product.images[selectedImage]} 
            alt={product.titulo}
            whileHover={{ scale: 1.02 }}
            className="w-full h-96 object-contain bg-gray-100 rounded-lg"
          />
          
          <div className="flex gap-4">
            {product.images.map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt={`${product.titulo} - Vista ${index + 1}`}
                onClick={() => setSelectedImage(index)}
                whileHover={{ scale: 1.05 }}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                  index === selectedImage ? 'border-blue-500 opacity-100' : 'border-transparent opacity-80'
                } hover:opacity-100`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.titulo}</h1>
            <p className="text-gray-500 text-sm mb-2">SKU: {product.sku}</p>
            <p className="text-2xl font-bold text-gray-900 my-3">${product.precio_minorista}</p>
            {product.precio_especial && product.precio_especial !== "0.00" && (
              <p className="text-xl font-bold text-red-500">
                Precio especial: ${product.precio_especial}
              </p>
            )}
          </div>

          <p className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600 font-bold'}`}>
            {product.stock > 0 
              ? `Disponible (${product.stock} unidades)` 
              : 'Producto Sin Stock'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y">
            <div>
              <strong className="text-gray-900">Categoría:</strong> {product.categoria}
            </div>
            <div>
              <strong className="text-gray-900">Proveedor:</strong> {product.proveedor}
            </div>
            <div>
              <strong className="text-gray-900">Ubicación:</strong> {product.ubicacion}
            </div>
          </div>

          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-4 my-6">
                <label className="font-bold text-gray-900">Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value))))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded text-center"
                />
              </div>

              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded w-full transition-colors"
              >
                <FiShoppingCart /> Añadir al pedido
              </motion.button>
            </>
          )}

          <div className="mt-12 pt-6 border-t">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Descripción del producto</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.descripcion || 
                'Este producto no tiene una descripción detallada. Por favor contacta al vendedor para más información.'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
