import React from 'react';
import { useGameStore } from '../store/gameStore';

const Player: React.FC = () => {
  const { playerDirection, climbCount, status } = useGameStore();

  const isGameOver = status === 'gameover';
  
  // 스프라이트 시트 설정 (3개 포즈: Idle, Climb, Turn)
  // 생성된 이미지 가로가 길므로 3등분하여 보여줌
  const getSpritePos = () => {
    if (isGameOver) return '100% 0%'; // Turn 포즈를 죽었을 때 사용
    return climbCount % 2 === 0 ? '0% 0%' : '50% 0%'; // Climb 애니메이션 시뮬레이션
  };

  return (
    <div 
      className={`absolute transition-all duration-100 ease-out z-20 ${!isGameOver ? 'animate-float' : 'scale-90 opacity-50'}`}
      style={{
        bottom: '120px',
        left: '50%',
        transform: `translate(-50%, -${climbCount * 40}px) scaleX(${playerDirection === 1 ? -1 : 1})`,
        width: '80px',
        height: '80px',
        filter: isGameOver ? 'grayscale(100%) brightness(0.5)' : 'none'
      }}
    >
      <div 
        className="w-full h-full bg-no-repeat bg-cover pixelated"
        style={{ 
          backgroundImage: `url('/src/assets/character.png')`,
          backgroundSize: '300% 100%', // 3개의 스프라이트가 가로로 배열되어 있다고 가정
          backgroundPosition: getSpritePos(),
          // 흰색 배경 제거를 위한 블렌드 모드 (에셋이 흰색 배경인 경우)
          mixBlendMode: 'multiply',
          filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))'
        }}
      />
      
      {!isGameOver && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/30 rounded-full blur-[1px]" />}
    </div>
  );
};

export default Player;
