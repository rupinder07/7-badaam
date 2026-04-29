export type Suit = 'hearts' | 'spades' | 'diamonds' | 'clubs';

export interface Card {
  suit: Suit;
  value: number; // 1=A, 2-10, 11=J, 12=Q, 13=K
}

export interface BoardSuit {
  low: number;  // lowest card played (starts at 7, decreases toward 1)
  high: number; // highest card played (starts at 7, increases toward 13)
}

export type BoardState = {
  [K in Suit]: BoardSuit | null; // null = 7 not yet played for this suit
};

export interface Player {
  id: string;
  name: string;
  cardCount: number;
  isHost: boolean;
}

export type GameStatus = 'waiting' | 'playing' | 'finished';

export interface GameState {
  id: string;
  status: GameStatus;
  players: Player[];
  currentPlayerIndex: number;
  board: BoardState;
  winner: string | null;
  hostId: string;
  createdAt: number;
}

export interface Hand {
  cards: Card[];
}
