import { GamesApi } from '../api/gamesApi';
import { Game } from '../models/Game';

export class GameController {
  async getGames(): Promise<Game[]> {
    return await GamesApi.fetchGames();
  }
} 