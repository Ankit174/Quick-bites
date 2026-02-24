import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ChatbotProvider } from './context/ChatbotContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Cart from './pages/Cart';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from 'react-hot-toast';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ChatbotProvider>
          <Router>
            <Toaster position="bottom-right" />
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/staff" element={<StaffDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
              <Chatbot />
            </div>
          </Router>
        </ChatbotProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
