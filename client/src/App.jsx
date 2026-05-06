import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import Interview from './pages/Interview';
import Aptitude from './pages/Aptitude';
import Login from './pages/Login';
import Register from './pages/Register';
import ResumeBuilder from './pages/ResumeBuilder';
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/aptitude" element={<Aptitude />} />
        <Route path="/pricing" element={<Payment />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="*" element={<ErrorBoundary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;