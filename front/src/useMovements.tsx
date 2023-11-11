import { useTick } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { AnimatedSprite as PixiAnimatedSprite } from "@pixi/sprite-animated";
import { COLLISION_TILE, PRIZE_TILE, SAFE_TILE, TILESIZE } from "./Game";

enum ArrowKey {
  Left = "ArrowLeft",
  Up = "ArrowUp",
  Right = "ArrowRight",
  Down = "ArrowDown",
}

const convertToTextures = (filenames: string[]) =>
  filenames.map((filename) => PIXI.Texture.from(`assets/char/${filename}.png`));

const animations = {
  frontRun: convertToTextures(["front-run-1", "front-run-2"]),
  backRun: convertToTextures(["back-run-1", "back-run-2"]),
  leftRun: convertToTextures(["left-run-1", "left-run-2"]),
  rightRun: convertToTextures(["right-run-1", "right-run-2"]),
  frontStop: convertToTextures(["front-stop"]),
  backStop: convertToTextures(["back-stop"]),
  rightStop: convertToTextures(["right-stop"]),
  leftStop: convertToTextures(["left-stop"]),
};

export const useMovement = ({
  initialX,
  initialY,
  map,
}: {
  initialX: number;
  initialY: number;
  map: number[][];
}) => {
  const [moveY, setMoveY] = useState<"none" | "up" | "down">("none");
  const [moveX, setMoveX] = useState<"none" | "left" | "right">("none");
  const [speedY, setSpeedY] = useState(0);
  const [speedX, setSpeedX] = useState(0);
  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);
  const [playerPrizePos, setPlayerPrizePos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [currentAnimation, setCurrentAnimation] = useState<
    PIXI.Texture<PIXI.Resource>[]
  >(animations.frontStop);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ArrowKey.Up:
          setMoveY("up");
          setCurrentAnimation(animations.backRun);
          break;
        case ArrowKey.Down:
          setMoveY("down");
          setCurrentAnimation(animations.frontRun);
          break;
        case ArrowKey.Left:
          setMoveX("left");
          setCurrentAnimation(animations.leftRun);
          break;
        case ArrowKey.Right:
          setMoveX("right");
          setCurrentAnimation(animations.rightRun);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case ArrowKey.Up:
          setMoveY("none");
          if (moveX === "none") {
            setCurrentAnimation(animations.backStop);
          }
          break;
        case ArrowKey.Down:
          setMoveY("none");
          if (moveX === "none") {
            setCurrentAnimation(animations.frontStop);
          }
          break;
        case ArrowKey.Left:
          setMoveX("none");
          if (moveY === "none") {
            setCurrentAnimation(animations.leftStop);
          }
          break;
        case ArrowKey.Right:
          setMoveX("none");
          if (moveY === "none") {
            setCurrentAnimation(animations.rightStop);
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [moveX, moveY]);

  // Make sure animation plays after swapping.
  useEffect(() => {
    animatedSpriteRef.current?.gotoAndPlay(0);
  }, [currentAnimation]);

  const animatedSpriteRef = useRef<PixiAnimatedSprite | null>(null);

  useTick((delta) => {
    const maxSpeed = 5 * delta;
    const accelInterop = 10;
    const friction = 0.25;

    if (moveY === "up") {
      setSpeedY((y) => y + (-maxSpeed - y) / accelInterop);
    } else if (moveY === "down") {
      setSpeedY((y) => y + (maxSpeed - y) / accelInterop);
    } else {
      setSpeedY((y) => y * (1 - friction));
    }

    if (moveX === "left") {
      setSpeedX((x) => x + (-maxSpeed - x) / accelInterop);
    } else if (moveX === "right") {
      setSpeedX((x) => x + (maxSpeed - x) / accelInterop);
    } else {
      setSpeedX((x) => x * (1 - friction));
    }

    // Collision detection
    const newY = y + speedY;
    const newX = x + speedX;
    const oldTileY = Math.floor(y / TILESIZE);
    const oldTileX = Math.floor(x / TILESIZE);
    const newTileY = Math.floor(newY / TILESIZE);
    const newTileX = Math.floor(newX / TILESIZE);

    if (map[oldTileY][oldTileX] === PRIZE_TILE) {
      console.log("bruh");
      setPlayerPrizePos({ x: oldTileX, y: oldTileY });
    } else {
      console.log("yoink");
      setPlayerPrizePos(null);
    }

    if (map[oldTileY][newTileX] !== COLLISION_TILE) {
      setX(newX);
    } else {
      // If hit wall, reset momentum.
      setSpeedX(0);
    }
    if (map[newTileY][oldTileX] !== COLLISION_TILE) {
      setY(newY);
    } else {
      // If hit wall, reset momentum.
      setSpeedY(0);
    }
  });

  return {
    currentAnimation,
    x,
    y,
    animatedSpriteRef,
    playerPrizePos,
  };
};
