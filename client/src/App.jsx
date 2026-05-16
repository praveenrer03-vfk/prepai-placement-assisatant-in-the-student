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
import Leaderboard from './pages/Leaderboard';
import ErrorBoundary from "./components/ErrorBoundary";
import CodingPractice from "./pages/CodingPractice";

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
    return <Navigate to="/payment" replace />;
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

// Subscription redirect handler
const SubscriptionRedirect = () => {
  const subscriptionPlan = localStorage.getItem("subscriptionPlan");
  const subscriptionStatus = localStorage.getItem("subscriptionStatus");
  
  // If user already has an active pro subscription, redirect to resume builder
  if (subscriptionStatus === "active" && subscriptionPlan !== "free" && subscriptionPlan !== null) {
    return <Navigate to="/resume-builder" replace />;
  }
  
  // Otherwise show subscription page
  return <Subscription />;
};

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Public Routes - No authentication required */}
          <Route path="/" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected Routes - Authentication required */}
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
          
          <Route path="/coding-practice" element={
            <ProtectedRoute requireAuth={true}>
              <CodingPractice />
            </ProtectedRoute>
          } />
          
          <Route path="/resume-builder" element={
            <ProtectedRoute requireAuth={true}>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
          
          <Route path="/leaderboard" element={
            <ProtectedRoute requireAuth={true}>
              <Leaderboard />
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
          
          {/* Subscription route with redirect logic for pro users */}
          <Route path="/subscription" element={
            <ProtectedRoute requireAuth={true}>
              <SubscriptionRedirect />
            </ProtectedRoute>
          } />
          
          {/* 404 Route - Catch all unmatched routes */}
          <Route path="*" element={
            <div style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#060610",
              color: "#fff",
              fontFamily: "sans-serif"
            }}>
              <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: 72, marginBottom: 16 }}>404</h1>
                <p style={{ fontSize: 18, marginBottom: 24 }}>Page not found</p>
                <button
                  onClick={() => window.location.href = "/dashboard"}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #00ffa3, #00c9ff)",
                    border: "none",
                    borderRadius: 12,
                    color: "#060610",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          } />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;