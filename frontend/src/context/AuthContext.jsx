import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ background: '#FFF8F0', minHeight: '100vh' }}>
            <Navbar />
            <Routes>
              <Route path="/"         element={<Home />}     />
              <Route path="/menu"     element={<Menu />}     />
              <Route path="/cart"     element={<Cart />}     />
              <Route path="/login"    element={<Login />}    />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App