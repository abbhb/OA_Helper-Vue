import axios from 'axios';

export interface GameSave {
  id?: string;
  gameType: string;
  gameData: any;
  score: number;
  createTime?: string;
  userId?: string;
}

export const gameService = {
  // Save game progress
  saveGame(data: GameSave) {
    return axios.post<GameSave>('/api/game/save', data);
  },

  // Get save list for specific game
  getSaves(gameType: string) {
    return axios.get<GameSave[]>('/api/game/saves', { params: { gameType } });
  },

  // Load specific save
  loadSave(id: number) {
      return axios.get<GameSave[]>(`/api/game/save/${id}`);
  },

  getLeaderboard(gameType:string){
    return axios.get<GameSave[]>(`/api/game/s/${gameType}`)
  },
  // Delete save
  deleteSave(id: number) {
      return axios.delete<string>(`/api/game/save/${id}`);
  },
};
