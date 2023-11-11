import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import TextareaAutosize from "react-textarea-autosize";
import classNames from "classnames";

import Palace from "@assets/palace.png";
import StarBackground from "./components/stars";

const ENTER_KEY = "Enter";

interface LauncherProps {
  onSubmit: () => void;
}

interface LaunchScreenProps {
  onKeyPress: (show: boolean) => void;
}

interface PromptBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

const PromptBox = ({ isOpen, onClose, onSubmit }: PromptBoxProps) => {
  const [input, setInput] = useState("");

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
              <Dialog.Panel className="font-pokemon w-full max-w-xl transform overflow-hidden rounded bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-100 text-center"
                >
                  What list would you like to memorize?
                </Dialog.Title>
                <div className="mt-6">
                  <TextareaAutosize
                    autoFocus
                    className="text-xs bg-neutral-900 focus:ring-0 focus:outline-none w-full text-gray-300 p-6 resize-none"
                    minRows={16}
                    placeholder="Example: Neil Armstrong, Buzz Aldrin, Michael Collins"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
                <div className="w-full mt-4 flex justify-between">
                  <button
                    className={classNames(
                      "text-xs text-gray-800 font-semibold bg-[#f4c761] rounded px-4 py-3",
                      input === "" && "bg-opacity-40"
                    )}
                    onClick={() => onSubmit(input)}
                    disabled={input === ""}
                  >
                    Create Memory Palace
                  </button>
                  <button className="text-xs text-gray-400" onClick={onClose}>
                    Go Back
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const LaunchScreen = ({ onKeyPress }: LaunchScreenProps) => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === ENTER_KEY) onKeyPress(true);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="pt-12 text-center font-pokemon">
      <img src={Palace} className="w-64 h-64 mx-auto" />
      <div className="text-7xl text-gray-100 mt-6">
        <span style={{ color: "#f4c761" }}>P</span>
        <span style={{ color: "#f3b661" }}>a</span>
        <span style={{ color: "#ef8e77" }}>l</span>
        <span style={{ color: "#e07b78" }}>a</span>
        <span style={{ color: "#793787" }}>c</span>
        <span style={{ color: "#5773dd" }}>e</span>
      </div>
      <div className="mt-4 text-gray-300">v1.0.0</div>
      <div className="mt-24 text-lg text-gray-300 animate-pulse">
        Press Enter
      </div>
    </div>
  );
};

const Launcher = ({ onSubmit }: LauncherProps) => {
  const [showPromptBox, setShowPromptBox] = useState(false);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === ENTER_KEY) setShowPromptBox(true);
  };

  const onClosePromptBox = () => {
    setShowPromptBox(false);
  };

  const onSubmitPrompt = (text: string) => {
    onSubmit();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-neutral-900 overscroll-none overflow-none">
      <div className="absolute w-screen h-screen">
        <StarBackground />
      </div>
      {showPromptBox && (
        <PromptBox
          isOpen={showPromptBox}
          onClose={onClosePromptBox}
          onSubmit={onSubmitPrompt}
        />
      )}
      {!showPromptBox && <LaunchScreen onKeyPress={setShowPromptBox} />}
    </div>
  );
};

export default Launcher;
