import { create } from 'zustand';
import type { SuggestionState } from '../types';
import { apiGet, apiPatch, apiDelete } from '../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2083/api';

export const useSuggestionStore = create<SuggestionState>()((set, get) => ({
  suggestions: [],
  
  addSuggestion: async (content) => {
    try {
      const response = await fetch(`${API_BASE_URL}/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) throw new Error('Failed to add suggestion');
      const newSuggestion = await response.json();
      set({ suggestions: [...get().suggestions, newSuggestion] });
    } catch (error) {
      console.error('Failed to add suggestion:', error);
      throw error;
    }
  },
  
  markAsRead: async (id, accessToken) => {
    try {
      const updatedSuggestion = await apiPatch(`/suggestions/${id}`, { isRead: true }, accessToken || undefined);
      set({
        suggestions: get().suggestions.map(suggestion =>
          suggestion.id === id ? updatedSuggestion : suggestion
        )
      });
    } catch (error) {
      console.error('Failed to mark suggestion as read:', error);
      throw error;
    }
  },
  
  deleteSuggestion: async (id, accessToken) => {
    try {
      await apiDelete(`/suggestions/${id}`, accessToken || undefined);
      set({
        suggestions: get().suggestions.filter(suggestion => suggestion.id !== id)
      });
    } catch (error) {
      console.error('Failed to delete suggestion:', error);
      throw error;
    }
  },
  
  refreshSuggestions: async (nickname, accessToken) => {
    try {
      const ADMIN_NAMES = import.meta.env.VITE_ADMIN_NAMES?.split(',') || ['test1', 'test'];
      const isAdmin = ADMIN_NAMES.includes(nickname) || false;

      if (isAdmin && accessToken) {
        const suggestions = await apiGet('/suggestions', accessToken);
        set({ suggestions });
      }
    } catch (error) {
      console.error('Failed to refresh suggestions:', error);
      throw error;
    }
  },
}));
