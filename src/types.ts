export type SimplificationMode = 'default' | 'eli5' | 'pro' | 'student' | 'academy' | 'ebook' | 'storybook' | 'webseries' | 'film' | 'animation' | 'game' | 'news' | 'business';
export type OutputLanguage = 'en' | 'hi' | 'hinglish';

export interface InputHistoryItem {
  id: string;
  originalText: string;
  imageAttached?: boolean;
  imageMimeType?: string;
  imageData?: string; // base64
  simplifiedText: string;
  mode: SimplificationMode;
  language?: OutputLanguage;
  title: string;
  timestamp: number;
  rating?: number;
}

export interface ExampleItem {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
}
