import { Game } from '../models/Game';

export class GamesApi {
  static async fetchGames(): Promise<Game[]> {
    try {
      const response = await fetch('/api/games');
      if (!response.ok) throw new Error('Failed to fetch games');
      const data = await response.json();
      return Array.isArray(data) ? data.map(Game.fromApi) : [];
    } catch (error) {
      // Optionally log error
      return [];
    }
  }
} 