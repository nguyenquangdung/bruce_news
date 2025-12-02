import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { AllNewsPage } from './pages/AllNewsPage';
import { CategoryPage } from './pages/CategoryPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-news" element={<AllNewsPage />} />
        
        {/* Section Route for Navigation Links */}
        <Route path="/section/:category" element={<CategoryPage />} />

        {/* Dynamic Route for News Detail: category/slug */}
        <Route path="/:category/:slug" element={<NewsDetailPage />} />
        
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;