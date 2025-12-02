import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { NewsService } from '../services/newsService';
import { NewsItem } from '../types';
import { EditNewsModal } from '../components/EditNewsModal';
import { LogOut, Edit2, RefreshCw, Eye, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { formatCategoryName } from '../constants';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auth Check
  useEffect(() => {
    const checkAuth = async () => {
        const isAuth = await AuthService.isAuthenticated();
        if (!isAuth) {
            navigate('/admin/login');
        } else {
            loadNews();
        }
    };
    checkAuth();
  }, [navigate]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await NewsService.getAllNews();
      setNews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/admin/login');
  };

  const openCreateModal = () => {
    setEditingItem(null); // Null means create mode
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: NewsItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"? This cannot be undone.`)) {
        try {
            await NewsService.deleteNews(item.id);
            setNews(prev => prev.filter(n => n.id !== item.id));
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete article.");
        }
    }
  };

  const handleSave = async (item: Partial<NewsItem>) => {
    try {
      if (item.id) {
        // Edit Mode
        await NewsService.updateNews(item as NewsItem);
      } else {
        // Create Mode
        await NewsService.createNews(item);
      }
      await loadNews(); // Refresh list
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save article. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="bg-black text-white px-3 py-1 font-serif font-bold text-lg rounded-sm">BN Admin</div>
          <span className="text-sm text-gray-500 hidden md:inline">Content Management System</span>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => window.open('/#/', '_blank')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
            >
                <Eye className="w-4 h-4" /> View Public Site
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-800"
            >
                <LogOut className="w-4 h-4" /> Logout
            </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">News Articles</h1>
                <p className="text-gray-500 text-sm mt-1">Manage content, categories, and view analytics.</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white font-bold rounded shadow hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Article
                </button>
                <button 
                    onClick={loadNews} 
                    className="p-2 text-gray-500 hover:text-black bg-white border border-gray-200 rounded shadow-sm hover:shadow"
                    title="Refresh List"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        {loading ? (
            <div className="text-center py-20 text-gray-400">Loading dashboard...</div>
        ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-3 font-medium">Info</th>
                                <th className="px-6 py-3 font-medium">Article Details</th>
                                <th className="px-6 py-3 font-medium">Stats</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {news.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap align-top">
                                        <div className="text-xs font-bold text-gray-400 mb-1">{item.date}</div>
                                        <div className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide">
                                            {formatCategoryName(item.category)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex items-start gap-3">
                                            {item.imageUrl && (
                                                <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            {!item.imageUrl && (
                                                 <div className="w-16 h-12 bg-gray-50 rounded flex items-center justify-center text-gray-300 flex-shrink-0">
                                                    <ImageIcon className="w-6 h-6" />
                                                 </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</div>
                                                <div className="text-gray-400 text-xs line-clamp-2 max-w-md">
                                                    {item.markdownContent}
                                                </div>
                                                <div className="mt-1 text-xs text-blue-600">{item.sourceName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap align-top">
                                         <div className="flex items-center gap-1.5 text-gray-600">
                                            <Eye className="w-4 h-4" />
                                            <span className="font-mono font-bold">{item.views.toLocaleString()}</span>
                                         </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right align-top">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => openEditModal(item)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-700 hover:border-black hover:text-black text-xs font-bold transition-all shadow-sm"
                                            >
                                                <Edit2 className="w-3 h-3" /> Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item)}
                                                className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                                                title="Delete Article"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {news.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        No articles found. Check Supabase connection.
                    </div>
                )}
            </div>
        )}
      </main>

      <EditNewsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
};