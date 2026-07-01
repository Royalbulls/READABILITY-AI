export type SimplificationMode = 'default' | 'eli5' | 'pro' | 'student' | 'academy';

export interface InputHistoryItem {
  id: string;
  originalText: string;
  imageAttached?: boolean;
  imageMimeType?: string;
  imageData?: string; // base64
  simplifiedText: string;
  mode: SimplificationMode;
  title: string;
  timestamp: number;
}

export interface ExampleItem {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
}
