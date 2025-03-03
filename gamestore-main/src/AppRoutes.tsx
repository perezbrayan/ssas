import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FortniteShop from './components/FortniteShop';
import Bot from './components/Bot';
import Crew from './components/Crew';
import Register from './components/Register';
import UserLogin from './components/Login';
import AdminLogin from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import VBucksManager from './pages/VBucksManager';
import UserManager from './pages/UserManager';
import Checkout from './pages/Checkout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/fortnite-shop" element={<FortniteShop />} />
      <Route path="/bot" element={<Bot />} />
      <Route path="/crew" element={<Crew />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/vbucks" element={<VBucksManager />} />
      <Route path="/admin/users" element={<UserManager />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
};

export default AppRoutes; 