import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Lobby from './components/Lobby';
import WaitingRoom from './components/WaitingRoom';
import GameRoom from './components/GameRoom';
import { useGame } from './hooks/useGame';

function GameWrapper({ gameId, myId, onLeave }: {
  gameId: string;
  myId: string;
  onLeave: () => void;
}) {
  const { game } = useGame(gameId, myId);

  if (!game) return (
    <div className="min-h-screen bg-felt-dark flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  );

  if (game.status === 'waiting') {
    return <WaitingRoom game={game} myId={myId} onLeave={onLeave} />;
  }

  return <GameRoom gameId={gameId} myId={myId} onLeave={onLeave} />;
}

export default function App() {
  const { user, loading } = useAuth();
  const [gameId, setGameId] = useState<string | null>(null);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-felt-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (gameId) {
    return (
      <GameWrapper
        gameId={gameId}
        myId={user.uid}
        onLeave={() => setGameId(null)}
      />
    );
  }

  return (
    <Lobby
      userId={user.uid}
      onGameReady={(id) => setGameId(id)}
    />
  );
}
