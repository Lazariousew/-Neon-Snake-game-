
import React from 'react';
import { useEffect, useState } from 'react';
import { getSnakeFunFact } from '../services/geminiService';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, highScore, onRestart }) => {
  const [funFact, setFunFact] = useState<string>('Вызываю забавный факт...');

  useEffect(() => {
    let isMounted = true;
    const fetchFact = async () => {
      const fact = await getSnakeFunFact();
      if (isMounted) {
        setFunFact(fact);
      }
    };
    fetchFact();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-30 animate-fade-in">
      <div className="bg-slate-800/80 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8 w-full max-w-md text-center flex flex-col items-center gap-4 transform scale-95 animate-scale-in">
        <h2 className="text-5xl font-bold text-red-500 tracking-wider">ИГРА ОКОНЧЕНА</h2>
        
        <div className="flex justify-around w-full mt-4 text-lg">
          <div className="flex flex-col">
            <span className="text-slate-400 text-sm">СЧЕТ</span>
            <span className="text-cyan-300 text-4xl font-bold">{score}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-sm">ЛУЧШИЙ СЧЕТ</span>
            <span className="text-yellow-400 text-4xl font-bold">{highScore}</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700 w-full min-h-[6rem] flex items-center justify-center">
          <p className="text-slate-300 italic text-sm">
            {funFact}
          </p>
        </div>

        <button 
          onClick={onRestart}
          className="mt-6 bg-cyan-500 text-slate-900 font-bold py-3 px-8 rounded-lg text-xl hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105"
        >
          Играть снова
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;