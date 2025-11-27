import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { PREDEFINED_CATEGORIES } from '../constants';
import { X, Save } from 'lucide-react';

interface EditNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<NewsItem>) => Promise<void>;
  item: NewsItem | null; // If null, we are creating
}

export const EditNewsModal: React.FC<EditNewsModalProps> = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState<Partial<NewsItem>>({});
  const [tagsInput, setTagsInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({ ...item });
        setTagsInput(item.tags ? item.tags.join(', ') : '');
      } else {
        // Reset for "Create New"
        setFormData({
          title: '',
          date: new Date().toISOString().split('T')[0],
          sourceName: '',
          sourceUrl: '',
          markdownContent: '',
          summary: '',
          tags: [],
          imageUrl: '',
          category: '',
          views: 0
        });
        setTagsInput('');
      }
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Process tags
    const processedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    await onSave({
      ...formData,
      tags: processedTags
    });
    
    setIsSaving(false);
    onClose();
  };

  const handleChange = (field: keyof NewsItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-serif font-bold text-gray-900">
            {item ? 'Edit Article' : 'New Article'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                required
                value={formData.title || ''}
                onChange={e => handleChange('title', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <div className="flex flex-col gap-2">
                    {/* Select from Predefined */}
                    <select
                      value={formData.category || ''}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black bg-white"
                    >
                      <option value="">-- Select Category --</option>
                      {PREDEFINED_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="custom">Other (Type below)</option>
                    </select>
                    
                    {/* Free Text Input fallback */}
                    <input 
                        type="text"
                        placeholder="Or type category..."
                        value={formData.category || ''}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Date (YYYY-MM-DD)</label>
                <input 
                  type="text" 
                  value={formData.date || ''}
                  onChange={e => handleChange('date', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

             {/* Image URL Input */}
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Image URL (Optional)</label>
              <input 
                type="url" 
                value={formData.imageUrl || ''}
                onChange={e => handleChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Source Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.sourceName || ''}
                  onChange={e => handleChange('sourceName', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Source URL</label>
                <input 
                  type="url" 
                  required
                  value={formData.sourceUrl || ''}
                  onChange={e => handleChange('sourceUrl', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Summary Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Summary (Short description)</label>
              <textarea 
                rows={3}
                value={formData.summary || ''}
                onChange={e => handleChange('summary', e.target.value)}
                placeholder="A brief overview displayed on cards and at the top of the article."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black font-sans text-sm"
              />
            </div>

             {/* Tags Input */}
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tags (Comma separated)</label>
              <input 
                type="text" 
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="AI, Tech, Future, Hardware"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Markdown Content</label>
              <textarea 
                required
                rows={8}
                value={formData.markdownContent || ''}
                onChange={e => handleChange('markdownContent', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-bold hover:bg-gray-200 rounded transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="edit-form"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-black text-white font-bold rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};