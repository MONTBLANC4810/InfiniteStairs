import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Direction } from '../store/gameStore';
import Player from './Player';
import StairsRender from './StairsRender';

const GameBoard: React.FC = () => {
  const { climb, playerDirection, climbCount, status } = useGameStore();

  // 현재 밟고 있는 계단의 방향 (플레이어가 바라보는 방향 결정에 중요)
  // 무한의 계단 조작 로직:
  // - [왼쪽 화살표]: 현재 방향 유지하며 한 칸 이동
  // - [오른쪽 화살표]: 현재 방향의 반대 방향으로 전환하며 한 칸 이동
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;

      if (e.key === 'ArrowLeft') {
        // 현재 방향 유지하며 오르기
        climb(playerDirection); 
      } else if (e.key === 'ArrowRight') {
        // 방향 전환하며 오르기
        const nextDir: Direction = playerDirection === 1 ? 0 : 1;
        climb(nextDir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, climb, playerDirection]);

  // 카메라(화면 전체) 이동 효과
  // 플레이어가 올라갈수록 배경(계단들)이 아래로 내려와야 함
  const cameraOffset = climbCount * 40; // 한 칸당 40px 이동

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div 
        className="relative transition-transform duration-150 ease-out"
        style={{ transform: `translateY(${cameraOffset}px)` }}
      >
        <StairsRender />
        <Player />
      </div>
    </div>
  );
};

export default GameBoard;
