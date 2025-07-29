export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Suggestion {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}
export interface SuggestionState {
  suggestions: Suggestion[];
  addSuggestion: (content: string) => Promise<void>;
  markAsRead: (id: string, accessToken?: string) => Promise<void>;
  deleteSuggestion: (id: string, accessToken?: string) => Promise<void>;
  refreshSuggestions: (nickname: string, accessToken?: string) => Promise<void>;
}

export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}
