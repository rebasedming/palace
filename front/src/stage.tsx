import { Stage as PixiStage, Container, Sprite } from "@pixi/react";
import { useState, useEffect, useRef, useMemo, memo } from "react";
import * as PIXI from "pixi.js";
import className from "classnames";
import fallarbor from "../assets/maps/fallarbor.png";

const WIDTH = 100;
const HEIGHT = 100;
const SPEED = 1;
const START = [50, 50];
const TILESIZE = 10;

enum ArrowKey {
  Left = "ArrowLeft",
  Up = "ArrowUp",
  Right = "ArrowRight",
  Down = "ArrowDown",
}

const setCollisionRegion = (
  map: number[][],
  startX: number,
  startY: number,
  regionWidth: number,
  regionHeight: number
) => {
  for (let y = startY; y < startY + regionHeight; y++) {
    for (let x = startX; x < startX + regionWidth; x++) {
      if (x < WIDTH && y < HEIGHT) {
        map[y][x] = 1;
      }
    }
  }

  return map;
};

const TileMap = ({ map }: { map: number[][] }) => {
  const tileSize = 10;

  return (
    // <div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${map[0].length}, ${tileSize}px)`,
      }}
    >
      <img
        src={fallarbor}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          height: "100%",
        }}
      />

      {map.flatMap((row: number[], rowIndex: number) =>
        row.map((tile, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: tileSize,
              height: tileSize,
              backgroundColor: tile === 1 ? "red" : "green",
              opacity: 0.5,
            }}
            // on click print the coordinates
            onClick={() => console.log(rowIndex, colIndex)}
          ></div>
        ))
      )}
    </div>
    // </div>
  );
};

const Stage = () => {
  const [spritePosition, setSpritePosition] = useState({
    x: START[0],
    y: START[1],
  });
  const spritePositionRef = useRef(spritePosition);
  const map: number[][] = useMemo(() => {
    let map = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
    map = setCollisionRegion(map, 20, 20, 10, 10);
    map = setCollisionRegion(map, 0, 0, 100, 20);
    map = setCollisionRegion(map, 0, 0, 15, 30);
    return map;
  }, []);

  useEffect(() => {
    spritePositionRef.current = spritePosition;
  }, [spritePosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newX = spritePositionRef.current.x;
      let newY = spritePositionRef.current.y;

      switch (e.key) {
        case ArrowKey.Up:
          newY -= SPEED;
          break;
        case ArrowKey.Down:
          newY += SPEED;
          break;
        case ArrowKey.Left:
          newX -= SPEED;
          break;
        case ArrowKey.Right:
          newX += SPEED;
          break;
        default:
          break;
      }

      // Collision detection
      if (map[newY] && map[newY][newX] === 0) {
        setSpritePosition({ x: newX, y: newY });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative overscroll-none flex justify-center items-center h-screen">
      {/* <div className="absolute">
        <TileMap map={map} />
      </div>
      <Grid map={map} /> */}
      <PixStage spritePosition={spritePosition} />
    </div>
  );
};

const Grid = memo(({ map }: { map: number[][] }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${map[0].length}, 1px)`,
      }}
    >
      {map.flatMap((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={className(
              `w-[${TILESIZE}px] h-[${TILESIZE}px]`,
              tile === 1 ? "bg-red-500" : "bg-green-500"
            )}
          />
        ))
      )}
    </div>
  );
});
const PixStage = memo(
  ({
    spritePosition,
  }: {
    spritePosition: {
      x: number;
      y: number;
    };
  }) => {
    return (
      <PixiStage
        width={WIDTH * TILESIZE}
        height={HEIGHT * TILESIZE}
        options={{ backgroundAlpha: 0 }}
        className="absolute"
      >
        <Container x={START[0]} y={START[1]}>
          <Sprite
            image="https://pixijs.io/pixi-react/img/bunny.png"
            x={spritePosition.x * TILESIZE}
            y={spritePosition.y * TILESIZE}
            anchor={new PIXI.Point(0.5, 0.5)}
          />
        </Container>
      </PixiStage>
    );
  }
);

export default Stage;
