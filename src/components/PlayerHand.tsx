import { Card, BoardState } from '../types/game';
import { isValidMove, sortHand, hasValidMove } from '../utils/cardUtils';
import CardTile from './CardTile';

interface PlayerHandProps {
  hand: Card[];
  board: BoardState;
  isMyTurn: boolean;
  onPlayCard: (card: Card) => void;
  onPass: () => void;
}

export default function PlayerHand({ hand, board, isMyTurn, onPlayCard, onPass }: PlayerHandProps) {
  const sorted = sortHand(hand);
  const canPass = isMyTurn && !hasValidMove(hand, board);

  return (
    <div className="bg-felt-medium rounded-2xl p-3 md:p-4">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-white font-bold text-base md:text-lg">
          Your Hand
          <span className="ml-2 text-green-300 text-sm font-normal">({hand.length})</span>
        </h3>

        {isMyTurn && (
          canPass ? (
            <button
              onClick={onPass}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow text-sm"
            >
              Pass — no valid moves
            </button>
          ) : (
            <span className="text-yellow-300 text-sm font-medium animate-pulse">
              Tap a glowing card
            </span>
          )
        )}

        {!isMyTurn && (
          <span className="text-green-300 text-xs md:text-sm">Waiting for your turn…</span>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-wrap gap-1.5 md:gap-2 min-h-16">
        {sorted.map((card, idx) => {
          const valid = isMyTurn && isValidMove(card, board);
          return (
            <CardTile
              key={`${card.suit}-${card.value}-${idx}`}
              card={card}
              isValid={valid}
              onClick={() => onPlayCard(card)}
            />
          );
        })}
        {hand.length === 0 && (
          <p className="text-green-300 text-sm italic">No cards left!</p>
        )}
      </div>
    </div>
  );
}
