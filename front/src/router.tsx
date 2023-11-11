import { useState } from "react";

import { Stage } from "./Game";
import Launcher from "./launcher";

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
        />
      </div>
    );
  } else {
    return <Launcher onSubmit={() => setPage(Page.Stage)} />;
  }
};

export default Router;
