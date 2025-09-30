import { useState, useEffect } from 'react';
import { Slider, Checkbox, Radio, Collapse, Badge } from 'antd';
import { FiFilter, FiX, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import 'antd/dist/reset.css';

const { Panel } = Collapse;

const FilterSidebar = ({ categories, filters, setFilters }) => {
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [hideOutOfStock, setHideOutOfStock] = useState(true); // Nuevo estado para ocultar sin stock

  const productTypes = [
    { value: 1, label: 'Novedades', color: 'bg-blue-500' },
    { value: 2, label: 'Oferta', color: 'bg-green-500' },
    { value: 3, label: 'Liquidacion', color: 'bg-yellow-500' },
    // { value: 4, label: 'Agotado', color: 'bg-red-500' }
  ];

  const filteredCategories = categories.filter(category => 
    category?.toLowerCase().includes(categorySearch?.toLowerCase())
  );

  useEffect(() => {
    if (filters.priceRange) setPriceRange(filters.priceRange);
    if (filters.category) {
      setSelectedCategories(filters.category ? filters.category.split(',') : []);
    }
    if (filters.productTypes) setSelectedTypes(filters.productTypes);
    // Inicializar el filtro de stock desde los filtros existentes
    if (filters.hideOutOfStock !== undefined) {
      setHideOutOfStock(filters.hideOutOfStock);
    }
  }, [filters]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setFilters({ ...filters, priceRange: value });
  };

  const handleCategoryChange = (category, isChecked) => {
    let newCategories;
    
    if (isChecked) {
      //newCategories = [...selectedCategories, category];
      newCategories = [category];
    } else {
      newCategories = selectedCategories.filter(c => c !== category);
    }

    setSelectedCategories(newCategories);
    setFilters({ 
      ...filters, 
      category: newCategories.join(',') 
    });
  };

  const handleTypeChange = (typeValue) => {
    const newTypes = selectedTypes.includes(typeValue)
      ? selectedTypes.filter(t => t !== typeValue)
      : [...selectedTypes, typeValue];
    
    setSelectedTypes(newTypes);
    setFilters({ ...filters, productTypes: newTypes });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sortBy: e.target.value });
  };

  // Nuevo manejador para el filtro de stock
  const handleStockFilterChange = (e) => {
    const shouldHideOutOfStock = e.target.checked;
    setHideOutOfStock(shouldHideOutOfStock);
    setFilters({ ...filters, hideOutOfStock: shouldHideOutOfStock });
  };

  const resetFilters = () => {
    setPriceRange([0, 150000]);
    setSelectedCategories([]);
    setSelectedTypes([]);
    setCategorySearch('');
    setHideOutOfStock(true); // Resetear a true por defecto
    setFilters({
      searchQuery: '',
      category: '',
      priceRange: [0, 150000],
      productTypes: [],
      sortBy: '',
      hideOutOfStock: true // Incluir en el reset
    });
  };

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  const activeFilterCount = selectedCategories.length + selectedTypes.length + 
    (filters.sortBy ? 1 : 0) + 
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 150000 ? 1 : 0) +
    (!hideOutOfStock ? 1 : 0); // Contar el filtro de stock cuando está desactivado

  return (
    <>
      <button 
        onClick={toggleMobileFilters}
        className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center z-30 transition-colors"
      >
        <FiFilter className="mr-2" />
        Filtros
        {activeFilterCount > 0 && (
          <Badge count={activeFilterCount} className="ml-2" />
        )}
      </button>

      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileFilters}
        />
      )}

      <div className={`
        ${isMobileFiltersOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'}
        md:block md:relative md:inset-auto
        w-4/5 sm:w-2/3 md:w-72 p-4 bg-white md:bg-gray-50 
        overflow-y-auto shadow-lg md:shadow-none transition-all duration-300
      `}>
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
          <button 
            onClick={toggleMobileFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Filtrar por</h3>
            <button 
              onClick={resetFilters}
              className="text-blue-500 text-sm hover:underline"
            >
              Limpiar todo
            </button>
          </div>
        </div>

        <Collapse 
          bordered={false} 
          defaultActiveKey={['1', '2', '3', '4', '5']} // Agregar '5' para el nuevo panel
          expandIcon={({ isActive }) => isActive ? <FiChevronUp /> : <FiChevronDown />}
          className="bg-transparent"
        >
          {/* Nuevo panel para el filtro de stock */}
          <Panel header="Disponibilidad" key="1" className="border-b border-gray-200">
            <div className="space-y-2">
              <Checkbox
                checked={hideOutOfStock}
                onChange={handleStockFilterChange}
                className="ant-checkbox-wrapper"
              >
                <span className={`${hideOutOfStock ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                  Ocultar productos sin stock
                </span>
              </Checkbox>
            </div>
          </Panel>

          <Panel header="Tipo de producto" key="2" className="border-b border-gray-200">
            <ul className="space-y-2">
              {productTypes.map(type => (
                <li key={type.value} className="flex items-center">
                  <Checkbox
                    checked={selectedTypes.includes(type.value)}
                    onChange={() => handleTypeChange(type.value)}
                    className="ant-checkbox-wrapper"
                  >
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full ${type.color} mr-2`} />
                      <span className={`${selectedTypes.includes(type.value) ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                        {type.label}
                      </span>
                    </div>
                  </Checkbox>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel header={`Categorías ${selectedCategories.length > 0 ? `(${selectedCategories.length})` : ''}`} key="3" className="border-b border-gray-200">
            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <li key={category} className="flex items-center">
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={(e) => handleCategoryChange(category, e.target.checked)}
                      className={`ant-checkbox-wrapper ${selectedCategories.includes(category) ? 'font-medium' : ''}`}
                    >
                      <span className={`${selectedCategories.includes(category) ? 'text-blue-600' : 'text-gray-600'}`}>
                        {category}
                      </span>
                    </Checkbox>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm py-1">No se encontraron categorías</li>
              )}
            </ul>
          </Panel>

          <Panel header="Rango de precios" key="4" className="border-b border-gray-200">
            <div className="px-2">
              <Slider
                range
                min={0}
                max={150000}
                step={100}
                value={priceRange}
                onChange={handlePriceChange}
                tipFormatter={value => `$${value.toLocaleString()}`}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </Panel>

          <Panel header="Ordenar por" key="5">
            <Radio.Group 
              onChange={handleSortChange} 
              value={filters.sortBy}
              className="flex flex-col space-y-2"
            >
              <Radio value="" className="ant-radio-wrapper">
                <span className="text-gray-600">Predeterminado</span>
              </Radio>
              <Radio value="price-asc" className="ant-radio-wrapper">
                <span className="text-gray-600">Precio: Menor a mayor</span>
              </Radio>
              <Radio value="price-desc" className="ant-radio-wrapper">
                <span className="text-gray-600">Precio: Mayor a menor</span>
              </Radio>
              <Radio value="name-asc" className="ant-radio-wrapper">
                <span className="text-gray-600">Nombre: A-Z</span>
              </Radio>
              <Radio value="name-desc" className="ant-radio-wrapper">
                <span className="text-gray-600">Nombre: Z-A</span>
              </Radio>
            </Radio.Group>
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default FilterSidebar;
