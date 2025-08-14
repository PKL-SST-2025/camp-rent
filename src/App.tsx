import { Router, Route, Navigate } from "@solidjs/router";
import { createSignal, JSX, onMount } from "solid-js";
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

// SSR-safe authentication check
const isLoggedIn = () => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return false;
  
  const current = localStorage.getItem('currentUser');
  if (!current) return false;
  
  try {
    const user = JSON.parse(current);
    return !!(user?.email && user?.password);
  } catch {
    return false;
  }
};

// Protected Route Component
const ProtectedRoute = (props: { children: number | boolean | Node | JSX.ArrayElement | (string & {}) | null | undefined; }) => {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(() => {
    // Check authentication only on client side
    setIsAuthenticated(isLoggedIn());
    setIsLoading(false);
  });

  return (
    <>
      {isLoading() ? (
        <div>Loading...</div>
      ) : isAuthenticated() ? (
        <Layout>{props.children}</Layout>
      ) : (
        <Navigate href="/login" />
      )}
    </>
  );
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
      <Route 
        path="/dashboard" 
        component={() => (
          <ProtectedRoute>
            <DashboardInventaris />
          </ProtectedRoute>
        )} 
      />
      
      <Route 
        path="/produk" 
        component={() => (
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        )} 
      />
      
      <Route 
        path="/produk/detail/:id" 
        component={() => (
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        )} 
      />
      
      <Route 
        path="/keranjang" 
        component={() => (
          <ProtectedRoute>
            <Keranjang />
          </ProtectedRoute>
        )} 
      />
      
      <Route 
        path="/checkout" 
        component={() => (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )} 
      />
      
      <Route 
        path="/checkout-summary" 
        component={() => (
          <ProtectedRoute>
            <CheckoutSummary />
          </ProtectedRoute>
        )} 
      />
      
      <Route 
        path="/riwayat" 
        component={() => (
          <ProtectedRoute>
            <Riwayat />
          </ProtectedRoute>
        )} 
      />
      
      <Route 
        path="/tracking/:id" 
        component={() => (
          <ProtectedRoute>
            <Tracking />
          </ProtectedRoute>
        )} 
      />
      
      <Route 
        path="/ulasan/:id" 
        component={() => (
          <ProtectedRoute>
            <Ulasan />
          </ProtectedRoute>
        )} 
      />
      
      <Route 
        path="/semuaulasan" 
        component={() => (
          <ProtectedRoute>
            <SemuaUlasan />
          </ProtectedRoute>
        )} 
      />
    </Router>
  );
}