import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import dudeBackRun1 from "./assets/char/back-run-1.png";
import dudeBackRun2 from "./assets/char/back-run-2.png";
import dudeBackStop from "./assets/char/back-stop.png";

import dudeFrontRun1 from "./assets/char/front-run-1.png";
import dudeFrontRun2 from "./assets/char/front-run-2.png";
import dudeFrontStop from "./assets/char/front-stop.png";

import dudeLeftRun1 from "./assets/char/left-run-1.png";
import dudeLeftRun2 from "./assets/char/left-run-2.png";
import dudeLeftStop from "./assets/char/left-stop.png";

import dudeRightRun1 from "./assets/char/right-run-1.png";
import dudeRightRun2 from "./assets/char/right-run-2.png";
import dudeRightStop from "./assets/char/right-stop.png";

const Dude = ({
  orientation,
  running,
}: {
  orientation: "left" | "right" | "up" | "down";
  running: boolean;
}) => {
  const [frame, setFrame] = useState(dudeFrontStop);

  useEffect(() => {
    if (orientation === "left") {
      if (running) {
        setFrame(dudeLeftRun1);
        setTimeout(() => {
          setFrame(dudeLeftRun2);
        }, 100);
      } else {
        setFrame(dudeLeftStop);
      }
    } else if (orientation === "right") {
      if (running) {
        setFrame(dudeRightRun1);
        setTimeout(() => {
          setFrame(dudeRightRun2);
        }, 100);
      } else {
        setFrame(dudeRightStop);
      }
    } else if (orientation === "up") {
      if (running) {
        setFrame(dudeBackRun1);
        setTimeout(() => {
          setFrame(dudeBackRun2);
        }, 100);
      } else {
        setFrame(dudeBackStop);
      }
    } else if (orientation === "down") {
      if (running) {
        setFrame(dudeFrontRun1);
        setTimeout(() => {
          setFrame(dudeFrontRun2);
        }, 100);
      } else {
        setFrame(dudeFrontStop);
      }
    }
  }, [orientation, running]);

  return (
    <div>
      <img src={frame} alt="dude" />
    </div>
  );
};

function App() {
  const [count, setCount] = useState(0);
  const [orientation, setOrientation] = useState<
    "left" | "right" | "up" | "down"
  >("down");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          setOrientation("left");
          setRunning(true);
          break;
        case "ArrowRight":
          setOrientation("right");
          setRunning(true);
          break;
        case "ArrowUp":
          setOrientation("up");
          setRunning(true);
          break;
        case "ArrowDown":
          setOrientation("down");
          setRunning(true);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = () => {
      setRunning(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <div>
        <Dude orientation={orientation} running={running} />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
