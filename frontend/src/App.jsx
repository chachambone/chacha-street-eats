import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
        <Navbar />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/menu"     element={<Menu />} />
          <Route path="/cart"     element={<Cart />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App