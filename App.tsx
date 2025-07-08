
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, Coordinates, GameState } from './types';
import { GRID_SIZE, START_SPEED, MIN_SPEED, SPEED_INCREMENT, HIGH_SCORE_KEY } from './constants';
import { useInterval } from './hooks/useInterval';
import TouchControls from './components/TouchControls';
import GameOverModal from './components/GameOverModal';

const generateInitialSnake = (): Coordinates[] => [
  { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) },
  { x: Math.floor(GRID_SIZE / 2) - 1, y: Math.floor(GRID_SIZE / 2) },
  { x: Math.floor(GRID_SIZE / 2) - 2, y: Math.floor(GRID_SIZE / 2) },
];

const generateFood = (snake: Coordinates[]): Coordinates => {
  let foodPosition: Coordinates;
  while (true) {
    foodPosition = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y)) {
      break;
    }
  }
  return foodPosition;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [snake, setSnake] = useState<Coordinates[]>(generateInitialSnake);
  const [food, setFood] = useState<Coordinates>(() => generateFood(generateInitialSnake()));
  const direction = useRef<Direction>(Direction.RIGHT);
  const [speed, setSpeed] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
      if (typeof window === 'undefined') return 0;
      const savedScore = localStorage.getItem(HIGH_SCORE_KEY);
      return savedScore ? parseInt(savedScore, 10) : 0;
  });
  
  const startGame = () => {
    const initialSnake = generateInitialSnake();
    setSnake(initialSnake);
    direction.current = Direction.RIGHT;
    setFood(generateFood(initialSnake));
    setScore(0);
    setSpeed(START_SPEED);
    setGameState(GameState.PLAYING);
  };

  const handleDirectionChange = useCallback((newDirection: Direction) => {
    const isOpposite = (dir1: Direction, dir2: Direction) => {
        return (
            (dir1 === Direction.UP && dir2 === Direction.DOWN) ||
            (dir1 === Direction.DOWN && dir2 === Direction.UP) ||
            (dir1 === Direction.LEFT && dir2 === Direction.RIGHT) ||
            (dir1 === Direction.RIGHT && dir2 === Direction.LEFT)
        );
    };

    if (gameState === GameState.PLAYING && !isOpposite(direction.current, newDirection)) {
        direction.current = newDirection;
    }
  }, [gameState]);

  const runGame = useCallback(() => {
    setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        switch (direction.current) {
            case Direction.UP: head.y -= 1; break;
            case Direction.DOWN: head.y += 1; break;
            case Direction.LEFT: head.x -= 1; break;
            case Direction.RIGHT: head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            setGameState(GameState.GAME_OVER);
            setSpeed(null);
            return prevSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
            if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
                setGameState(GameState.GAME_OVER);
                setSpeed(null);
                return prevSnake;
            }
        }

        newSnake.unshift(head);
        
        // Food collision
        if (head.x === food.x && head.y === food.y) {
            setScore(s => s + 10);
            setFood(generateFood(newSnake));
            setSpeed(s => Math.max(MIN_SPEED, s! - SPEED_INCREMENT));
        } else {
            newSnake.pop();
        }
        
        return newSnake;
    });
  }, [food]);

  useEffect(() => {
    if (gameState === GameState.GAME_OVER) {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem(HIGH_SCORE_KEY, score.toString());
        }
    }
  }, [gameState, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameState === GameState.START && e.key === 'Enter') {
            startGame();
            return;
        }

        let newDirection: Direction | null = null;
        switch (e.key) {
            case 'ArrowUp': case 'w': newDirection = Direction.UP; break;
            case 'ArrowDown': case 's': newDirection = Direction.DOWN; break;
            case 'ArrowLeft': case 'a': newDirection = Direction.LEFT; break;
            case 'ArrowRight': case 'd': newDirection = Direction.RIGHT; break;
        }
        if (newDirection !== null) {
            e.preventDefault();
            handleDirectionChange(newDirection);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirectionChange, gameState]);

  useInterval(runGame, speed);

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center font-mono overflow-hidden relative touch-none">
      <div className="absolute top-4 left-4 text-slate-400 text-lg">СЧЕТ: <span className="text-cyan-300 font-bold">{score}</span></div>
      <div className="absolute top-4 right-4 text-slate-400 text-lg">ЛУЧШИЙ: <span className="text-yellow-400 font-bold">{highScore}</span></div>
      
      <div 
        className="relative bg-slate-800/50 border-2 border-cyan-900/50 shadow-lg shadow-cyan-500/10"
        style={{
          width: 'min(calc(100vw - 2rem), calc(100vh - 10rem))',
          height: 'min(calc(100vw - 2rem), calc(100vh - 10rem))',
          maxWidth: '600px',
          maxHeight: '600px',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
        aria-label="Игровое поле"
      >
        {gameState === GameState.START && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-30 animate-fade-in" role="dialog">
            <h1 className="text-6xl md:text-8xl font-bold text-cyan-400 tracking-widest" style={{textShadow: '0 0 15px #22d3ee, 0 0 25px #22d3ee'}}>НЕОНОВАЯ</h1>
            <h1 className="text-6xl md:text-8xl font-bold text-cyan-400 tracking-widest mb-8" style={{textShadow: '0 0 15px #22d3ee, 0 0 25px #22d3ee'}}>ЗМЕЙКА</h1>
            <button 
              onClick={startGame}
              className="bg-cyan-500 text-slate-900 font-bold py-3 px-8 rounded-lg text-xl hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 animate-start-pulse"
            >
              Начать игру
            </button>
          </div>
        )}

        {gameState === GameState.GAME_OVER && (
          <GameOverModal score={score} highScore={highScore} onRestart={startGame} />
        )}
        
        {gameState !== GameState.START && snake.map((segment, index) => (
            <div 
                key={`${segment.x}-${segment.y}-${index}`}
                className="transition-all duration-100 ease-linear"
                style={{
                    gridColumn: segment.x + 1,
                    gridRow: segment.y + 1,
                    backgroundColor: index === 0 ? '#67e8f9' : '#06b6d4',
                    boxShadow: index === 0 ? '0 0 10px #67e8f9, 0 0 5px #06b6d4' : '0 0 5px #06b6d4',
                    borderRadius: '20%',
                    transform: `scale(${1.1 - (index / snake.length) * 0.5})`,
                    opacity: 1 - (index / (snake.length + 5))
                }}
                aria-label={index === 0 ? 'Голова змеи' : 'Сегмент змеи'}
            />
        ))}

        {gameState !== GameState.START && (
          <div
              className="rounded-full animate-food-pulse"
              style={{
                  gridColumn: food.x + 1,
                  gridRow: food.y + 1,
                  backgroundColor: '#f87171',
              }}
              aria-label="Еда"
          />
        )}
      </div>

      <TouchControls onDirectionChange={handleDirectionChange} className={gameState === GameState.PLAYING ? 'animate-fade-in' : 'opacity-0 pointer-events-none'} />
    </div>
  );
};

export default App;