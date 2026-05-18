import { Route, Routes } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/home/Home.jsx';
import Shop from './pages/shop/Shop.jsx';
import Product from './pages/product/Product.jsx';
import Cart from './pages/cart/Cart.jsx';
import Checkout from './pages/checkout/Checkout.jsx';
import OrderConfirmation from './pages/order-confirmation/OrderConfirmation.jsx';
import Auth from './pages/auth/Auth.jsx';
import Search from './pages/search/Search.jsx';
import Wishlist from './pages/wishlist/Wishlist.jsx';
import About from './pages/about/About.jsx';
import Contact from './pages/contact/Contact.jsx';
import Faq from './pages/faq/Faq.jsx';
import Profile from './pages/profile/Profile.jsx';
import { useReveal } from './hooks/useReveal.js';
import ScrollToTop from './components/ScrollToTop.jsx';

export default function App() {
  useReveal();
  return (
    <>
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="*"
            element={
              <div className="akwab-container py-24 text-center">
                <h1 className="text-5xl mb-4">٤٠٤</h1>
                <p className="text-brand-ink-soft">الصفحة غير موجودة.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
