import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import Interview from './pages/Interview';
import Aptitude from './pages/Aptitude';
import Login from './pages/Login';
import Register from './pages/Register';
import ResumeBuilder from './pages/ResumeBuilder';
import Subscription from './pages/Subscription';
import ErrorBoundary from "./components/ErrorBoundary";

// Protected route component
const ProtectedRoute = ({ children, requireAuth = true, requirePro = false }) => {
  const token = localStorage.getItem("token");
  const subscriptionPlan = localStorage.getItem("subscriptionPlan");
  const subscriptionStatus = localStorage.getItem("subscriptionStatus");
  
  // Check authentication
  if (requireAuth && !token) {
    return <Navigate to="/" replace />;
  }
  
  // Check pro feature access
  if (requirePro && (subscriptionPlan === "free" || subscriptionStatus !== "active")) {
    return <Navigate to="/subscription" replace />;
  }
  
  return children;
};

// Public route - redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected Routes - Require Authentication */}
          <Route path="/dashboard" element={
            <ProtectedRoute requireAuth={true}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute requireAuth={true}>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/interview" element={
            <ProtectedRoute requireAuth={true}>
              <Interview />
            </ProtectedRoute>
          } />
          
          <Route path="/aptitude" element={
            <ProtectedRoute requireAuth={true}>
              <Aptitude />
            </ProtectedRoute>
          } />
          
          {/* Resume Builder - Free for all authenticated users */}
          <Route path="/resume-builder" element={
            <ProtectedRoute requireAuth={true}>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
          
          {/* Payment/Subscription Routes */}
          <Route path="/pricing" element={
            <ProtectedRoute requireAuth={true}>
              <Payment />
            </ProtectedRoute>
          } />
          
          <Route path="/payment" element={
            <ProtectedRoute requireAuth={true}>
              <Payment />
            </ProtectedRoute>
          } />
          
          <Route path="/subscription" element={
            <ProtectedRoute requireAuth={true}>
              <Subscription />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<ErrorBoundary />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;