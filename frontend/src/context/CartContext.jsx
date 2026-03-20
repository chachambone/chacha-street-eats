import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  // Add item to cart
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  // Remove item completely
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  // Increase or decrease quantity
  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(i =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    )
  }

  // Clear entire cart
  const clearCart = () => setCart([])

  // Total price
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  // Total item count (for badge)
  const count = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      total,
      count,
    }}>
      {children}
    </CartContext.Provider>
  )
}