import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ToastProvider } from './components/Toast';
import AppFrame from './components/AppFrame';
import ProtectedRoute from './components/ProtectedRoute';

// Page Imports
import Home from './pages/Home';
import Architecture from './pages/Architecture';
import Comparison from './pages/Comparison';
import Applications from './pages/Applications';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Bom from './pages/Bom';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <AppFrame>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/bom" element={<Bom />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppFrame>
        </BrowserRouter>
      </ToastProvider>
    </Provider>
  );
}
