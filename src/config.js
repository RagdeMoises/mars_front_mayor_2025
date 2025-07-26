const baseURL = 'http://192.168.1.132:4000/api';

const config = {
  novedadesApi: `${baseURL}/novedades`,
  ofertasApi: `${baseURL}/ofertas`,
  paginatedApi: `${baseURL}/productos/paginated`,
  categoriasApi: `${baseURL}/categorias`,
  sendcartApi:`${baseURL}/send-cart`
};

export default config;
