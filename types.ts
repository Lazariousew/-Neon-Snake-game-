
export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Coordinates {
  x: number;
  y: number;
}

export enum GameState {
  START,
  PLAYING,
  GAME_OVER,
}