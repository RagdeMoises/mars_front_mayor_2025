import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_CART':
      return { ...state, items: action.payload };
      
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex !== -1) {
        // Si el producto ya existe, incrementar la cantidad
        return {
          ...state,
          items: state.items.map((item, index) => {
            if (index === existingItemIndex) {
              const newQuantity = item.quantity + action.payload.quantity;
              // Verificar que no exceda el stock disponible
              const finalQuantity = Math.min(newQuantity, item.stock);
              return {
                ...item,
                quantity: finalQuantity
              };
            }
            return item;
          })
        };
      } else {
        // Si el producto no existe, agregarlo al carrito
        return { 
          ...state, 
          items: [...state.items, action.payload] 
        };
      }
      
    case 'REMOVE_ITEM':
      return { 
        ...state, 
        items: state.items.filter(item => item.id !== action.payload) 
      };
      
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { 
                ...item, 
                quantity: Math.min(action.payload.quantity, item.stock) 
              }
            : item
        )
      };
      
    case 'CLEAR_CART':
      return { ...state, items: [] };
      
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Persistencia en localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'INIT_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        sku: product.sku,
        title: product.titulo,
        price: parseFloat(product.precio_mayorista),
        quantity: quantity,
        image: product.image || '/default-product.jpg',
        stock: product.stock
      }
    });
  };

  const value = {
    cartItems: state.items,
    cartTotal: state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
    addToCart,
    removeFromCart: id => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    updateQuantity: (id, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' })
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
