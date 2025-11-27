import { NewsItem, CategoryOption } from './types';

// Helper function to convert "machine-learning" or "TECHNOLOGY" -> "Machine Learning" / "Technology"
export const formatCategoryName = (input: string | undefined): string => {
  if (!input) return 'General';
  // 1. Replace hyphens/underscores with spaces
  // 2. Split into words
  // 3. Capitalize first letter of each word, lower case the rest
  return input
    .replace(/[-_]/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Simplified list for the dropdown
export const PREDEFINED_CATEGORIES: string[] = [
  'Technology',
  'Research',
  'Business',
  'Policy & Ethics',
  'World',
  'Machine Learning',
  'General',
];

export const MOCK_INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'OpenAI Releases GPT-5 "Orion": A New Era of Reasoning',
    slug: 'openai-releases-gpt-5-orion',
    sourceName: 'OpenAI Blog',
    sourceUrl: 'https://openai.com/blog',
    date: '2025-11-26',
    summary: 'OpenAI unveils "Orion", a frontier model boasting 98% benchmark success and capable of writing full software modules.',
    tags: ['AI', 'LLM', 'OpenAI', 'Tech'],
    markdownContent: `OpenAI has officially unveiled its latest frontier model, code-named "Orion". Unlike its predecessors, Orion demonstrates a significant leap in multi-step reasoning and long-horizon planning. 
    
    In a press release this morning, Sam Altman stated that the model has achieved a 98% success rate on the benchmarks that previously stumped GPT-4. The model is immediately available to Enterprise users starting today.
    
    Early tests suggest that Orion can write fully functional software modules from a single prompt, adhering to complex architectural requirements without hallucinating libraries. This marks a pivotal moment in the timeline towards AGI.`,
    views: 12500,
    category: 'technology'
  },
  {
    id: '2',
    title: 'Google DeepMind Solves 50-Year-Old Biology Grand Challenge',
    slug: 'google-deepmind-solves-biology-grand-challenge',
    sourceName: 'DeepMind Research',
    sourceUrl: 'https://deepmind.google/research',
    date: '2025-11-25',
    summary: 'AlphaFold 4 accurately predicts protein-DNA interactions, accelerating drug discovery for genetic diseases tenfold.',
    tags: ['Biotech', 'DeepMind', 'Health', 'Science'],
    markdownContent: `DeepMind's AlphaFold 4 has successfully predicted the interaction of protein-DNA complexes with near-perfect accuracy, a feat that has eluded biologists for decades. 
    
    This breakthrough is expected to accelerate drug discovery for genetic diseases by a factor of ten. "We are effectively simulating life at a molecular level with unprecedented fidelity," said Demis Hassabis in a virtual keynote.`,
    views: 8900,
    category: 'research'
  },
  {
    id: '3',
    title: 'NVIDIA Announces Blackwell Ultra Chips for Edge AI',
    slug: 'nvidia-announces-blackwell-ultra-chips-for-edge-ai',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    date: '2025-11-24',
    summary: 'NVIDIA new Blackwell Ultra series offers 5x inference speed for edge devices, reducing cloud dependency.',
    tags: ['Hardware', 'NVIDIA', 'Edge AI'],
    markdownContent: `Jensen Huang took the stage at GTC to announce the Blackwell Ultra series, designed specifically to run massive LLMs on edge devices like cars and robots without cloud dependency.
    
    The new architecture promises 5x the inference speed at half the power consumption of the H100 series. Stock prices for NVIDIA surged 4% following the announcement.`,
    views: 15400,
    category: 'business'
  },
  {
    id: '4',
    title: 'Anthropic Introduces "Constitutional AI" v2 Framework',
    slug: 'anthropic-introduces-constitutional-ai-v2-framework',
    sourceName: 'Anthropic Blog',
    sourceUrl: 'https://www.anthropic.com',
    date: '2025-11-23',
    summary: 'Anthropic releases an open-source transparency engine allowing developers to see why models refuse specific prompts.',
    tags: ['Safety', 'Ethics', 'Anthropic'],
    markdownContent: `Anthropic has released an updated framework for AI safety, focusing on interpretability. The new "Constitutional AI" v2 allows developers to see exactly *why* a model refused a prompt or chose a specific path of reasoning.
    
    This transparency engine is now open-source, encouraging other labs to adopt similar safety standards.`,
    views: 4200,
    category: 'ethics'
  }
];

export const STORAGE_KEYS = {
  NEWS_DATA: 'brucenews_data_v1',
  AUTH_SESSION: 'brucenews_auth_session',
};