import { useState, useEffect } from "react";
import Map from "./assets/pokemon.png";

import { Loop, Stage, World, Sprite, Body } from "react-game-kit";

enum ArrowKey {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

function App() {
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
  const moveAmount = 5; // amount to move in each direction

  const handleKeyDown = (e) => {
    switch (e.key) {
      case ArrowKey.UP:
        setSpritePosition((prevPosition) => ({
          ...prevPosition,
          y: prevPosition.y - moveAmount,
        }));
        break;
      case ArrowKey.DOWN:
        setSpritePosition((prevPosition) => ({
          ...prevPosition,
          y: prevPosition.y + moveAmount,
        }));
        break;
      case ArrowKey.LEFT:
        setSpritePosition((prevPosition) => ({
          ...prevPosition,
          x: prevPosition.x - moveAmount,
        }));
        break;
      case ArrowKey.RIGHT:
        setSpritePosition((prevPosition) => ({
          ...prevPosition,
          x: prevPosition.x + moveAmount,
        }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <div>
      HELLO WORLD
      <Loop>
        <Stage width={800} height={600}>
          <World>
            <Body args={[0, 0, 75, 75]} ref={(b) => {}}>
              <Sprite
                repeat={false}
                src={Map}
                scale={1}
                state={0}
                steps={[0]}
                tileWidth={64}
                tileHeight={64}
                x={spritePosition.x}
                y={spritePosition.y}
              />{" "}
            </Body>
          </World>
        </Stage>
      </Loop>
    </div>
  );
}

export default App;
