import { GameState } from '../types/game';
import { startGame, leaveGame } from '../firebase/gameService';
import { useState } from 'react';

interface WaitingRoomProps {
  game: GameState;
  myId: string;
  onLeave: () => void;
}

export default function WaitingRoom({ game, myId, onLeave }: WaitingRoomProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isHost = game.hostId === myId;

  async function handleStart() {
    setLoading(true);
    setError('');
    try {
      await startGame(game.id);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  async function handleLeave() {
    await leaveGame(game.id, myId);
    onLeave();
  }

  return (
    <div className="min-h-screen bg-felt-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🃏</div>
          <h2 className="text-2xl font-bold text-gray-900">Waiting Room</h2>
          <div className="mt-3 bg-gray-100 rounded-xl px-6 py-3 inline-block">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Room Code</p>
            <p className="text-3xl font-mono font-bold text-gray-900 tracking-widest">{game.id}</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">Share this code with friends</p>
        </div>

        <div className="space-y-2 mb-6">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Players ({game.players.length}/6)</h3>
          {game.players.map(player => (
            <div key={player.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-medium text-gray-800">{player.name}</span>
              {player.id === myId && <span className="text-xs text-gray-400">(you)</span>}
              {player.isHost && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full ml-auto">Host</span>}
            </div>
          ))}
        </div>

        {error && <p className="text-red-600 text-sm text-center mb-3">{error}</p>}

        {isHost ? (
          <button
            onClick={handleStart}
            disabled={loading || game.players.length < 2}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Starting...' : game.players.length < 2 ? 'Need at least 2 players' : 'Start Game'}
          </button>
        ) : (
          <p className="text-center text-gray-500 text-sm">Waiting for the host to start...</p>
        )}

        <button
          onClick={handleLeave}
          className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
