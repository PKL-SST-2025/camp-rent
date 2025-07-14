import { Router, Route, Navigate } from "@solidjs/router";
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import DashboardInventaris from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Keranjang from './pages/Keranjang';
import Checkout from './pages/Chekout';
import CheckoutSummary from './pages/CheckoutSummary';
import Riwayat from './pages/Riwayat';
import Tracking from './pages/Tracking';
import Ulasan from './pages/Ulasan';
import SemuaUlasan from './pages/SemuaUlasan';
import Layout from './layout/Layout';

const isLoggedIn = () => {
  const current = localStorage.getItem('currentUser');
  if (!current) return false;
  try {
    const user = JSON.parse(current);
    return !!(user?.email && user?.password);
  } catch {
    return false;
  }
};

export default function App() {
  return (
    <Router>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Protected routes */}
      <Route path="/dashboard" component={() =>
        isLoggedIn() ? <Layout><DashboardInventaris /></Layout> : <Navigate href="/login" />
      } />

      <Route path="/produk" component={() =>
        isLoggedIn() ? <Layout><ProductList /></Layout> : <Navigate href="/login" />
      } />

      <Route path="/produk/detail/:id" component={() =>
        isLoggedIn() ? <Layout><ProductDetail /></Layout> : <Navigate href="/login" />
      } />

      <Route path="/keranjang" component={() =>
        isLoggedIn() ? <Layout><Keranjang /></Layout> : <Navigate href="/login" />
      } />

      <Route path="/checkout" component={() =>
        isLoggedIn() ? <Layout><Checkout /></Layout> : <Navigate href="/login" />
      } />

      <Route path="/checkout-summary" component={() =>
        isLoggedIn() ? <Layout><CheckoutSummary /></Layout> : <Navigate href="/login" />
      } />

      <Route path="/riwayat" component={() =>
        isLoggedIn() ? <Layout><Riwayat /></Layout> : <Navigate href="/login" />
      } />

      <Route path="/tracking/:id" component={() =>
        isLoggedIn() ? <Layout><Tracking /></Layout> : <Navigate href="/login" />
      } />

      <Route path="/ulasan/:id" component={() =>
        isLoggedIn() ? <Layout><Ulasan /></Layout> : <Navigate href="/login" />
      } />

      <Route path="/semuaulasan" component={() =>
        isLoggedIn() ? <Layout><SemuaUlasan /></Layout> : <Navigate href="/login" />
      } />
    </Router>
  );
}
