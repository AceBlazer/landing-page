import { useEffect, useContext } from "react";
import { ManagerContext, ViewportEventType } from "../../managers";
import { ResizeHandler } from "../../managers/viewport-manager";

/**
 * Calls handler when viewport is resized or viewport scroll height changes.
 *
 * @param handler Called when viewport resized or viewport scroll height changes.
 * @param dependencies Call handler when array values change
 */
export function useResize(handler: ResizeHandler, dependencies: any[] = []) {
  const { viewport } = useContext(ManagerContext);

  const { width, height, dpr, scrollHeight } = viewport.latest;

  useEffect(() => {
    // Subscribe
    const resizeId = viewport.on(ViewportEventType.RESIZE, handler);
    // Fire an initial invocation
    handler({ width, height, dpr, scrollHeight });
    // Cleanup
    return () => {
      viewport.off(resizeId);
    };
  }, [
    ...dependencies, // Rerun effect on mounting operations or when passed dependencies change
    scrollHeight, // Also invoke when scrollHeight changes, i.e. when page has finished rendering
  ]);
}
