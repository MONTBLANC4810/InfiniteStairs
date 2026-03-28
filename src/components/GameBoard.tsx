import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Direction } from '../store/gameStore';
import Player from './Player';
import StairsRender from './StairsRender';
import Background from './Background';

const GameBoard: React.FC = () => {
  const { climb, playerDirection, climbCount, status, combo, shake, fever } = useGameStore();
  const [lastAction, setLastAction] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;

      if (e.key === 'ArrowLeft' || e.key === 'z') {
        climb(playerDirection);
        setLastAction('CLIMB');
        setTimeout(() => setLastAction(null), 100);
      } else if (e.key === 'ArrowRight' || e.key === 'x') {
        const nextDir: Direction = playerDirection === 1 ? 0 : 1;
        climb(nextDir);
        setLastAction('TURN');
        setTimeout(() => setLastAction(null), 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, climb, playerDirection]);

  // 부드러운 카메라 오프셋 계산 (Lerp 느낌)
  const cameraOffset = climbCount * 40;

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-300 ${shake ? 'animate-shake' : ''} ${fever ? 'fever-mode scale-[1.02]' : ''}`}
    >
      <Background />
      
      {/* 게임 전체 뷰포트 - 카메라 이동 반영 */}
      <div 
        className="relative z-10 w-full h-full transition-transform duration-200 ease-out"
        style={{ transform: `translateY(${cameraOffset}px)` }}
      >
        <div className="absolute top-[60vh] left-1/2 -translate-x-1/2">
          <StairsRender />
          <Player />
        </div>
      </div>

      {/* 콤보 강조 연출 */}
      {combo > 0 && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none">
          <div className={`combo-text flex flex-col items-center drop-shadow-[0_0_20px_rgba(255,255,0,0.4)]`}>
            <span className="text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-300 to-orange-500 leading-none">
              {combo}
            </span>
            <span className="text-2xl font-black text-white px-4 py-1 bg-yellow-600/80 rounded-full mt-2 tracking-widest skew-x-[-15deg]">
              COMBO
            </span>
          </div>
          {fever && (
            <div className="text-center text-red-500 font-black text-3xl animate-pulse italic mt-4 tracking-tighter">
              READY FOR ACTION!
            </div>
          )}
        </div>
      )}

      {/* 조작 가이드 오버레이 */}
      <div className="absolute bottom-12 w-full max-w-lg px-8 flex justify-between z-40 opacity-80">
        <div className={`relative flex-1 flex flex-col items-center transition-all ${lastAction === 'CLIMB' ? 'scale-110 -translate-y-2' : ''}`}>
          <div className="w-16 h-16 rounded-2xl bg-black/60 border-4 border-white/20 flex items-center justify-center mb-2 shadow-2xl backdrop-blur-md">
            <span className="text-2xl font-bold">Z</span>
          </div>
          <span className="text-[10px] font-black tracking-widest text-slate-400">CLIMB</span>
        </div>
        
        <div className={`relative flex-1 flex flex-col items-center transition-all ${lastAction === 'TURN' ? 'scale-110 -translate-y-2' : ''}`}>
          <div className="w-16 h-16 rounded-2xl bg-black/60 border-4 border-white/20 flex items-center justify-center mb-2 shadow-2xl backdrop-blur-md">
            <span className="text-2xl font-bold">X</span>
          </div>
          <span className="text-[10px] font-black tracking-widest text-slate-400">TURN</span>
        </div>
      </div>
      
      {/* 하단 페이드 아웃 효과 */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-30" />
    </div>
  );
};

export default GameBoard;
