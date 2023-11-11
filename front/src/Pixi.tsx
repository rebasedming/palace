import { BlurFilter } from "pixi.js";
import { Stage, Container, Sprite, Text, useTick } from "@pixi/react";
import { useMemo, useReducer, useRef } from "react";

export const Pixi = () => {
  const Bunny = () => {
    const [motion, update] = useReducer(
      (state: any, action: any) => action.data,
      {}
    );
    const iter = useRef(0);

    useTick((delta) => {
      const i = (iter.current += 0.05 * delta);

      update({
        type: "update",
        data: {
          x: Math.sin(i) * 100,
          y: Math.sin(i / 1.5) * 100,
          rotation: Math.sin(i) * Math.PI,
          anchor: Math.sin(i / 2),
        },
      });
    });

    return (
      <Sprite image="https://pixijs.io/pixi-react/img/bunny.png" {...motion} />
    );
  };

  return (
    <Stage width={300} height={300} options={{ backgroundAlpha: 0 }}>
      <Container x={150} y={150}>
        <Bunny />
      </Container>
    </Stage>
  );
};
