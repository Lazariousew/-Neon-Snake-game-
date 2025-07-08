
import React from 'react';
import { Direction } from '../types';

interface TouchControlsProps {
  onDirectionChange: (direction: Direction) => void;
  className?: string;
}

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-10 h-10 ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const ControlButton: React.FC<{
  onTouchStart: (e: React.TouchEvent) => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
}> = ({ onTouchStart, children, className, ariaLabel }) => (
  <button
    onTouchStart={onTouchStart}
    onMouseDown={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).focus(); onTouchStart(e as any); }}
    aria-label={ariaLabel}
    className={`w-20 h-20 flex items-center justify-center bg-slate-700/50 rounded-full text-cyan-300/70 active:bg-cyan-400/30 active:text-cyan-200 transition-all duration-150 backdrop-blur-sm ${className}`}
  >
    {children}
  </button>
);


const TouchControls: React.FC<TouchControlsProps> = ({ onDirectionChange, className }) => {
  return (
    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-64 grid grid-cols-3 grid-rows-3 gap-2 ${className}`}>
      <div className="col-start-2 row-start-1 flex justify-center items-center">
        <ControlButton onTouchStart={(e) => { e.preventDefault(); onDirectionChange(Direction.UP);}} ariaLabel="Вверх">
          <ArrowIcon />
        </ControlButton>
      </div>
      <div className="col-start-1 row-start-2 flex justify-center items-center">
        <ControlButton onTouchStart={(e) => { e.preventDefault(); onDirectionChange(Direction.LEFT);}} ariaLabel="Влево">
          <ArrowIcon className="transform -rotate-90" />
        </ControlButton>
      </div>
      <div className="col-start-3 row-start-2 flex justify-center items-center">
        <ControlButton onTouchStart={(e) => { e.preventDefault(); onDirectionChange(Direction.RIGHT);}} ariaLabel="Вправо">
          <ArrowIcon className="transform rotate-90" />
        </ControlButton>
      </div>
      <div className="col-start-2 row-start-3 flex justify-center items-center">
        <ControlButton onTouchStart={(e) => { e.preventDefault(); onDirectionChange(Direction.DOWN);}} ariaLabel="Вниз">
          <ArrowIcon className="transform rotate-180" />
        </ControlButton>
      </div>
    </div>
  );
};

export default TouchControls;