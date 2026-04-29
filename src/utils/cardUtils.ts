import { Card, Suit, BoardState } from '../types/game';

const SUITS: Suit[] = ['hearts', 'spades', 'diamonds', 'clubs'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let value = 1; value <= 13; value++) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): void {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

export function dealCards(deck: Card[], numPlayers: number): Card[][] {
  const hands: Card[][] = Array.from({ length: numPlayers }, () => []);
  deck.forEach((card, i) => {
    hands[i % numPlayers].push(card);
  });
  return hands;
}

export function isValidMove(card: Card, board: BoardState): boolean {
  const suitBoard = board[card.suit];
  if (card.value === 7) {
    return suitBoard === null;
  }
  if (suitBoard === null) return false;
  return card.value === suitBoard.low - 1 || card.value === suitBoard.high + 1;
}

export function hasValidMove(hand: Card[], board: BoardState): boolean {
  return hand.some(card => isValidMove(card, board));
}

export function getValidCards(hand: Card[], board: BoardState): Card[] {
  return hand.filter(card => isValidMove(card, board));
}

export function cardLabel(value: number): string {
  if (value === 1) return 'A';
  if (value === 11) return 'J';
  if (value === 12) return 'Q';
  if (value === 13) return 'K';
  return String(value);
}

export function suitSymbol(suit: Suit): string {
  const symbols = { hearts: '♥', spades: '♠', diamonds: '♦', clubs: '♣' };
  return symbols[suit];
}

export function suitColor(suit: Suit): string {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-gray-900';
}

export function suitName(suit: Suit): string {
  return suit.charAt(0).toUpperCase() + suit.slice(1);
}

export function sortHand(hand: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = { hearts: 0, spades: 1, diamonds: 2, clubs: 3 };
  return [...hand].sort((a, b) => {
    if (a.suit !== b.suit) return suitOrder[a.suit] - suitOrder[b.suit];
    return a.value - b.value;
  });
}
