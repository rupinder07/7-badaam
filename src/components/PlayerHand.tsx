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
    <div className="bg-felt-medium rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-lg">
          Your Hand
          <span className="ml-2 text-green-300 text-sm font-normal">({hand.length} cards)</span>
        </h3>
        {isMyTurn && (
          <div className="flex items-center gap-3">
            {canPass ? (
              <button
                onClick={onPass}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow"
              >
                Pass (no valid moves)
              </button>
            ) : (
              <span className="text-yellow-300 text-sm font-medium animate-pulse">
                Your turn — play a card
              </span>
            )}
          </div>
        )}
        {!isMyTurn && (
          <span className="text-green-300 text-sm">Waiting for your turn...</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 min-h-20">
        {sorted.map((card, idx) => {
          const valid = isMyTurn && isValidMove(card, board);
          return (
            <CardTile
              key={`${card.suit}-${card.value}-${idx}`}
              card={card}
              isValid={valid}
              onClick={() => onPlayCard(card)}
              size="lg"
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
