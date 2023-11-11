import { useState } from "react";

import { Stage, Fact } from "./Game";
import Launcher from "./launcher";

import presidentsMockData from "../../backend/presidents.json";

enum Page {
  Launcher = 0,
  Presidents = 1,
  Bridges = 2,
}

const Router = () => {
  const [page, setPage] = useState(Page.Launcher);

  if (page === Page.Presidents) {
    return (
      <div>
        <Stage
          world={{
            name: "fallarbor",
            height: 80,
            width: 80,
          }}
          onGoBack={() => setPage(Page.Launcher)}
          facts={presidentsMockData.content.slice(0, 5) as Fact[]}
        />
      </div>
    );
  }
  if (page === Page.Bridges) {
    return (
      <div>
        <Stage
          world={{
            name: "fallarbor",
            height: 80,
            width: 80,
          }}
          onGoBack={() => setPage(Page.Launcher)}
          facts={presidentsMockData.content.slice(0, 5) as Fact[]}
        />
      </div>
    );
  } else {
    return (
      <Launcher
        onSubmit={(e) =>
          setPage(e === "presidents" ? Page.Presidents : Page.Bridges)
        }
      />
    );
  }
};

export default Router;
