import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes de páginas
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage'; // Asegúrate de crear este componente

// Componentes de layout
import CartSidebar from './components/Cart/CartSidebar';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

const App = () => {
  return (
    <Router>
      <CartProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow p-4 md:p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} /> {/* Nueva ruta */}
              {/* Agrega aquí otras rutas que necesites */}
            </Routes>
          </main>
          <Footer />
          {/* <CartSidebar /> */}
        </div>
      </CartProvider>
    </Router>
  );
};

export default App;