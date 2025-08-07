import { useEffect, useState, useCallback, useRef } from 'react';
import ProductCard from '../components/Product/ProductCard';
import FilterSidebar from '../components/Product/FilterSidebar';
import { Spin, Alert } from 'antd';
import config from '../config';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 150000],
    searchQuery: '',
    productTypes: [],
    sortBy: ''
  });

  console.log(products);

  const productsPerPage = 12;
  //const API_URL = 'http://192.168.1.132:4000/api/productos/paginated';
  const API_URL = config.paginatedApi;
  const searchTimeoutRef = useRef(null);

  const fetchProducts = async (pageNumber = 1, filters = {}) => {
    //console.log(fetchProducts)
    try {
      const queryParams = new URLSearchParams({
        page: pageNumber,
        limit: productsPerPage,
        ...(filters.searchQuery && { search: filters.searchQuery }),
        ...(filters.category && { category: filters.category }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        min_price: filters.priceRange[0],
        max_price: filters.priceRange[1],
        ...(filters.productTypes.length > 0 && { productTypes: filters.productTypes.join(',') })
      });
      //console.log(queryParams)
      //console.log(filters)
      const response = await fetch(`${API_URL}?${queryParams}`);
      
      if (!response.ok) throw new Error('Error al cargar productos');
      
      const data = await response.json();
      //console.log(data)
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const fetchCategorias = async () => {
    try {
      //const res = await fetch('http://192.168.1.132:4000/api/categorias');
      const res = await fetch(config.categoriasApi);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error al obtener categorías:', err);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Cargar productos con debounce para búsqueda
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setLoading(true);
    setError(null);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const data = await fetchProducts(1, filters);
        setProducts(data.data || []);
        setTotalProducts(data.pagination?.totalItems || 0);
        setHasMore(data.pagination?.hasNextPage || false);
        setPage(1);        
      } catch (err) {
        setError(err.message || 'Error al cargar productos');
      } finally {
        setLoading(false);
      }
    }, filters.searchQuery ? 500 : 0);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters]);

  const loadMoreProducts = useCallback(async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchProducts(nextPage, filters);
      
      setProducts(prev => [...prev, ...(data.data || [])]);
      setHasMore(data.pagination?.hasNextPage || false);
      setPage(nextPage);
      setTotalProducts(data.pagination?.totalItems || totalProducts);
    } catch (error) {
      setError(error.message || 'Error al cargar más productos');
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore, filters, totalProducts]);

  // Scroll infinito optimizado
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 500 && 
        !loading && 
        !loadingMore &&
        hasMore
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, loadingMore, hasMore, loadMoreProducts]);

  // const handleSearchChange = (e) => {
  //   setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  // };

  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setFilters(prev => ({ ...prev, searchQuery: searchInput }));
    }
  };


  if (loading && page === 1) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Spin size="large" tip="Cargando productos..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          className="mb-6"
        />
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar 
          // categories={[...new Set(products.map(p => p.categoria))]} 
          categories={categories}
          filters={filters}
          setFilters={setFilters}
        />
        
        <div className="flex-1">
          <div className="mb-6">
            {/* <input
              type="text"
              placeholder="Buscar productos por nombre, SKU o código de barras..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Buscar productos por nombre, SKU o código de barras..."
              className="text-gray-600 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {products.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">
                Mostrando {products.length} de {totalProducts} productos
              </span>
              <span className="text-sm text-gray-500">
                Página {page} de {Math.ceil(totalProducts / productsPerPage)}
              </span>
            </div>
          )}

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductCard 
                    key={`${product.id}_${product.sku}_${index}`}
                    product={product} 
                  />
                ))}
              </div>
              
              {loadingMore && (
                <div className="flex justify-center my-8">
                  <Spin tip="Cargando más productos..." />
                </div>
              )}
              
              {!hasMore && totalProducts > 0 && (
                <div className="text-center text-gray-500 my-8">
                  Has visto todos los {totalProducts} productos
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              {loading ? (
                <Spin tip="Cargando..." />
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-500">
                    Intenta ajustar tus filtros de búsqueda
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
