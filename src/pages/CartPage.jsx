import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiX, FiMessageCircle } from 'react-icons/fi';
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
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [observations, setObservations] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [checkoutMethod, setCheckoutMethod] = useState(''); // 'email' o 'whatsapp'
  const [whatsappError, setWhatsappError] = useState(''); // Nuevo estado para errores de WhatsApp

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
      ['TOTAL:', `$${cartTotal.toFixed(2)}`],
      ['Cliente:', clientName],
      ['Teléfono:', clientPhone],
      ['Observaciones:', observations]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summary);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen");
    
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  };

  const handleProceedToCheckout = () => {
    setIsModalOpen(true);
    setSuccessMessage('');
    setCheckoutMethod(''); // Resetear método
    setWhatsappError(''); // Limpiar errores
  };

  const handleWhatsAppCheckout = () => {
    // Validar que el nombre del cliente esté completo
    if (!clientName || clientName.trim().length < 2) {
      setWhatsappError('Por favor ingrese su nombre completo');
      return;
    }

    setWhatsappError('');

    // Formatear el mensaje de WhatsApp de manera más profesional
    const itemsText = cartItems.map(item => 
      `🛒 *${item.title}*\n` +
      `   ► SKU: ${item.sku}\n` +
      `   Precio: $${item.price.toFixed(2)}\n` +
      `   Cantidad: ${item.quantity}\n` +
      `   Subtotal: $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n\n');

    const message = 
      `🎯 *NUEVO PEDIDO - TIENDAS MARS*\n\n` +
      `📋 *DETALLE DEL PEDIDO:*\n\n${itemsText}\n\n` +
      `💵 *TOTAL DEL PEDIDO: $${cartTotal.toFixed(2)}*\n\n` +
      `👤 *INFORMACIÓN DEL CLIENTE:*\n` +
      `   • *Nombre:* ${clientName}\n` +
      `${clientPhone ? `   • *Teléfono:* ${clientPhone}\n` : ''}` +
      `${observations ? `   • *Observaciones:* ${observations}` : ''}\n\n` +
      `🕒 *FECHA: ${new Date().toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}*\n\n` +
      `📞 *Para confirmar este pedido, por favor responda a este mensaje.*\n` +
      `¡Gracias! `;

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Número de WhatsApp de la tienda
    const whatsappNumber = '5491133269355'; // Número de Tiendas MARS
    
    // Crear enlace de WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
    
    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Por favor ingrese un correo electrónico válido');
      return;
    }
    
    setEmailError('');
    setIsLoading(true);
    
    try {
      const response = await fetch(config.sendcartApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          clientName,
          clientPhone,
          observations,
          cartItems: cartItems.map(item => ({
            Producto: item.title,
            SKU: item.sku,
            Precio: item.price,
            Cantidad: item.quantity,
            Subtotal: (item.price * item.quantity).toFixed(2)
          }))
        }),
      });

      if (response.ok) {
        alert('Pedido enviado correctamente a tu correo');
        setIsModalOpen(false);
        setEmail('');
        setClientName('');
        setClientPhone('');
        setObservations('');
        clearCart();
      } else {
        throw new Error('Error al enviar el pedido');
      }
    } catch (error) {
      console.error(error);
      setEmailError('Error al enviar el pedido. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
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
        contentLabel="Confirmación de pedido"
        shouldCloseOnOverlayClick={!isLoading}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Confirmación de Pedido</h2>
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
          <>
            {/* Selección de método de envío */}
            {!checkoutMethod && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">¿Cómo prefieres enviar tu pedido?</h3>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => setCheckoutMethod('email')}
                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-gray-800">Enviar por correo electrónico</h4>
                      <p className="text-sm text-gray-600">Recibirás un archivo Excel con tu pedido</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setCheckoutMethod('whatsapp')}
                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                  >
                    <FiMessageCircle className="text-green-500 text-xl mr-3" />
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-gray-800">Enviar por WhatsApp</h4>
                      <p className="text-sm text-gray-600">Enviar pedido directamente por WhatsApp</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Formulario para Email */}
            {checkoutMethod === 'email' && (
              <form onSubmit={handleSubmitEmail}>
                <div className="mb-4">
                  <label htmlFor="email1" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico de la tienda
                  </label>
                  <input
                    type="email"
                    id="email1"
                    value="coop.mars@outlook.com"
                    className="text-blue-600 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="tucorreo@ejemplo.com"
                    disabled={true}
                  />

                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                    Ingrese su Correo electrónico (Cliente)*
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="tucorreo@ejemplo.com"
                    required
                    disabled={isLoading}
                  />
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                    Nombre del cliente (opcional)
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre completo"
                    disabled={isLoading}
                  />

                  <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                    Teléfono/Celular (opcional)
                  </label>
                  <input
                    type="tel"
                    id="clientPhone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Número de contacto"
                    disabled={isLoading}
                  />

                  <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                    Observaciones (opcional)
                  </label>
                  <textarea
                    id="observations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Alguna observación sobre el pedido"
                    rows="3"
                    disabled={isLoading}
                  />
                </div>
                
                <p className="text-sm text-gray-500 mb-6">
                  * Campos obligatorios
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutMethod('')}
                    className="text-gray-600 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    Atrás
                  </button>
                  {!isLoading && (
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-600 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enviando...' : 'Confirmar Pedido'}
                  </button>
                </div>
              </form>
            )}

            {/* Formulario para WhatsApp - Nombre obligatorio */}
            {checkoutMethod === 'whatsapp' && (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <FiMessageCircle className="text-green-500 text-xl mr-3" />
                    <div>
                      <h4 className="font-medium text-green-800">Enviar por WhatsApp</h4>
                      <p className="text-sm text-green-600">
                        Tu pedido se enviará directamente por WhatsApp. Ingresa tu nombre para identificarte.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="whatsappClientName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del cliente *
                  </label>
                  <input
                    type="text"
                    id="whatsappClientName"
                    value={clientName}
                    onChange={(e) => {
                      setClientName(e.target.value);
                      setWhatsappError(''); // Limpiar error al escribir
                    }}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                  {whatsappError && <p className="text-red-500 text-sm mt-1">{whatsappError}</p>}
                </div>

                {/* <div className="mb-4">
                  <label htmlFor="whatsappClientPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono/Celular (opcional)
                  </label>
                  <input
                    type="tel"
                    id="whatsappClientPhone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Número de contacto"
                  />
                </div> */}

                {/* <div className="mb-6">
                  <label htmlFor="whatsappObservations" className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones (opcional)
                  </label>
                  <textarea
                    id="whatsappObservations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Alguna observación sobre el pedido..."
                    rows="3"
                  />
                </div> */}
                
                <p className="text-sm text-gray-500 mb-6">
                  * Campo obligatorio
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutMethod('')}
                    className="text-gray-600 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-600 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center"
                  >
                    <FiMessageCircle className="mr-2" />
                    Enviar por WhatsApp
                  </button>
                </div>
              </div>
            )}
          </>
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
                src={`https://backmars2025-production.up.railway.app/images/${item.sku}.jpg` || 'https://backmars2025-production.up.railway.app/images/esqueleto.jpg'} 
                alt={item.title}
                className="w-full sm:w-32 h-32 object-contain bg-gray-100 rounded-lg mb-4 sm:mb-0"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://backmars2025-production.up.railway.app/images/esqueleto.jpg'; }}
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
          
          <div className="border-t border-gray-200 my-4"></div>
          
          <div className="text-gray-600 flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleProceedToCheckout}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg mb-3 transition-colors flex items-center justify-center"
          >
            <FiShoppingCart className="mr-2" />
            Proceder con el pedido
          </button>

          <button 
            onClick={() => {
              setCheckoutMethod('whatsapp');
              setIsModalOpen(true);
              setClientName(''); // Limpiar nombre anterior
              setClientPhone(''); // Limpiar teléfono anterior
              setObservations(''); // Limpiar observaciones anteriores
              setWhatsappError(''); // Limpiar errores
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg mb-3 transition-colors flex items-center justify-center"
          >
            <FiMessageCircle className="mr-2" />
            Enviar por WhatsApp
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
