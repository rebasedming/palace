import { AnimatedSprite, useTick } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useEffect, useState } from "react";

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

console.log(animations.frontRun);

export const Player = () => {
  const [moveY, setMoveY] = useState<"none" | "up" | "down">("none");
  const [moveX, setMoveX] = useState<"none" | "left" | "right">("none");
  const [speedY, setSpeedY] = useState(0);
  const [speedX, setSpeedX] = useState(0);

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
            // setSpeedX(0);
          }
          break;
        case ArrowKey.Right:
          setMoveX("none");
          if (moveY === "none") {
            setCurrentAnimation(animations.rightStop);
            // setSpeedX(0);
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

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useTick((delta) => {
    const maxSpeed = 10 * delta;
    const acceleration = 20;
    const friction = 0.25;

    if (moveY === "up") {
      setSpeedY((y) => y + (-maxSpeed - y) / acceleration);
    } else if (moveY === "down") {
      setSpeedY((y) => y + (maxSpeed - y) / acceleration);
    } else {
      setSpeedY((y) => y * (1 - friction));
    }
    setY((y) => y + speedY);

    if (moveX === "left") {
      setSpeedX((x) => x + (-maxSpeed - x) / acceleration);
    } else if (moveX === "right") {
      setSpeedX((x) => x + (maxSpeed - x) / acceleration);
    } else {
      setSpeedX((x) => x * (1 - friction));
    }
    setX((x) => x + speedX);
  });

  return (
    <AnimatedSprite
      isPlaying={true}
      textures={currentAnimation}
      animationSpeed={0.2}
      x={x}
      y={y}
    />
  );
};
