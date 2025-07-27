import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/Product/ProductCard';
//import { productsData } from '../data/products';
import { useEffect, useState } from 'react';
import config from '../config';


const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [onSaleProducts, setOnSaleProducts] = useState([]);

  const fetchNovedades = async () => {
    try {
      //const res = await fetch('http://192.168.1.132:4000/api/novedades');
      const res = await fetch(config.novedadesApi);
      const data = await res.json();
      //console.log("fetchNovedades")
      //console.log(data)
      setFeaturedProducts(data);
    } catch (err) {
      console.error('Error al obtener novedades:', err);
    }
  };

  const fetchOfertas = async () => {
    try {
      //const res = await fetch('http://192.168.1.132:4000/api/ofertas');
      const res = await fetch(config.ofertasApi);
      const data = await res.json();
      setOnSaleProducts(data);
      //console.log("fetchOfertas")
      //console.log(data)
    } catch (err) {
      console.error('Error al obtener ofertas:', err);
    }
  };
  useEffect(() => {
    fetchNovedades();
    fetchOfertas();
  }, []);
  // console.log(featuredProducts)
  // console.log(onSaleProducts)
  // const featuredProducts = productsData.slice(0, 4);
  // const onSaleProducts = productsData
    // .filter(product => parseFloat(product.precio_especial) > 0 && product.precio_especial !== "0.00")
    // .slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white px-8"
        style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('./images3.jpg')" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-slate-30">Bienvenido a Tiendas MARS</h1>
          <h2 className="text-xl md:text-2xl mb-8 font-normal">
            Los mejores productos al mejor precio
          </h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/catalog" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded text-lg transition-colors"
            >
              Catalogo completo
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl text-center text-gray-800 mb-12">Novedades</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link 
          to="/catalog" 
          className="block text-center text-blue-500 font-bold mt-8 hover:underline"
        >
          Ver todos los productos →
        </Link>
      </section>

      {/* Promo Section */}
      <section className="bg-blue-500 text-white py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ofertas especiales</h2>
          <p className="text-xl mb-8">
            Aprovecha nuestras ofertas exclusivas por tiempo limitado
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/catalog" 
              className="inline-block bg-white text-blue-500 font-bold py-4 px-8 rounded text-lg"
            >
              Ver ofertas
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* On Sale Products */}
      {onSaleProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl text-center text-gray-800 mb-12">Productos en oferta</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {onSaleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Link 
            to="/catalog" 
            className="block text-center text-blue-500 font-bold mt-8 hover:underline"
          >
            Ver todas las ofertas →
          </Link>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 p-8 rounded-lg shadow-sm text-center"
        >
          <div className="text-4xl mb-4">🚚</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Envío rápido</h3>
          <p className="text-gray-600">
            Recibe tus productos en 24-48 horas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-50 p-8 rounded-lg shadow-sm text-center"
        >
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Pago seguro</h3>
          <p className="text-gray-600">
            Tus datos siempre protegidos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-50 p-8 rounded-lg shadow-sm text-center"
        >
          <div className="text-4xl mb-4">🔄</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Devoluciones fáciles</h3>
          <p className="text-gray-600">
            30 días para cambiar de opinión
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;
