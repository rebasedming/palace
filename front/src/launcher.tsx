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
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

const PromptBox = ({ isOpen, onClose, onSubmit, isLoading }: PromptBoxProps) => {
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
                    disabled={input === "" || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg aria-hidden="true" className="w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-white fill-blue-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        Loading...
                      </>
                    ) : (
                      "Create Memory Palace"
                    )}
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
    </Transition >
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
  const [loading, setLoading] = useState(false)

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === ENTER_KEY) setShowPromptBox(true);
  };

  const onClosePromptBox = () => {
    setShowPromptBox(false);
  };

  const onSubmitPrompt = async (text: string) => {
    const url = 'https://palace-backend.ngrok.app/input';

    // Create the request options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text }) // Convert the text object to a JSON string
    };

    try {
      // setLoading(true)
      // const response = await fetch(url, requestOptions);

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const data = await response.text();

      // console.log(data);

      // setLoading(false)
      onSubmit();
    } catch (error) {
      console.error('Error during fetch:', error.message);
    }
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
          isLoading={loading}
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
