import { AnimatedSprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useMovement } from "./useMovements";
import { START } from "./Game";

export const Player = ({ map }: { map: number[][] }) => {
  const { x, y, currentAnimation, animatedSpriteRef } = useMovement({
    initialX: 400,
    initialY: 400,
    map,
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
      anchor={new PIXI.Point(2, 1.5)}
    />
  );
};
