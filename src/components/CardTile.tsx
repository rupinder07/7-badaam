import { Card } from '../types/game';
import { cardLabel, suitSymbol, suitColor } from '../utils/cardUtils';

interface CardTileProps {
  card: Card;
  onClick?: () => void;
  isValid?: boolean;
  isSelected?: boolean;
  className?: string;
}

export default function CardTile({ card, onClick, isValid, isSelected, className = '' }: CardTileProps) {
  const colorClass = suitColor(card.suit);
  const symbol = suitSymbol(card.suit);
  const label = cardLabel(card.value);

  const interactiveClasses = onClick
    ? isValid
      ? 'cursor-pointer active:scale-95 hover:-translate-y-2 hover:shadow-xl hover:ring-2 hover:ring-yellow-400 transition-all touch-manipulation'
      : 'cursor-not-allowed opacity-40'
    : '';

  const selectedClass = isSelected ? 'ring-2 ring-yellow-400 -translate-y-2' : '';

  return (
    <div
      onClick={isValid && onClick ? onClick : undefined}
      className={`
        w-10 h-14 md:w-12 md:h-16 text-xs md:text-sm
        bg-white rounded-lg border border-gray-300 shadow-md
        flex flex-col items-center justify-between p-0.5 md:p-1
        select-none font-bold
        ${colorClass}
        ${interactiveClasses}
        ${selectedClass}
        ${className}
      `}
    >
      <div className="self-start leading-none">
        <div>{label}</div>
        <div className="text-[10px] md:text-xs leading-none">{symbol}</div>
      </div>
      <div className="text-lg md:text-2xl leading-none">{symbol}</div>
      <div className="self-end rotate-180 leading-none">
        <div>{label}</div>
        <div className="text-[10px] md:text-xs leading-none">{symbol}</div>
      </div>
    </div>
  );
}
