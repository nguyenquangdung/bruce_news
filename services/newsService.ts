import { supabase } from '../lib/supabaseClient';
import { NewsItem, CategoryOption } from '../types';
import { PREDEFINED_CATEGORIES } from '../constants';

// Helper để tạo slug từ title
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces with -
    .replace(/^-+|-+$/g, ''); // Trim -
};

// Helper mapping function to ensure consistency
const mapDbItemToNewsItem = (item: any): NewsItem => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  sourceName: item.source_name,
  sourceUrl: item.source_url,
  date: item.date,
  markdownContent: item.markdown_content, 
  summary: item.summary,
  tags: item.tags || [],
  imageUrl: item.image_url,
  views: item.views || 0,
  category: item.category || 'general',
});

export const NewsService = {
  /**
   * Fetch all news items from Supabase
   * @param limit Optional number of items to return
   */
  getAllNews: async (limit?: number): Promise<NewsItem[]> => {
    // Select all columns
    let query = supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    // Apply limit if provided
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching news:', error);
      throw error;
    }

    if (!data) return [];

    // Map Supabase result to App Type
    return data.map(mapDbItemToNewsItem);
  },

  /**
   * Fetch news filtered by category
   * Special case: 'ai' category returns ALL news as per requirements.
   */
  getNewsByCategory: async (category: string): Promise<NewsItem[]> => {
    let query = supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    // If category is NOT 'ai', filter strictly.
    // If category IS 'ai', we return everything because the user stated "all articles are about AI".
    if (category.toLowerCase() !== 'ai') {
       // Use ilike for case-insensitive matching
       query = query.ilike('category', category); 
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching news by category:', error);
      throw error;
    }

    if (!data) return [];

    return data.map(mapDbItemToNewsItem);
  },

  /**
   * Fetch a single news item by its slug
   */
  getNewsBySlug: async (slug: string): Promise<NewsItem | null> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching news details:', error);
      return null;
    }

    return mapDbItemToNewsItem(data);
  },

  /**
   * Fetch all available categories (Static list)
   */
  getCategories: async (): Promise<string[]> => {
    // Returning static list as table is removed
    return PREDEFINED_CATEGORIES;
  },

  /**
   * Update a specific news item
   */
  updateNews: async (updatedItem: NewsItem): Promise<void> => {
    const dbPayload = {
      title: updatedItem.title,
      slug: createSlug(updatedItem.title), // Auto-regenerate slug on title change
      source_name: updatedItem.sourceName,
      source_url: updatedItem.sourceUrl,
      markdown_content: updatedItem.markdownContent,
      summary: updatedItem.summary,
      tags: updatedItem.tags,
      image_url: updatedItem.imageUrl,
      category: updatedItem.category,
      date: updatedItem.date
    };

    const { error } = await supabase
      .from('news')
      .update(dbPayload)
      .eq('id', updatedItem.id);

    if (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  },

  /**
   * Increment view count for a news item
   */
  incrementView: async (id: string, currentViews: number) => {
    await supabase
      .from('news')
      .update({ views: currentViews + 1 })
      .eq('id', id);
  },

  /**
   * Create news item
   */
  createNews: async (newItem: Partial<NewsItem>): Promise<void> => {
    const dbPayload = {
      title: newItem.title,
      slug: newItem.title ? createSlug(newItem.title) : `news-${Date.now()}`,
      source_name: newItem.sourceName,
      source_url: newItem.sourceUrl,
      date: newItem.date,
      markdown_content: newItem.markdownContent,
      summary: newItem.summary,
      tags: newItem.tags,
      image_url: newItem.imageUrl,
      category: newItem.category,
    };

    const { error } = await supabase
      .from('news')
      .insert([dbPayload]);
      
    if (error) throw error;
  }
};