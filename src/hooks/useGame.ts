import { useEffect, useState, useCallback } from 'react';
import { GameState, Card } from '../types/game';
import {
  subscribeToGame,
  subscribeToHand,
  playCard as playCardService,
  passMove as passMoveService,
} from '../firebase/gameService';

export function useGame(gameId: string | null, playerId: string | null) {
  const [game, setGame] = useState<GameState | null>(null);
  const [hand, setHand] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) return;
    const unsub = subscribeToGame(gameId, setGame);
    return unsub;
  }, [gameId]);

  useEffect(() => {
    if (!gameId || !playerId) return;
    const unsub = subscribeToHand(gameId, playerId, setHand);
    return unsub;
  }, [gameId, playerId]);

  const playCard = useCallback(async (card: Card) => {
    if (!gameId || !playerId) return;
    try {
      setError(null);
      await playCardService(gameId, playerId, card);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [gameId, playerId]);

  const passMove = useCallback(async () => {
    if (!gameId || !playerId) return;
    try {
      setError(null);
      await passMoveService(gameId, playerId);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [gameId, playerId]);

  const isMyTurn = game
    ? game.players[game.currentPlayerIndex]?.id === playerId
    : false;

  const currentPlayer = game?.players[game.currentPlayerIndex];

  return { game, hand, error, isMyTurn, currentPlayer, playCard, passMove };
}
