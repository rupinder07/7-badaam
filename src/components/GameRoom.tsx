import { useGame } from '../hooks/useGame';
import GameBoard from './GameBoard';
import PlayerHand from './PlayerHand';
import PlayerList from './PlayerList';

interface GameRoomProps {
  gameId: string;
  myId: string;
  onLeave: () => void;
}

export default function GameRoom({ gameId, myId, onLeave }: GameRoomProps) {
  const { game, hand, error, isMyTurn, currentPlayer, playCard, passMove } = useGame(gameId, myId);

  if (!game) {
    return (
      <div className="min-h-screen bg-felt-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  if (game.status === 'finished') {
    const winner = game.players.find(p => p.id === game.winner);
    const iWon = game.winner === myId;

    return (
      <div className="min-h-screen bg-felt-dark flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 text-center max-w-md w-full">
          <div className="text-5xl md:text-6xl mb-3">{iWon ? '🏆' : '🃏'}</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {iWon ? 'You Won!' : `${winner?.name ?? 'Someone'} Won!`}
          </h2>
          <p className="text-gray-500 mb-6 text-sm md:text-base">
            {iWon ? 'You played all your cards first. Well done!' : 'Better luck next time!'}
          </p>
          <div className="mb-6">
            <h3 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Final Standings</h3>
            {[...game.players].sort((a, b) => a.cardCount - b.cardCount).map((p, i) => (
              <div key={p.id} className={`flex items-center justify-between px-3 py-2 rounded-lg mb-1 text-sm ${p.id === game.winner ? 'bg-yellow-50 font-bold' : 'bg-gray-50'}`}>
                <span>#{i + 1} {p.name}{p.id === myId ? ' (you)' : ''}</span>
                <span className="text-gray-500">{p.cardCount} left</span>
              </div>
            ))}
          </div>
          <button
            onClick={onLeave}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
          >
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-felt-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-felt-dark border-b border-felt-medium px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-white font-bold text-base leading-tight hidden sm:block">7 Badaam</h1>
          <span className="text-green-300 text-xs font-mono bg-felt-medium px-2 py-0.5 rounded">
            {gameId}
          </span>
        </div>

        <div className="flex-1 text-center">
          {currentPlayer && (
            <span className={`text-xs md:text-sm font-semibold ${isMyTurn ? 'text-yellow-300' : 'text-green-300'}`}>
              {isMyTurn ? 'Your turn!' : `${currentPlayer.name}'s turn`}
            </span>
          )}
        </div>

        <button onClick={onLeave} className="text-gray-400 hover:text-white text-sm flex-shrink-0 transition-colors">
          Leave
        </button>
      </header>

      {/* Body — column on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row flex-1 gap-3 p-3 overflow-y-auto">

        {/* Main column */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <GameBoard board={game.board} />

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Player list inline on mobile only */}
          <div className="md:hidden">
            <PlayerList
              players={game.players}
              currentPlayerIndex={game.currentPlayerIndex}
              myId={myId}
              winner={game.winner}
              compact
            />
          </div>

          <PlayerHand
            hand={hand}
            board={game.board}
            isMyTurn={isMyTurn}
            onPlayCard={playCard}
            onPass={passMove}
          />
        </div>

        {/* Sidebar on desktop only */}
        <div className="hidden md:block w-48 flex-shrink-0">
          <PlayerList
            players={game.players}
            currentPlayerIndex={game.currentPlayerIndex}
            myId={myId}
            winner={game.winner}
          />
        </div>
      </div>
    </div>
  );
}
