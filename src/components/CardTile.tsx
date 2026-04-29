import { Card } from '../types/game';
import { cardLabel, suitSymbol, suitColor } from '../utils/cardUtils';

interface CardTileProps {
  card: Card;
  onClick?: () => void;
  isValid?: boolean;
  isSelected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CardTile({ card, onClick, isValid, isSelected, size = 'md', className = '' }: CardTileProps) {
  const sizeClasses = {
    sm: 'w-8 h-11 text-xs',
    md: 'w-12 h-16 text-sm',
    lg: 'w-14 h-20 text-base',
  };

  const colorClass = suitColor(card.suit);
  const symbol = suitSymbol(card.suit);
  const label = cardLabel(card.value);

  const interactiveClasses = onClick
    ? isValid
      ? 'cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:ring-2 hover:ring-yellow-400 transition-all'
      : 'cursor-not-allowed opacity-50'
    : '';

  const selectedClass = isSelected ? 'ring-2 ring-yellow-400 -translate-y-2' : '';

  return (
    <div
      onClick={isValid && onClick ? onClick : undefined}
      className={`
        ${sizeClasses[size]}
        bg-white rounded-lg border border-gray-300 shadow-md
        flex flex-col items-center justify-between p-1
        select-none font-bold
        ${colorClass}
        ${interactiveClasses}
        ${selectedClass}
        ${className}
      `}
    >
      <div className="self-start leading-none">
        <div className="text-inherit">{label}</div>
        <div className="text-inherit">{symbol}</div>
      </div>
      <div className="text-2xl leading-none">{symbol}</div>
      <div className="self-end rotate-180 leading-none">
        <div className="text-inherit">{label}</div>
        <div className="text-inherit">{symbol}</div>
      </div>
    </div>
  );
}
