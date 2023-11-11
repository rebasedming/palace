import { useTick } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { AnimatedSprite as PixiAnimatedSprite } from "@pixi/sprite-animated";

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
}: {
  initialX: number;
  initialY: number;
}) => {
  const [moveY, setMoveY] = useState<"none" | "up" | "down">("none");
  const [moveX, setMoveX] = useState<"none" | "left" | "right">("none");
  const [speedY, setSpeedY] = useState(0);
  const [speedX, setSpeedX] = useState(0);
  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);

  const [currentAnimation, setCurrentAnimation] = useState<
    PIXI.Texture<PIXI.Resource>[]
  >(animations.leftRun);

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
    setY((y) => y + speedY);

    if (moveX === "left") {
      setSpeedX((x) => x + (-maxSpeed - x) / accelInterop);
    } else if (moveX === "right") {
      setSpeedX((x) => x + (maxSpeed - x) / accelInterop);
    } else {
      setSpeedX((x) => x * (1 - friction));
    }
    setX((x) => x + speedX);
  });

  return {
    currentAnimation,
    x,
    y,
    animatedSpriteRef,
  };
};
