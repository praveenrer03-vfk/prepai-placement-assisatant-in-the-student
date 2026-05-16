import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

// ─── Protected Route ────────────────────────────────────────────────────────
// Redirects unauthenticated users to login.
// If requirePro=true, also checks for an active non-free subscription.
const ProtectedRoute = ({ children, requireAuth = true, requirePro = false }) => {
  const token = localStorage.getItem("token");
  const subscriptionPlan = localStorage.getItem("subscriptionPlan");
  const subscriptionStatus = localStorage.getItem("subscriptionStatus");

  // FIX #1: Check authentication first
  if (requireAuth && !token) {
    return <Navigate to="/login" replace />;
  }

  // FIX #2: localStorage stores strings; "null" !== null, so check the string value
  const isPro =
    subscriptionStatus === "active" &&
    subscriptionPlan !== null &&
    subscriptionPlan !== "null" &&
    subscriptionPlan !== "free";

  // FIX #3: requirePro guard is now actually wired up
  if (requirePro && !isPro) {
    return <Navigate to="/payment" replace />;
  }

  return children;
};

// ─── Public Route ────────────────────────────────────────────────────────────
// Redirects already-authenticated users away from login / register.
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ─── Subscription Redirect ───────────────────────────────────────────────────
// Pro users who land on /subscription are sent straight to the resume builder.
const SubscriptionRedirect = () => {
  const subscriptionPlan = localStorage.getItem("subscriptionPlan");
  const subscriptionStatus = localStorage.getItem("subscriptionStatus");

  // FIX #4: compare against the string "null" (localStorage never returns real null)
  const isPro =
    subscriptionStatus === "active" &&
    subscriptionPlan !== null &&
    subscriptionPlan !== "null" &&
    subscriptionPlan !== "free";

  if (isPro) {
    return <Navigate to="/resume-builder" replace />;
  }

  return <Subscription />;
};

// ─── 404 Page ────────────────────────────────────────────────────────────────
// FIX #5: Extracted into its own component so useNavigate works correctly
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#060610",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 72, marginBottom: 16 }}>404</h1>
        <p style={{ fontSize: 18, marginBottom: 24 }}>Page not found</p>
        <button
          onClick={() => navigate("/dashboard")}   // FIX #5: useNavigate instead of window.location.href
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #00ffa3, #00c9ff)",
            border: "none",
            borderRadius: 12,
            color: "#060610",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* ── Public Routes (no auth required) ── */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* ── Protected Routes (auth required) ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/aptitude"
            element={
              <ProtectedRoute>
                <Aptitude />
              </ProtectedRoute>
            }
          />

          <Route
            path="/coding-practice"
            element={
              <ProtectedRoute>
                <CodingPractice />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />

          {/* ── Pro-only Routes (auth + active subscription required) ── */}
          {/* FIX #3: resume-builder now correctly enforces requirePro */}
          <Route
            path="/resume-builder"
            element={
              <ProtectedRoute requirePro={true}>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />

          {/* ── Payment / Subscription Routes ── */}
          {/* FIX #6: Removed duplicate /pricing route; use /payment as the single canonical path */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <SubscriptionRedirect />
              </ProtectedRoute>
            }
          />

          {/* ── 404 Catch-all ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;