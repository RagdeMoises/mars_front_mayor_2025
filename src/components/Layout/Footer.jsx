import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl text-blue-400 mb-4">Tiendas MARS</h3>
            <p className="text-gray-300 mb-4">
              Tu destino para encontrar los mejores productos al mejor precio.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/Mars31505/" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://www.instagram.com/tienda_mars_arg/?hl=en" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              {/* <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaLinkedin size={20} />
              </a> */}
            </div>
          </div>

          <div>
            <h3 className="text-xl text-blue-400 mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Inicio</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Productos</a></li>
              {/* <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Ofertas</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Nosotros</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Contacto</a></li> */}
            </ul>
          </div>

          <div>
            <h3 className="text-xl text-blue-400 mb-4">Información</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Política de privacidad</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Términos y condiciones</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Preguntas frecuentes</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Envíos y devoluciones</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl text-blue-400 mb-4">Contacto</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>coop.mars@outlook.com</p>
              <p>+54 911 33269355</p>
              <p>
                Av. Villanueva 1043<br />
                Ing. Maschwitz, Buenos Aires, Argentina
              </p>
            </address>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Tiendas MARS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
