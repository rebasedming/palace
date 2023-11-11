import { AnimatedSprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useMovement } from "./useMovements";
import { START } from "./Game";
import { useEffect } from "react";

export const Player = ({
  map,
  setPlayerPrizePos,
}: {
  map: number[][];
  setPlayerPrizePos: (pos: { x: number; y: number } | null) => void;
}) => {
  const { x, y, currentAnimation, animatedSpriteRef, playerPrizePos } =
    useMovement({
      initialX: 450,
      initialY: 450,
      map,
    });

  useEffect(() => {
    setPlayerPrizePos(playerPrizePos);
  }, [playerPrizePos]);

  return (
    <AnimatedSprite
      isPlaying={true}
      textures={currentAnimation}
      animationSpeed={0.2}
      x={x}
      y={y}
      ref={animatedSpriteRef}
      initialFrame={0}
      anchor={new PIXI.Point(0.5, 0.5)}
    />
  );
};
