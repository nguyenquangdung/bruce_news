import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { Lock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await AuthService.login(email, password);
      
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('An unexpected error occurred connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white w-6 h-6" />
           </div>
           <h1 className="font-serif text-2xl font-bold text-gray-900">Admin Access</h1>
           <p className="text-sm text-gray-500 mt-2">Sign in via Supabase Auth</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
             <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="admin@brucenews.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/" className="text-gray-500 hover:text-black hover:underline">
            &larr; Return to Public Site
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
            Note: Ensure you have created this user in Supabase Auth.
        </div>
      </div>
    </div>
  );
};