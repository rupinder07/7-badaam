import {
  doc, setDoc, getDoc, updateDoc, onSnapshot,
  runTransaction, deleteDoc, Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { GameState, Card, BoardState, Player, Hand } from '../types/game';
import { createDeck, shuffleDeck, dealCards } from '../utils/cardUtils';

const GAMES = 'games';
const HANDS = 'hands';

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createGame(hostId: string, hostName: string): Promise<string> {
  const roomCode = generateRoomCode();
  const gameRef = doc(db, GAMES, roomCode);

  const initialBoard: BoardState = {
    hearts: null,
    spades: null,
    diamonds: null,
    clubs: null,
  };

  const gameState: GameState = {
    id: roomCode,
    status: 'waiting',
    players: [{ id: hostId, name: hostName, cardCount: 0, isHost: true }],
    currentPlayerIndex: 0,
    board: initialBoard,
    winner: null,
    hostId,
    createdAt: Date.now(),
  };

  await setDoc(gameRef, gameState);
  return roomCode;
}

export async function joinGame(gameId: string, playerId: string, playerName: string): Promise<{ success: boolean; error?: string }> {
  const gameRef = doc(db, GAMES, gameId.toUpperCase());

  try {
    await runTransaction(db, async (transaction) => {
      const gameDoc = await transaction.get(gameRef);
      if (!gameDoc.exists()) throw new Error('Game not found');

      const game = gameDoc.data() as GameState;
      if (game.status !== 'waiting') throw new Error('Game has already started');
      if (game.players.length >= 6) throw new Error('Game is full (max 6 players)');
      if (game.players.find(p => p.id === playerId)) return;

      const newPlayer: Player = { id: playerId, name: playerName, cardCount: 0, isHost: false };
      transaction.update(gameRef, { players: [...game.players, newPlayer] });
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function startGame(gameId: string): Promise<void> {
  const gameRef = doc(db, GAMES, gameId);
  const gameDoc = await getDoc(gameRef);

  if (!gameDoc.exists()) throw new Error('Game not found');

  const game = gameDoc.data() as GameState;
  if (game.players.length < 2) throw new Error('Need at least 2 players to start');

  const deck = createDeck();
  shuffleDeck(deck);
  const hands = dealCards(deck, game.players.length);

  // find who has 7 of hearts — they go first
  let firstPlayerIndex = 0;
  for (let i = 0; i < hands.length; i++) {
    if (hands[i].some(c => c.suit === 'hearts' && c.value === 7)) {
      firstPlayerIndex = i;
      break;
    }
  }

  // save each player's hand in a subcollection
  for (let i = 0; i < game.players.length; i++) {
    const handRef = doc(db, GAMES, gameId, HANDS, game.players[i].id);
    await setDoc(handRef, { cards: hands[i] });
  }

  const updatedPlayers = game.players.map((p, i) => ({ ...p, cardCount: hands[i].length }));

  await updateDoc(gameRef, {
    status: 'playing',
    players: updatedPlayers,
    currentPlayerIndex: firstPlayerIndex,
  });
}

export async function playCard(gameId: string, playerId: string, card: Card): Promise<void> {
  const gameRef = doc(db, GAMES, gameId);
  const handRef = doc(db, GAMES, gameId, HANDS, playerId);

  await runTransaction(db, async (transaction) => {
    const [gameDoc, handDoc] = await Promise.all([
      transaction.get(gameRef),
      transaction.get(handRef),
    ]);

    if (!gameDoc.exists() || !handDoc.exists()) throw new Error('Game or hand not found');

    const game = gameDoc.data() as GameState;
    const hand = handDoc.data() as Hand;

    if (game.players[game.currentPlayerIndex].id !== playerId) {
      throw new Error('Not your turn');
    }

    const newCards = hand.cards.filter(c => !(c.suit === card.suit && c.value === card.value));

    const newBoard: BoardState = {
      hearts: game.board.hearts,
      spades: game.board.spades,
      diamonds: game.board.diamonds,
      clubs: game.board.clubs,
    };

    if (card.value === 7) {
      newBoard[card.suit] = { low: 7, high: 7 };
    } else {
      const suitBoard = newBoard[card.suit]!;
      if (card.value === suitBoard.low - 1) {
        newBoard[card.suit] = { ...suitBoard, low: card.value };
      } else {
        newBoard[card.suit] = { ...suitBoard, high: card.value };
      }
    }

    const updatedPlayers = game.players.map(p =>
      p.id === playerId ? { ...p, cardCount: newCards.length } : p
    );

    const isWinner = newCards.length === 0;
    const nextIndex = (game.currentPlayerIndex + 1) % game.players.length;

    transaction.update(gameRef, {
      board: newBoard,
      players: updatedPlayers,
      currentPlayerIndex: nextIndex,
      winner: isWinner ? playerId : null,
      status: isWinner ? 'finished' : 'playing',
    });

    transaction.update(handRef, { cards: newCards });
  });
}

export async function passMove(gameId: string, playerId: string): Promise<void> {
  const gameRef = doc(db, GAMES, gameId);
  const gameDoc = await getDoc(gameRef);
  if (!gameDoc.exists()) throw new Error('Game not found');

  const game = gameDoc.data() as GameState;
  if (game.players[game.currentPlayerIndex].id !== playerId) throw new Error('Not your turn');

  const nextIndex = (game.currentPlayerIndex + 1) % game.players.length;
  await updateDoc(gameRef, { currentPlayerIndex: nextIndex });
}

export async function leaveGame(gameId: string, playerId: string): Promise<void> {
  const gameRef = doc(db, GAMES, gameId);
  const gameDoc = await getDoc(gameRef);
  if (!gameDoc.exists()) return;

  const game = gameDoc.data() as GameState;
  if (game.status !== 'waiting') return;

  const remaining = game.players.filter(p => p.id !== playerId);
  if (remaining.length === 0) {
    await deleteDoc(gameRef);
    return;
  }

  const updated = remaining.map((p, i) => (i === 0 ? { ...p, isHost: true } : p));
  await updateDoc(gameRef, { players: updated, hostId: updated[0].id });
}

export function subscribeToGame(gameId: string, callback: (game: GameState) => void): Unsubscribe {
  return onSnapshot(doc(db, GAMES, gameId), (snap) => {
    if (snap.exists()) callback(snap.data() as GameState);
  });
}

export function subscribeToHand(gameId: string, playerId: string, callback: (cards: Card[]) => void): Unsubscribe {
  return onSnapshot(doc(db, GAMES, gameId, HANDS, playerId), (snap) => {
    if (snap.exists()) callback((snap.data() as Hand).cards);
  });
}
