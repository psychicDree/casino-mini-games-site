export interface IGame {
  id: string;
  name: string;
  url: string;
  type?: string;
  badge?: string;
}

export class Game implements IGame {
  public id: string;
  public name: string;
  public url: string;
  public type?: string;
  public badge?: string;

  constructor({ id, name, url, type, badge }: IGame) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.type = type;
    this.badge = badge;
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
    });
  }
} 