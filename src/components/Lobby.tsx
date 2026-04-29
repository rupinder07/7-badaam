import { useState } from 'react';
import { createGame, joinGame } from '../firebase/gameService';

interface LobbyProps {
  userId: string;
  onGameReady: (gameId: string) => void;
}

export default function Lobby({ userId, onGameReady }: LobbyProps) {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'home' | 'join'>('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trimmedName = name.trim();

  async function handleCreate() {
    if (!trimmedName) return setError('Enter your name first');
    setLoading(true);
    setError('');
    try {
      const gameId = await createGame(userId, trimmedName);
      onGameReady(gameId);
    } catch {
      setError('Failed to create game. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!trimmedName) return setError('Enter your name first');
    if (!roomCode.trim()) return setError('Enter a room code');
    setLoading(true);
    setError('');
    try {
      const result = await joinGame(roomCode.trim(), userId, trimmedName);
      if (result.success) {
        onGameReady(roomCode.trim().toUpperCase());
      } else {
        setError(result.error || 'Could not join game');
      }
    } catch {
      setError('Failed to join. Check the code and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-felt-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🃏</div>
          <h1 className="text-4xl font-bold text-gray-900">7 Badaam</h1>
          <p className="text-gray-500 mt-1">The classic card game</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {mode === 'join' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
                placeholder="e.g. AB3X7"
                maxLength={5}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 uppercase font-mono tracking-widest text-center text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {mode === 'home' ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Create Game'}
              </button>
              <button
                onClick={() => { setMode('join'); setError(''); }}
                className="py-3 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors"
              >
                Join Game
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => { setMode('home'); setError(''); }}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleJoin}
                disabled={loading}
                className="py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Join'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>2–6 players · Starts with 7 of Hearts ♥</p>
        </div>
      </div>
    </div>
  );
}
