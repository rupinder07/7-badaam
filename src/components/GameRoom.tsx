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
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">{iWon ? '🏆' : '🃏'}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {iWon ? 'You Won!' : `${winner?.name ?? 'Someone'} Won!`}
          </h2>
          <p className="text-gray-500 mb-8">
            {iWon ? 'You played all your cards first. Well done!' : 'Better luck next time!'}
          </p>
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Final Standings</h3>
            {[...game.players].sort((a, b) => a.cardCount - b.cardCount).map((p, i) => (
              <div key={p.id} className={`flex items-center justify-between px-4 py-2 rounded-lg mb-1 ${p.id === game.winner ? 'bg-yellow-50 font-bold' : 'bg-gray-50'}`}>
                <span>#{i + 1} {p.name}{p.id === myId ? ' (you)' : ''}</span>
                <span className="text-sm text-gray-500">{p.cardCount} cards left</span>
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
      <header className="bg-felt-dark border-b border-felt-medium px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-lg">7 Badaam</h1>
          <p className="text-green-300 text-xs">Room: {gameId}</p>
        </div>
        <div className="text-center">
          {currentPlayer && (
            <div className={`text-sm font-medium ${isMyTurn ? 'text-yellow-300' : 'text-green-300'}`}>
              {isMyTurn ? 'Your turn!' : `${currentPlayer.name}'s turn`}
            </div>
          )}
        </div>
        <button onClick={onLeave} className="text-gray-400 hover:text-white text-sm transition-colors">
          Leave
        </button>
      </header>

      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <GameBoard board={game.board} />
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <PlayerHand
            hand={hand}
            board={game.board}
            isMyTurn={isMyTurn}
            onPlayCard={playCard}
            onPass={passMove}
          />
        </div>
        <div className="w-48 flex-shrink-0">
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
