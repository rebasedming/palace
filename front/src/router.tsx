import { useState } from "react";

import { Stage, Fact } from "./Game";
import Launcher from "./launcher";

import mockData from "../../backend/data.json";

enum Page {
  Launcher = 0,
  Stage = 1,
}

const Router = () => {
  const [page, setPage] = useState(Page.Launcher);

  if (page === Page.Stage) {
    return (
      <div>
        <Stage
          world={{
            name: "fallarbor",
            height: 80,
            width: 80,
          }}
          onGoBack={() => setPage(Page.Launcher)}
          facts={mockData.content.slice(0, 5) as Fact[]}
        />
      </div>
    );
  } else {
    return <Launcher onSubmit={() => setPage(Page.Stage)} />;
  }
};

export default Router;
