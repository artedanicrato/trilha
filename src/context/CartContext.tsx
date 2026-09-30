import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product, CustomizationData, DeliveryDetails } from '../types';

interface CartContextType {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: Product, quantity?: number, options?: { customization?: CustomizationData; selectedColor?: string; selectedSize?: string }) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryOption: DeliveryOption;
  setDeliveryOption: (opt: DeliveryOption) => void;
  shippingFee: number;
  pixDiscount: number;
  totalWithPix: number;
  totalRegular: number;
}

export interface DeliveryOption {
  id: 'RETIRADA_BALCAO' | 'CRATO_LOCAL' | 'JUAZEIRO_LOCAL' | 'BARBALHA_LOCAL' | 'CORREIOS_SEDEX';
  title: string;
  subtitle: string;
  price: number;
  estimated: string;
  type: DeliveryDetails['type'];
  city: string;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'RETIRADA_BALCAO',
    title: 'Retirada no Balcão (Grátis)',
    subtitle: 'Rua Dr. João Pessoa, 91 · Centro · Crato - CE',
    price: 0,
    estimated: 'Disponível em até 24h na loja',
    type: 'RETIRADA_BALCAO',
    city: 'Crato',
  },
  {
    id: 'CRATO_LOCAL',
    title: 'Entrega Expressa Crato (Bairros)',
    subtitle: 'Motoboy rápido para todos os bairros do Crato',
    price: 7.00,
    estimated: 'Entrega no mesmo dia útil',
    type: 'ENTREGA_LOCAL_CARIRI',
    city: 'Crato',
  },
  {
    id: 'JUAZEIRO_LOCAL',
    title: 'Entrega Juazeiro do Norte',
    subtitle: 'Motoboy expresso para Juazeiro do Norte',
    price: 12.00,
    estimated: 'Entrega em até 24h úteis',
    type: 'ENTREGA_LOCAL_CARIRI',
    city: 'Juazeiro do Norte',
  },
  {
    id: 'BARBALHA_LOCAL',
    title: 'Entrega Barbalha',
    subtitle: 'Envio local para a cidade de Barbalha',
    price: 15.00,
    estimated: 'Entrega em até 24h úteis',
    type: 'ENTREGA_LOCAL_CARIRI',
    city: 'Barbalha',
  },
  {
    id: 'CORREIOS_SEDEX',
    title: 'Correios SEDEX (Interior CE / Brasil)',
    subtitle: 'Com código de rastreamento oficial',
    price: 26.00,
    estimated: '2 a 4 dias úteis',
    type: 'CORREIOS_SEDEX',
    city: 'Outra Cidade',
  },
];

const CART_STORAGE_KEY = 'trilha_sonora_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(DELIVERY_OPTIONS[0]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addItem = (
    product: Product,
    quantity: number = 1,
    options?: { customization?: CustomizationData; selectedColor?: string; selectedSize?: string }
  ) => {
    setItems(prev => {
      // If customizable, treat as new item to preserve unique artwork
      if (product.customizable && options?.customization?.text) {
        const newItem: CartItem = {
          product,
          quantity,
          customization: options.customization,
          selectedColor: options.selectedColor,
          selectedSize: options.selectedSize,
          unitPrice: product.price,
          totalPrice: product.price * quantity,
        };
        return [...prev, newItem];
      }

      // Check if existing exact item
      const existingIdx = prev.findIndex(
        it =>
          it.product.id === product.id &&
          it.selectedColor === options?.selectedColor &&
          it.selectedSize === options?.selectedSize
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx].quantity = newQty;
        updated[existingIdx].totalPrice = updated[existingIdx].unitPrice * newQty;
        return updated;
      }

      const newItem: CartItem = {
        product,
        quantity,
        customization: options?.customization,
        selectedColor: options?.selectedColor,
        selectedSize: options?.selectedSize,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
      };
      return [...prev, newItem];
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    setItems(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].quantity = quantity;
        updated[index].totalPrice = updated[index].unitPrice * quantity;
      }
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Free local shipping in Crato if subtotal > R$ 150
  const isFreeLocalShipping = subtotal >= 150 && (deliveryOption.id === 'CRATO_LOCAL');
  const shippingFee = isFreeLocalShipping ? 0 : deliveryOption.price;

  const pixDiscount = Number((subtotal * 0.05).toFixed(2));
  const totalRegular = Number((subtotal + shippingFee).toFixed(2));
  const totalWithPix = Number(Math.max(0, subtotal - pixDiscount + shippingFee).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        deliveryOption,
        setDeliveryOption,
        shippingFee,
        pixDiscount,
        totalWithPix,
        totalRegular,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
};
