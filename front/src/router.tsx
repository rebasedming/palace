import { useState } from "react";

import Stage from "./stage";
import Launcher from "./launcher";

enum Page {
  Launcher = 0,
  Stage = 1,
}

const Router = () => {
  const [page, setPage] = useState(Page.Launcher);

  if (page === Page.Stage) {
    return <Stage />;
  } else {
    return <Launcher onSubmit={() => setPage(Page.Stage)} />;
  }
};

export default Router;
