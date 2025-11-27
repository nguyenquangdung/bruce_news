export interface CategoryOption {
  name: string;
  slug: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string; // URL safe string
  sourceName: string;
  sourceUrl: string;
  date: string;
  markdownContent: string;
  
  // New fields for V2 (Updated for V7 no-relation)
  imageUrl?: string;
  views: number;
  
  // Updated for V8: Combined field
  category: string;
  
  // New fields for V6
  summary?: string;
  tags?: string[];
  
  isHero?: boolean; // Internal UI flag
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'guest';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}