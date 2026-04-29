import { Player } from '../types/game';

interface PlayerListProps {
  players: Player[];
  currentPlayerIndex: number;
  myId: string;
  winner?: string | null;
  compact?: boolean; // horizontal strip for mobile
}

export default function PlayerList({ players, currentPlayerIndex, myId, winner, compact }: PlayerListProps) {
  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {players.map((player, index) => {
          const isCurrent = index === currentPlayerIndex && !winner;
          const isMe = player.id === myId;
          const isWinner = winner === player.id;

          return (
            <div
              key={player.id}
              className={`
                flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium
                ${isWinner
                  ? 'bg-yellow-400 text-gray-900'
                  : isCurrent
                    ? 'bg-green-600 text-white ring-2 ring-green-300'
                    : 'bg-felt-medium text-gray-300'
                }
              `}
            >
              <span className="truncate max-w-[70px]">
                {isWinner && '🏆 '}
                {player.name}
                {isMe ? ' ★' : ''}
              </span>
              <span className="font-mono opacity-75">{player.cardCount} cards</span>
            </div>
          );
        })}
      </div>
    );
  }

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
              <span className="text-sm truncate max-w-[90px]">
                {player.name}
                {isMe && <span className="ml-1 text-xs opacity-75">(you)</span>}
                {player.isHost && !isMe && <span className="ml-1 text-xs opacity-75">👑</span>}
              </span>
            </div>
            <span className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded flex-shrink-0">
              {player.cardCount}
            </span>
          </div>
        );
      })}
    </div>
  );
}
