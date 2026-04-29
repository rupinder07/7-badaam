import { Player } from '../types/game';

interface PlayerListProps {
  players: Player[];
  currentPlayerIndex: number;
  myId: string;
  winner?: string | null;
}

export default function PlayerList({ players, currentPlayerIndex, myId, winner }: PlayerListProps) {
  return (
    <div className="bg-felt-dark rounded-2xl p-4 space-y-2">
      <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-3">Players</h3>
      {players.map((player, index) => {
        const isCurrent = index === currentPlayerIndex && !winner;
        const isMe = player.id === myId;
        const isWinner = winner === player.id;

        return (
          <div
            key={player.id}
            className={`
              flex items-center justify-between px-3 py-2 rounded-lg transition-all
              ${isWinner
                ? 'bg-yellow-400 text-gray-900 font-bold'
                : isCurrent
                  ? 'bg-green-600 text-white font-bold ring-2 ring-green-300'
                  : 'bg-felt-medium text-gray-200'
              }
            `}
          >
            <div className="flex items-center gap-2">
              {isCurrent && !isWinner && (
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              )}
              {isWinner && <span>🏆</span>}
              <span className="text-sm">
                {player.name}
                {isMe && <span className="ml-1 text-xs opacity-75">(you)</span>}
                {player.isHost && !isMe && <span className="ml-1 text-xs opacity-75">👑</span>}
              </span>
            </div>
            <span className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded">
              {player.cardCount} cards
            </span>
          </div>
        );
      })}
    </div>
  );
}
