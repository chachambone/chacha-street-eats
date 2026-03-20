import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ background: '#FFF8F0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/"          element={<Home />}     />
                <Route path="/menu"      element={<Menu />}     />
                <Route path="/cart"      element={<Cart />}     />
                <Route path="/checkout"  element={<Checkout />} />
                <Route path="/login"     element={<Login />}    />
                <Route path="/register"  element={<Register />} />
                <Route path="/about"     element={<AboutUs />}  />
                <Route path="/contact"   element={<Contact />}  />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App