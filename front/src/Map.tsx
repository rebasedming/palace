import { Stage, Container, Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";

export const Map = ({ x, y }: { x: number; y: number }) => {
  <Container x={150 - x} y={150 - y}>
    <Sprite
      image="https://pixijs.io/pixi-react/img/bunny.png"
      x={10}
      y={20}
      anchor={new PIXI.Point(0.5, 0.5)}
    />
    <Sprite
      image="https://pixijs.io/pixi-react/img/bunny.png"
      x={30}
      y={40}
      anchor={new PIXI.Point(0.5, 0.5)}
    />
  </Container>;
};
