import { SupportedLanguage } from '../types';

export interface LanguageInfo {
  id: SupportedLanguage;
  name: string;
  nativeName: string;
  code: string;
  category: 'Indian' | 'Global';
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  // Primary Indian Languages
  { id: 'Telugu', name: 'Telugu', nativeName: 'తెలుగు', code: 'te', category: 'Indian', flag: '🇮🇳' },
  { id: 'Hindi', name: 'Hindi', nativeName: 'हिन्दी', code: 'hi', category: 'Indian', flag: '🇮🇳' },
  { id: 'Tamil', name: 'Tamil', nativeName: 'தமிழ்', code: 'ta', category: 'Indian', flag: '🇮🇳' },
  { id: 'Kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ', code: 'kn', category: 'Indian', flag: '🇮🇳' },
  { id: 'Malayalam', name: 'Malayalam', nativeName: 'മലയാളം', code: 'ml', category: 'Indian', flag: '🇮🇳' },
  { id: 'Bengali', name: 'Bengali', nativeName: 'বাংলা', code: 'bn', category: 'Indian', flag: '🇮🇳' },
  { id: 'Marathi', name: 'Marathi', nativeName: 'मराठी', code: 'mr', category: 'Indian', flag: '🇮🇳' },
  { id: 'Gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી', code: 'gu', category: 'Indian', flag: '🇮🇳' },
  { id: 'Punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', code: 'pa', category: 'Indian', flag: '🇮🇳' },
  { id: 'Urdu', name: 'Urdu', nativeName: 'اردو', code: 'ur', category: 'Indian', flag: '🇮🇳' },

  // Global Languages
  { id: 'English', name: 'English', nativeName: 'English', code: 'en', category: 'Global', flag: '🌐' },
  { id: 'Spanish', name: 'Spanish', nativeName: 'Español', code: 'es', category: 'Global', flag: '🇪🇸' },
  { id: 'French', name: 'French', nativeName: 'Français', code: 'fr', category: 'Global', flag: '🇫🇷' },
  { id: 'German', name: 'German', nativeName: 'Deutsch', code: 'de', category: 'Global', flag: '🇩🇪' },
  { id: 'Japanese', name: 'Japanese', nativeName: '日本語', code: 'ja', category: 'Global', flag: '🇯🇵' },
  { id: 'Mandarin', name: 'Mandarin Chinese', nativeName: '中文', code: 'zh-CN', category: 'Global', flag: '🇨🇳' },
  { id: 'Arabic', name: 'Arabic', nativeName: 'العربية', code: 'ar', category: 'Global', flag: '🇸🇦' },
  { id: 'Portuguese', name: 'Portuguese', nativeName: 'Português', code: 'pt', category: 'Global', flag: '🇧🇷' },
  { id: 'Russian', name: 'Russian', nativeName: 'Русский', code: 'ru', category: 'Global', flag: '🇷🇺' },
  { id: 'Italian', name: 'Italian', nativeName: 'Italiano', code: 'it', category: 'Global', flag: '🇮🇹' },
  { id: 'Korean', name: 'Korean', nativeName: '한국어', code: 'ko', category: 'Global', flag: '🇰🇷' },
];

export const INDIAN_LANGUAGES = SUPPORTED_LANGUAGES.filter((l) => l.category === 'Indian');
export const GLOBAL_LANGUAGES = SUPPORTED_LANGUAGES.filter((l) => l.category === 'Global');

export function getLanguageInfo(lang: SupportedLanguage): LanguageInfo {
  return SUPPORTED_LANGUAGES.find((l) => l.id === lang) || SUPPORTED_LANGUAGES[0];
}
