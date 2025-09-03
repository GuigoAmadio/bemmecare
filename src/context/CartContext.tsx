"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Cart, CartItem, CartActions, Product, ProductVariant } from "@/types";

interface CartContextType extends CartActions {
  cart: Cart;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART"; payload: Cart }
  | {
      type: "ADD_ITEM";
      payload: {
        product: Product;
        quantity: number;
        variants?: Record<string, ProductVariant>;
      };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" };

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  discount: 0,
  total: 0,
  itemCount: 0,
  weight: 0,
  updatedAt: new Date(),
};

const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const weight = items.reduce(
    (sum, item) => sum + (item.product.weight || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total, itemCount, weight, discount: 0 };
};

function cartReducer(
  state: { cart: Cart; isLoading: boolean },
  action: CartAction
) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existingIndex = state.cart.items.findIndex(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.cart.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          addedAt: new Date(),
        };
        newItems = [...state.cart.items, newItem];
      }

      const totals = calculateCartTotals(newItems);
      return {
        ...state,
        cart: {
          ...state.cart,
          items: newItems,
          ...totals,
          updatedAt: new Date(),
        },
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.cart.items.filter(
        (item) => item.id !== action.payload
      );
      const totals = calculateCartTotals(newItems);
      return {
        ...state,
        cart: {
          ...state.cart,
          items: newItems,
          ...totals,
          updatedAt: new Date(),
        },
      };
    }

    case "CLEAR_CART":
      return { ...state, cart: { ...initialCart, updatedAt: new Date() } };

    default:
      return state;
  }
}

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: initialCart,
    isLoading: false,
  });

  const addItem = (product: Product, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      // TODO: Implement update quantity
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    return false; // TODO: Implement
  };

  const removeCoupon = () => {
    // TODO: Implement
  };

  const calculateShipping = async (address: any) => {
    return []; // TODO: Implement
  };

  const value: CartContextType = {
    cart: state.cart,
    isLoading: state.isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    calculateShipping,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
