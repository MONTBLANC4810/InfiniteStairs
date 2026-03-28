import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Direction } from '../store/gameStore';
import Player from './Player';
import StairsRender from './StairsRender';
import Background from './Background';

const GameBoard: React.FC = () => {
  const { climb, playerDirection, climbCount, status, combo, shake, fever } = useGameStore();
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;

      if (e.key === 'ArrowLeft') {
        climb(playerDirection);
        setLastAction('CLIMB');
      } else if (e.key === 'ArrowRight') {
        const nextDir: Direction = playerDirection === 1 ? 0 : 1;
        climb(nextDir);
        setLastAction('TURN');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, climb, playerDirection]);

  // 콤보 팝업 관리
  useEffect(() => {
    if (combo > 0 && combo % 10 === 0) {
      // 10콤보마다 시각적 피드백
    }
  }, [combo]);

  const cameraOffset = climbCount * 40;

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${shake ? 'animate-shake' : ''} ${fever ? 'fever-mode' : ''}`}>
      <Background />
      
      <div 
        className="relative z-10 transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${cameraOffset}px)` }}
      >
        <StairsRender />
        <Player />
      </div>

      {/* 콤보 텍스트 레이어 */}
      {combo > 0 && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="combo-text text-6xl font-black italic text-yellow-400 tracking-tighter antialiased">
            {combo}<span className="text-2xl ml-1 text-white opacity-80">COMBO!</span>
          </div>
          {fever && (
            <div className="text-center text-red-500 font-bold text-xl animate-pulse tracking-widest mt-2">
              FEVER TIME
            </div>
          )}
        </div>
      )}

      {/* 조작 피드백 (좌우 버튼 시뮬레이션) */}
      <div className="absolute bottom-10 w-full px-10 flex justify-between opacity-50 z-40">
        <div className={`p-6 rounded-2xl bg-white/10 border-2 border-white/20 transition-all ${lastAction === 'CLIMB' ? 'scale-110 bg-white/30' : ''}`}>
          <div className="text-center text-2xl mb-1 text-white font-bold">←</div>
          <div className="text-[10px] text-white/60">CLIMB</div>
        </div>
        <div className={`p-6 rounded-2xl bg-white/10 border-2 border-white/20 transition-all ${lastAction === 'TURN' ? 'scale-110 bg-white/30' : ''}`}>
          <div className="text-center text-2xl mb-1 text-white font-bold">→</div>
          <div className="text-[10px] text-white/60">TURN</div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
