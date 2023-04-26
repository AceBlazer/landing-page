import { createContext } from "react";

import ViewportManager from "./viewport-manager";
import TickManager from "./tick-manager";
import InputManager from "./input-manager";

export { Type as ViewportEventType } from "./viewport-manager";

const managers = {
  viewport: new ViewportManager(),
  ticker: new TickManager(),
  input: new InputManager(),
};

const ManagerContext = createContext(managers);

const ViewportManagerInstance = managers.viewport;
const TickManagerInstance = managers.ticker;
const InputManagerInstance = managers.input;

let isActivated = false;

function activateManagers(scrollContainerElement: HTMLElement) {
  if (isActivated) {
    return;
  }

  managers.viewport.bind(scrollContainerElement);
  managers.ticker.start();

  managers.input.bind(
    scrollContainerElement,
    typeof window === "undefined" ? 1920 / 2 : window.innerWidth / 2,
    typeof window === "undefined" ? 1080 / 2 : window.innerHeight / 2
  );

  isActivated = true;
}

function deactivateManagers() {
  managers.viewport.unbind();
  managers.ticker.stop();

  managers.input.unbind();

  isActivated = false;
}

export {
  ManagerContext,
  ViewportManagerInstance,
  TickManagerInstance,
  InputManagerInstance,
  activateManagers,
  deactivateManagers,
};
