import { useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BadgesProvider } from './context/BadgesContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import Contact from './pages/Contact'
import About from './pages/About'
import HomePage from './pages/HomePage'
import FormPage from './pages/FormPage'

const pageTitles = {
  '/':           'لوحة التحكم',
  '/home-page':  'الرئيسية',
  '/categories': 'الأقسام',
  '/products':   'المنتجات',
  '/orders':     'الأوردرات',
  '/customers':  'العملاء',
  '/form':       'النموذج',
  '/contact':    'التواصل',
  '/about':      'من نحن',
}

/** Layout route — the matched child page renders through <Outlet />. */
function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'الرئيسية'

  return (
    <BadgesProvider>
      <div className="layout">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
          <Header title={title} />
          <div className="page-body">
            <Outlet />
          </div>
        </div>
      </div>
    </BadgesProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/home-page" element={<HomePage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
