import { useState } from "react";

import { Stage, Fact } from "./Game";
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
          facts={[
            {
              url: "https://fastly.picsum.photos/id/427/536/354.jpg?hmac=L9xt4dPYu1OBmkl4Md1KF51PpeBgp_mqgmsi4TxU0Mw",
              mnemonic: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
              fact: "A is for apple, B is for ball, C is for cat, D is for dog, E is for elephant, F is for fish, G is for goat, H is for horse, I is for igloo, J is for jellyfish, K is for kangaroo, L is for lion, M is for monkey, N is for nest, O is for octopus, P is for pig, Q is for queen, R is for rabbit, S is for snake, T is for tiger, U is for umbrella, V is for violin, W is for whale, X is for x-ray, Y is for yak, Z is for zebra",
            },
          ]}
        />
      </div>
    );
  } else {
    return <Launcher onSubmit={() => setPage(Page.Stage)} />;
  }
};

export default Router;
