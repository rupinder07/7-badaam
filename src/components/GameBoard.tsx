import { BoardState, Suit } from '../types/game';
import { suitSymbol, suitColor, cardLabel } from '../utils/cardUtils';

interface GameBoardProps {
  board: BoardState;
}

const SUITS: Suit[] = ['hearts', 'spades', 'diamonds', 'clubs'];
const ALL_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export default function GameBoard({ board }: GameBoardProps) {
  return (
    <div className="bg-felt-dark rounded-2xl p-3 shadow-inner overflow-x-auto">
      <div className="min-w-max space-y-1.5 md:space-y-2">
        {SUITS.map(suit => {
          const suitBoard = board[suit];
          const color = suitColor(suit);
          const symbol = suitSymbol(suit);

          return (
            <div key={suit} className="flex items-center gap-1">
              {/* Suit label */}
              <div className={`w-6 md:w-8 text-base md:text-xl font-bold ${color} flex-shrink-0 text-center`}>
                {symbol}
              </div>

              {/* Card cells */}
              <div className="flex gap-0.5 md:gap-1">
                {ALL_VALUES.map(value => {
                  const isPlayed = suitBoard !== null && value >= suitBoard.low && value <= suitBoard.high;
                  const isAnchor = value === 7 && suitBoard !== null;

                  return (
                    <div
                      key={value}
                      className={`
                        w-5 h-7 md:w-9 md:h-12
                        rounded md:rounded
                        flex flex-col items-center justify-center
                        text-[9px] md:text-xs font-bold border transition-all
                        ${isAnchor
                          ? `bg-yellow-400 border-yellow-600 ${color} shadow-md md:scale-105`
                          : isPlayed
                            ? `bg-white border-gray-300 ${color} shadow-sm`
                            : 'bg-felt-medium border-felt-light text-felt-light opacity-60'
                        }
                      `}
                    >
                      <span>{cardLabel(value)}</span>
                      {isPlayed && (
                        <span className="leading-none hidden md:block">{symbol}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend — desktop only */}
      <div className="hidden md:flex mt-3 gap-3 text-xs text-green-300 justify-end">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-400 inline-block" /> = 7
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
