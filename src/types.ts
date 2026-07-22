export type SimplificationMode = 'default' | 'eli5' | 'pro' | 'student' | 'academy' | 'ebook' | 'storybook' | 'webseries' | 'film' | 'animation' | 'game' | 'news' | 'business' | 'blueprint';
export type OutputLanguage = 'en' | 'hi' | 'hinglish';

export interface WebSource {
  uri: string;
  title: string;
}

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
  sources?: WebSource[];
}

export interface ExampleItem {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
}
