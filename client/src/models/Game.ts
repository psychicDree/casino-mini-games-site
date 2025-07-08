export interface IGame {
  id: string;
  name: string;
  url: string;
  type?: string;
  badge?: string;
  unityBuildPath?: string;
  isUnityGame?: boolean;
}

export class Game implements IGame {
  public id: string;
  public name: string;
  public url: string;
  public type?: string;
  public badge?: string;
  public unityBuildPath?: string;
  public isUnityGame?: boolean;

  constructor({ id, name, url, type, badge, unityBuildPath, isUnityGame }: IGame) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.type = type;
    this.badge = badge;
    this.unityBuildPath = unityBuildPath;
    this.isUnityGame = isUnityGame;
  }

  get displayName(): string {
    return this.name;
  }

  static fromApi(data: any): Game {
    return new Game({
      id: data.id,
      name: data.name,
      url: data.url,
      type: data.type,
      badge: data.badge,
      unityBuildPath: data.unityBuildPath,
      isUnityGame: data.isUnityGame,
    });
  }
} 