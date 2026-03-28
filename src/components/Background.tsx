import React from 'react';
import { useGameStore } from '../store/gameStore';

const Background: React.FC = () => {
  const { climbCount } = useGameStore();
  
  // 올라갈수록 배경이 하강하는 효과 (패럴렉스)
  // 멀리 있는 배경일수록 천천히 움직이게 설정
  const skyOffset = climbCount * 2;
  const cityOffset = climbCount * 8;

  return (
    <div className="absolute inset-0 z-0 bg-[#1a1a2e] overflow-hidden">
      {/* 도시 배경 레이어 */}
      <div 
        className="absolute inset-0 w-full h-[300%] bg-repeat-y pixelated opacity-80"
        style={{ 
          backgroundImage: `url('/src/assets/bg_city.png')`,
          backgroundSize: '100% 100vh',
          transform: `translateY(${cityOffset}px)`,
          transition: 'transform 0.15s ease-out'
        }}
      />
      
      {/* 어두운 오버레이로 캐릭터 가독성 확보 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none" />
    </div>
  );
};

export default Background;
