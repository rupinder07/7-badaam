import { BoardState, Suit } from '../types/game';
import { suitSymbol, suitColor, cardLabel } from '../utils/cardUtils';

interface GameBoardProps {
  board: BoardState;
}

const SUITS: Suit[] = ['hearts', 'spades', 'diamonds', 'clubs'];
const ALL_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export default function GameBoard({ board }: GameBoardProps) {
  return (
    <div className="bg-felt-dark rounded-2xl p-4 shadow-inner overflow-x-auto">
      <div className="min-w-max space-y-2">
        {SUITS.map(suit => {
          const suitBoard = board[suit];
          const color = suitColor(suit);
          const symbol = suitSymbol(suit);

          return (
            <div key={suit} className="flex items-center gap-1">
              <div className={`w-8 text-xl font-bold ${color} flex-shrink-0`}>{symbol}</div>
              <div className="flex gap-1">
                {ALL_VALUES.map(value => {
                  const isPlayed = suitBoard !== null && value >= suitBoard.low && value <= suitBoard.high;
                  const isSeven = value === 7;
                  const isAnchor = isSeven && suitBoard !== null;

                  return (
                    <div
                      key={value}
                      className={`
                        w-9 h-12 rounded flex flex-col items-center justify-center text-xs font-bold border transition-all
                        ${isAnchor
                          ? `bg-yellow-400 border-yellow-600 ${color} shadow-md scale-105`
                          : isPlayed
                            ? `bg-white border-gray-300 ${color} shadow-sm`
                            : 'bg-felt-medium border-felt-light text-felt-light opacity-60'
                        }
                      `}
                    >
                      <span>{cardLabel(value)}</span>
                      {isPlayed && <span className="text-xs leading-none">{symbol}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-3 text-xs text-green-300 justify-end">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-400 inline-block" /> = 7 (anchor)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-white inline-block" /> = played
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-felt-medium inline-block border border-felt-light" /> = remaining
        </span>
      </div>
    </div>
  );
}
