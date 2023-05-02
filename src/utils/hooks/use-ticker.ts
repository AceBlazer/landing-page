import { useEffect, useContext } from "react";
import { ManagerContext } from "../../managers";
import { Handler } from "../../managers/tick-manager";

/**
 * A custom hook which wraps TickManager registration.
 * This improves ergonomics and ensures cleanup is always handled appropriately.
 *
 * @param handler Called on every tick
 * @param deps
 */
export function useTicker(handler: Handler, deps: any[] = []) {
  const { ticker } = useContext(ManagerContext);

  useEffect(() => {
    const tickId = ticker.on(({ ...args }) => handler({ ...args }));

    return () => {
      ticker.off(tickId);
    };
  }, [...deps]);
}
