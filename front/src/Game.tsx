import { Stage as PixiStage, Container, Sprite } from "@pixi/react";
import { useState, useEffect, useRef, useMemo, memo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import * as PIXI from "pixi.js";
import className from "classnames";
import fallarbor from "../assets/maps/fallarbor.png";

const DEBUG = false;

const SPEED = 2;
const START = [50, 50];
const TILESIZE = 10;

const SAFE_TILE = 0;
const COLLISION_TILE = 1;
const PRIZE_TILE = 2;

const PRIZE_REGIONS: [number, number, number, number][] = [
  [4, 27, 4, 2],
  [32, 32, 4, 2],
  [56, 31, 4, 2],
  [60, 64, 4, 2],
  [24, 71, 4, 2],
];

const COLLISION_REGIONS: [number, number, number, number][] = [
  [0, 0, 80, 20],
  [0, 0, 15, 30],
  [56, 50, 17, 14],
  [52, 20, 16, 12],
  [40, 44, 4, 4],
  [20, 56, 16, 16],
  [24, 20, 20, 12],
  [12, 28, 4, 4],
  [5, 57, 10, 10],
  [24, 32, 4, 4],
  [68, 20, 12, 4],
];

export type Fact = {
  url: string;
  mnemonic: string;
  fact: string;
};

enum ArrowKey {
  Left = "ArrowLeft",
  Up = "ArrowUp",
  Right = "ArrowRight",
  Down = "ArrowDown",
}

const setTileNumber = (
  map: number[][],
  items: [number, number, number, number][],
  worldHeight: number,
  worldWidth: number,
  tileNumber: number
) => {
  for (const item of items) {
    const startX = item[0];
    const startY = item[1];
    const regionWidth = item[2];
    const regionHeight = item[3];
    for (let y = startY; y < startY + regionHeight; y++) {
      for (let x = startX; x < startX + regionWidth; x++) {
        if (x < worldHeight && y < worldWidth) {
          map[y][x] = tileNumber;
        }
      }
    }
  }

  return map;
};

const setCollisionRegion = (
  map: number[][],
  items: [number, number, number, number][],
  worldHeight: number,
  worldWidth: number
) => setTileNumber(map, items, worldHeight, worldWidth, COLLISION_TILE);

const setPrizeRegion = (
  map: number[][],
  items: [number, number, number, number][],
  worldHeight: number,
  worldWidth: number
) => setTileNumber(map, items, worldHeight, worldWidth, PRIZE_TILE);

const findClosestPrizeRegion = (point: [number, number]) => {
  const [x, y] = point;

  const distances = PRIZE_REGIONS.map((region) => {
    const [rx, ry, width, height] = region;
    const centerX = rx + width / 2;
    const centerY = ry + height / 2;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    return distance;
  });

  let minDistance = distances[0];
  let closestRegionIndex = 0;

  distances.forEach((distance, index) => {
    if (distance < minDistance) {
      minDistance = distance;
      closestRegionIndex = index;
    }
  });

  return closestRegionIndex;
};

const Tile = memo(
  ({
    tile,
    rowIndex,
    colIndex,
  }: {
    tile: number;
    rowIndex: number;
    colIndex: number;
  }) => {
    return (
      <div
        style={{
          width: TILESIZE,
          height: TILESIZE,
          opacity: DEBUG ? 1 : 0,
        }}
        className={className(
          tile === SAFE_TILE && "bg-gray-200",
          tile === COLLISION_TILE && "bg-red-500",
          tile === PRIZE_TILE && "bg-green-600"
        )}
        onClick={() => {
          console.log(colIndex, rowIndex);
        }}
      ></div>
    );
  }
);

const TileMap = memo(({ map }: { map: number[][] }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${map[0].length}, ${TILESIZE}px)`,
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
          // no clicks
          pointerEvents: "none",
          opacity: DEBUG ? 0.5 : 1,
        }}
      />
      {map.flatMap((row: number[], rowIndex: number) =>
        row.map((tile, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            tile={tile}
            rowIndex={rowIndex}
            colIndex={colIndex}
          />
        ))
      )}
    </div>
  );
});

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
          >
            {DEBUG && `${rowIndex}-${colIndex}`}
          </div>
        ))
      )}
    </div>
  );
});

const PixStage = memo(
  ({
    spritePosition,
    world,
  }: {
    spritePosition: {
      x: number;
      y: number;
    };
    world: {
      name: "fallarbor";
      height: number;
      width: number;
    };
  }) => {
    return (
      <PixiStage
        width={world.width * TILESIZE}
        height={world.height * TILESIZE}
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

const PromptBox = ({
  isOpen,
  onClose,
  facts,
  visibleFactIdx,
}: {
  isOpen: boolean;
  onClose: () => void;
  facts: Fact[];
  visibleFactIdx: number;
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded bg-neutral-800 p-6 text-left align-middle shadow-xl rounded bg-opacity-80 transition-all">
                <div className="grid grid-cols-5 gap-x-6 font-pokemon">
                  <img
                    src={facts[visibleFactIdx]?.url}
                    className="w-full col-span-2"
                  />
                  <div className="col-span-3 text-gray-100">
                    <h3 className="font-bold text-lg text-[#f4c761]">Fact</h3>
                    <div className="mt-4 text-gray-300 text-xs">
                      {facts[visibleFactIdx]?.fact}
                    </div>
                    <h3 className="mt-8 font-bold text-lg text-[#f4c761]">
                      Mnemonic
                    </h3>
                    <div className="mt-4 text-gray-300 text-xs">
                      {facts[visibleFactIdx]?.mnemonic}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const InstructionBox = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded bg-neutral-800 p-6 text-left align-middle shadow-xl rounded bg-opacity-90 transition-all">
                <div className="col-span-3 text-gray-100 font-pokemon">
                  <h3 className="font-bold text-lg text-[#f4c761]">
                    Instructions
                  </h3>
                  <div className="mt-4 text-gray-300 text-xs">
                    Use your arrow keys to move around the memory place. The
                    doors of each building will unlock a new memory.
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const Stage = ({
  world,
  onGoBack,
  facts,
}: {
  world: {
    name: "fallarbor";
    height: number;
    width: number;
  };
  onGoBack: () => void;
  facts: Fact[];
}) => {
  const [spritePosition, setSpritePosition] = useState({
    x: START[0],
    y: START[1],
  });
  const [visibleFactIdx, setVisibleFactIdx] = useState(-1);
  const [showInstructionBox, setShowInstructionBox] = useState(true);
  const [doorsVisited, setDoorsVisited] = useState([]);

  const spritePositionRef = useRef(spritePosition);
  const doorsVisitedRef = useRef(doorsVisited);

  const numberOfFacts = facts.length;

  const map: number[][] = useMemo(() => {
    let map = Array.from({ length: world.height }, () =>
      Array(world.width).fill(0)
    );

    map = setCollisionRegion(map, COLLISION_REGIONS, world.height, world.width);

    map = setPrizeRegion(map, PRIZE_REGIONS, world.height, world.width);
    return map;
  }, []);

  useEffect(() => {
    spritePositionRef.current = spritePosition;
  }, [spritePosition]);

  useEffect(() => {
    doorsVisitedRef.current = doorsVisited;
  }, [doorsVisited]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const buffer = 4;
      let newX = spritePositionRef.current.x;
      let newY = spritePositionRef.current.y;
      let newDoorsVisited = doorsVisitedRef.current;

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
      if (
        map[newY + buffer] &&
        map[newY + buffer][newX + buffer] === SAFE_TILE
      ) {
        setSpritePosition({ x: newX, y: newY });
        setVisibleFactIdx(-1);
      }

      // Prize detection
      if (
        map[newY + buffer] &&
        map[newY + buffer][newX + buffer] === PRIZE_TILE
      ) {
        const visibleFactIdx = findClosestPrizeRegion([newX, newY]);
        setSpritePosition({ x: newX, y: newY });
        setVisibleFactIdx(visibleFactIdx);
        setDoorsVisited([...new Set([...newDoorsVisited, visibleFactIdx])]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-600 relative overscroll-none flex justify-center items-center h-screen overflow-hidden">
      <PromptBox
        isOpen={visibleFactIdx > -1}
        onClose={() => {}}
        facts={facts}
        visibleFactIdx={visibleFactIdx}
      />
      <InstructionBox
        isOpen={showInstructionBox}
        onClose={() => {
          setShowInstructionBox(false);
        }}
      />
      <button
        onClick={onGoBack}
        className="absolute right-4 bottom-4 text-gray-800 font-semibold bg-[#f4c761] rounded px-4 py-3 font-pokemon text-xs"
      >
        Start Over
      </button>
      <button
        onClick={() => setShowInstructionBox(true)}
        className="absolute right-4 top-4 text-gray-800 font-semibold bg-[#ef8e77] rounded px-4 py-3 font-pokemon text-xs"
      >
        Instructions
      </button>
      <div className="absolute left-4 bottom-4 p-4 rounded bg-gray-800 font-pokemon text-sm text-gray-300">
        Doors Visited: {doorsVisited.length}/{numberOfFacts}
      </div>
      <div className="absolute">
        <TileMap map={map} />
      </div>

      {!DEBUG && (
        <>
          <Grid map={map} />
          <PixStage spritePosition={spritePosition} world={world} />
        </>
      )}
    </div>
  );
};

export { Stage };
