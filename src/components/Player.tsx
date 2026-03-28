import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import ParticleSystem from './ParticleSystem';

const Player: React.FC = () => {
  const { playerDirection, climbCount, status } = useGameStore();
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    if (climbCount > 0) {
      setIsJumping(true);
      const timer = setTimeout(() => setIsJumping(false), 100);
      return () => clearTimeout(timer);
    }
  }, [climbCount]);

  const isGameOver = status === 'gameover';
  
  return (
    <div 
      className={`absolute transition-all duration-100 ease-out z-20`}
      style={{
        bottom: '120px',
        left: '50%',
        transform: `translate(-50%, -${climbCount * 40}px) scaleX(${playerDirection === 1 ? -1 : 1})`,
        width: '80px',
        height: '80px',
      }}
    >
      {/* 쫀득한 조작감을 위한 Squash & Stretch 효과 */}
      <div 
        className={`w-full h-full bg-no-repeat bg-cover pixelated transition-transform duration-75 ${isJumping ? 'scale-y-75 scale-x-125' : 'scale-y-110'}`}
        style={{ 
          backgroundImage: `url('/src/assets/character.png')`,
          backgroundSize: '300% 100%',
          backgroundPosition: isJumping ? '50% 0%' : '0% 0%',
          mixBlendMode: 'multiply',
          filter: isGameOver ? 'grayscale(100%) brightness(0.5)' : 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))'
        }}
      />
      
      {/* 파티클 시스템 통합 */}
      <ParticleSystem active={isJumping} x={40} y={60} />
      
      {!isGameOver && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-black/20 rounded-full blur-[2px]" />}
    </div>
  );
};

export default Player;
