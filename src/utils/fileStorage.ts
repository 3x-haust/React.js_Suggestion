import type { Suggestion } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
export class FileStorage {
  static async getSuggestions(): Promise<Suggestion[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/suggestions`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      return await response.json();
    } catch (error) {
      console.error('Error loading suggestions:', error);
      return [];
    }
  }

  static async addSuggestion(content: string): Promise<Suggestion | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) throw new Error('Failed to add suggestion');
      return await response.json();
    } catch (error) {
      console.error('Error adding suggestion:', error);
      return null;
    }
  }

  static async markAsRead(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/suggestions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error marking as read:', error);
      return false;
    }
  }

  static async deleteSuggestion(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/suggestions/${id}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      return false;
    }
  }

  static async downloadBackup(): Promise<void> {
    try {
      const suggestions = await this.getSuggestions();
      const data = {
        suggestions,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `suggestions-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading backup:', error);
    }
  }

  static async downloadExcel(): Promise<void> {
    try {
      const suggestions = await this.getSuggestions();
      
      const csvHeader = 'ID,제목,내용,제출일시,확인여부\n';
      const csvData = suggestions.map(suggestion => {
        const lines = suggestion.content.split('\n');
        const title = lines[0]?.replace('제목: ', '') || '';
        const content = lines.slice(2).join(' ').replace(/"/g, '""');
        const date = new Date(suggestion.createdAt).toLocaleString('ko-KR');
        const isRead = suggestion.isRead ? '확인완료' : '미확인';
        
        return `="${suggestion.id}","${title}","${content}","${date}","${isRead}"`;
      }).join('\n');

      const csvContent = '\uFEFF' + csvHeader + csvData;
      
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `건의사항-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  }
}
