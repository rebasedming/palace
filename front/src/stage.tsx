import { Stage as PixiStage, Container, Sprite } from "@pixi/react";
import { useState, useEffect } from "react";
import * as PIXI from "pixi.js";

enum ArrowKey {
  Left = "ArrowLeft",
  Up = "ArrowUp",
  Right = "ArrowRight",
  Down = "ArrowDown",
}

const Stage = () => {
  const [spritePosition, setSpritePosition] = useState({ x: 100, y: 100 });
  const moveAmount = 5;

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case ArrowKey.Up:
          setSpritePosition((prev) => ({ ...prev, y: prev.y - moveAmount }));
          break;
        case ArrowKey.Down:
          setSpritePosition((prev) => ({ ...prev, y: prev.y + moveAmount }));
          break;
        case ArrowKey.Left:
          setSpritePosition((prev) => ({ ...prev, x: prev.x - moveAmount }));
          break;
        case ArrowKey.Right:
          setSpritePosition((prev) => ({ ...prev, x: prev.x + moveAmount }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <PixiStage width={300} height={300} options={{ backgroundAlpha: 0 }}>
      <Container x={150} y={150}>
        <Sprite
          image="https://pixijs.io/pixi-react/img/bunny.png"
          x={spritePosition.x}
          y={spritePosition.y}
          anchor={new PIXI.Point(0.5, 0.5)}
        />
      </Container>
    </PixiStage>
  );
};

export { Stage };
