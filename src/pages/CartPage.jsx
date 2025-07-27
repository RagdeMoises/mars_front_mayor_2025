import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiX } from 'react-icons/fi';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import Modal from 'react-modal';
import config from '../config';

const CartPage = () => {
  const { 
    cartItems, 
    cartTotal, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();

  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Configuración del modal
  Modal.setAppElement('#root');

  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      cartItems.map(item => ({
        'Producto': item.title,
        'SKU': item.sku,
        'Precio unitario': item.price,
        'Cantidad': item.quantity,
        'Subtotal': (item.price * item.quantity).toFixed(2)
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedido");
    
    // Agregar resumen
    const summary = [
      ['TOTAL:', `$${cartTotal.toFixed(2)}`]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summary);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen");
    
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  };

  const handleProceedToCheckout = () => {
    setIsModalOpen(true);
    setSuccessMessage('');
  };

  // const handleSubmitEmail = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setEmailError('');
    
  //   // Validación de email
  //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  //     setEmailError('Por favor ingrese un correo electrónico válido');
  //     setIsLoading(false);
  //     return;
  //   }
    
  //   try {
  //     // Generar el Excel
  //     const excelData = generateExcel();
      
  //     // Simular envío al backend (en producción, harías una llamada real a tu API)
  //     await new Promise(resolve => setTimeout(resolve, 1500));
      
  //     // Crear enlace para descarga (simulación)
  //     const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `Carrito_${new Date().toISOString().slice(0, 10)}.xlsx`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
      
  //     // Mostrar mensaje de éxito
  //     setSuccessMessage(`Se ha enviado el carrito a ${email}`);
      
  //     // Limpiar después de 3 segundos
  //     setTimeout(() => {
  //       setIsModalOpen(false);
  //       setEmail('');
  //       clearCart();
  //       setSuccessMessage('');
  //     }, 3000);
      
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setEmailError('Ocurrió un error al procesar tu solicitud');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmitEmail = async (e) => {
  e.preventDefault();
  
  if (!email.includes('@') || !email.includes('.')) {
    setEmailError('Por favor ingrese un correo electrónico válido');
    return;
  }
  
  setEmailError('');
  
  try {
    // const response = await fetch('http://192.168.1.132:4000/api/send-cart', {
    const response = await fetch(config.sendcartApi, {
    //const response = await fetch('https://api.example.com/send-cart', {      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        cartItems: cartItems.map(item => ({
          Producto: item.title,
          SKU: item.sku,
          Precio: item.price,
          Cantidad: item.quantity,
          Subtotal: (item.price * item.quantity).toFixed(2)
        }))
      }),
    });
    console.log(response);

    if (response.ok) {
      alert('Pedido enviado correctamente a tu correo');
      setIsModalOpen(false);
      setEmail('');
      clearCart();
    } else {
      throw new Error('Error al enviar el pedido');
    }
  } catch (error) {
    console.error(error);
    setEmailError('Error al enviar el pedido. Por favor intente nuevamente.');
  }
};

  // Estilos para el modal
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '500px',
      width: '90%',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FiShoppingCart className="mx-auto text-5xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu pedido está vacío</h2>
          <p className="text-gray-600 mb-6">Aún no has agregado ningún producto a tu pedido</p>
          <Link
            to="/catalog"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => !isLoading && setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Ingrese su correo"
        shouldCloseOnOverlayClick={!isLoading}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Confirmación de compra</h2>
          {!isLoading && (
            <button 
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          )}
        </div>
        
        {successMessage ? (
          <div className="text-center py-6">
            <div className="text-green-500 text-lg font-medium mb-2">
              ¡Gracias por tu compra!
            </div>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitEmail}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="tucorreo@ejemplo.com"
                required
                disabled={isLoading}
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Te enviaremos un resumen de tu compra a este correo electrónico.
            </p>
            
            <div className="flex justify-end space-x-3">
              {!isLoading && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Confirmar compra'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <div className="flex items-center mb-6">
        <Link
          to="/catalog"
          className="flex items-center text-blue-500 hover:text-blue-700 mr-4"
        >
          <FiArrowLeft className="mr-2" />
          Seguir comprando
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Tu pedido ({cartItems.reduce((total, item) => total + item.quantity, 0)})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm divide-y divide-gray-200">
          {cartItems.map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row">
              <img
                src={`https://back-production-8f9a.up.railway.app/images/${item.id}.jpg` || 'https://back-production-8f9a.up.railway.app/images/esqueleto.jpg'} 
                alt={item.title}
                className="w-full sm:w-32 h-32 object-contain bg-gray-100 rounded-lg mb-4 sm:mb-0"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://back-production-8f9a.up.railway.app/images/esqueleto.jpg'; }}
              />
              
              <div className="flex-1 sm:ml-6">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  <p className="text-lg font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                </div>
                
                <p className="text-sm text-gray-500 mt-1">SKU: {item.sku}</p>
                
                <div className="text-gray-600 mt-4 flex items-center">
                  <label htmlFor={`quantity-${item.id}`} className="sr-only">Cantidad</label>
                  <input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-20 px-3 py-1 border border-gray-300 rounded-md text-center"
                  />
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700 flex items-center"
                  >
                    <FiTrash2 className="mr-1" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen del pedido</h2>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-600 font-medium">${cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Envío</span>
            <span className="text-gray-600 font-medium">Gratis</span>
          </div>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          <div className="text-gray-600 flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleProceedToCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg mb-3 transition-colors"
          >
            Proceder con el pedido
          </button>
          
          <button
            onClick={clearCart}
            className="w-full text-red-500 hover:text-red-700 font-medium py-2 px-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
          >
            <FiTrash2 className="mr-2" />
            Vaciar pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
