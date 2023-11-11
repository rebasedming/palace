import { AnimatedSprite } from "@pixi/react";
import { useMovement } from "./useMovements";

export const Player = () => {
  const { x, y, currentAnimation, animatedSpriteRef } = useMovement({
    initialX: 200,
    initialY: 200,
  });

  return (
    <AnimatedSprite
      isPlaying={true}
      textures={currentAnimation}
      animationSpeed={0.2}
      x={x}
      y={y}
      ref={animatedSpriteRef}
      initialFrame={0}
    />
  );
};
