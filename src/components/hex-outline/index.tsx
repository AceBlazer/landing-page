import React, { useState, useEffect, useRef, useContext } from "react";
import { useResize } from "../../utils/hooks/use-resize";
import { useTicker } from "../../utils/hooks/use-ticker";
import lerp from "../../utils/math/lerp";
import distance from "../../utils/math/distance";
import clamp from "../../utils/math/clamp";
import * as ease from "../../utils/math/easing";
import scalingFactorOfRotatedRect from "../../utils/math/scalingFactorOfRelatedRect";
import { ManagerContext } from "../../managers";

import HexCanvas from "./hex-canvas";

export enum HexTransitionType {
  GROW = "GROW",
  WIRE = "WIRE",
}

export interface PathLengthType {
  total: number;
  step: number[];
  sum: number[];
}

interface Props {
  isActive: boolean;
  className?: string;
  circular?: boolean;
  diamond?: boolean;
  countdown?: boolean;
  interactive?: boolean;
  hovering?: boolean;
  offsetAmount?: number;
  offsetHorizontal?: number;
  offsetVertical?: number;
  clipLeftTop?: number;
  clipRightTop?: number;
  clipLeftBot?: number;
  clipRightBot?: number;
  strokeColor?: string;
  accentColor?: string | null;
  accentThickness?: number;
  fillColor?: string | null;
  maskTop?: number | null;
  transition?: HexTransitionType;
  transitionDuration?: number;
  transitionDelay?: number;
  hoverDuration?: number;
  hoverEase?: ease.EasingFn;
  countdownDuration?: number;
  countdownStartTime?: number;
  onInit?: (controller: Controller) => void;
}

export interface Controller {
  refresh: () => void;
}

const defaultProps: Props = {
  isActive: false,
  circular: false,
  diamond: false,
  countdown: false,
  interactive: false,
  hovering: false,
  offsetAmount: 10, // px
  offsetHorizontal: 0, // normalized -1 to +1
  offsetVertical: 0, // normalized -1 to +1
  clipLeftTop: 0, // px, square by default
  clipRightTop: 0, // px, square by default
  clipLeftBot: 0, // px, square by default
  clipRightBot: 0, // px, square by default
  strokeColor: "#ababab",
  accentColor: null, // only drawn if defined
  accentThickness: 3, // px
  fillColor: null, // only filled if defined
  maskTop: null, // px, only masked if defined
  transition: HexTransitionType.GROW,
  transitionDuration: 1000, // ms
  transitionDelay: 500, // ms
  hoverDuration: 200, // ms
  hoverEase: ease.inOutQuart,
  countdownDuration: 5000, // ms
  countdownStartTime: 0, // ms
  /* tslint:disable:no-empty */
  onInit: () => {},
};

export const DEBUG = false;
// Amount of pixels to extend beyond the calculated total canvas dimensions to prevent render cropping
export const CANVAS_BLEED = 2;

const HexOutline: React.FC<Props> = (props) => {
  const [canvas] = useState<HexCanvas>(() => new HexCanvas());

  const { ticker } = useContext(ManagerContext);
  const containerRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const [transitionActivated, setTransitionActivated] = useState(false);
  const [transitionStartTime, setTransitionStartTime] = useState(0);

  // Not updated using setter, updated out of react state for performance reasons
  const [hover] = useState<{ progress: number }>({ progress: 0 });

  function updateBounds(container: HTMLElement) {
    const bounds = container.getBoundingClientRect();

    setContainerWidth(bounds.width);
    setContainerHeight(bounds.height);
  }

  function updateAnchors(width: number, height: number) {
    const { offsetAmount, offsetHorizontal, offsetVertical } = props;

    const corners = {
      leftTop: {
        x: width * -0.5 + offsetAmount! * -offsetHorizontal!,
        y: height * -0.5 + offsetAmount! * -offsetVertical!,
      },
      rightTop: {
        x: width * -0.5 + offsetAmount! * offsetHorizontal! + (width + 1),
        y: height * -0.5 + offsetAmount! * -offsetVertical!,
      },
      rightBot: {
        x: width * -0.5 + offsetAmount! * offsetHorizontal! + (width + 1),
        y: height * -0.5 + offsetAmount! * offsetVertical! + (height + 1),
      },
      leftBot: {
        x: width * -0.5 + offsetAmount! * -offsetHorizontal!,
        y: height * -0.5 + offsetAmount! * offsetVertical! + (height + 1),
      },
    };

    const centers = {
      midTop: {
        x: lerp(corners.leftTop.x, corners.rightTop.x, 0.5),
        y: lerp(corners.leftTop.y, corners.rightTop.y, 0.5),
      },
      rightMid: {
        x: lerp(corners.rightTop.x, corners.rightBot.x, 0.5),
        y: lerp(corners.rightTop.y, corners.rightBot.y, 0.5),
      },
      midBot: {
        x: lerp(corners.rightBot.x, corners.leftBot.x, 0.5),
        y: lerp(corners.rightBot.y, corners.leftBot.y, 0.5),
      },
      leftMid: {
        x: lerp(corners.leftBot.x, corners.leftTop.x, 0.5),
        y: lerp(corners.leftBot.y, corners.leftTop.y, 0.5),
      },
    };

    return { ...corners, ...centers };
  }

  function constructPath(anchors: any = {}, clipDissolve = 0) {
    const { clipLeftTop, clipRightTop, clipLeftBot, clipRightBot } = props;

    const path: number[] = [];
    const pathLength: PathLengthType = {
      total: 0,
      step: [],
      sum: [],
    };

    function step(fromAnchor: any = {}, toAnchor: any = {}, clip: number[]) {
      // top left to top center
      const fromX = fromAnchor.x + clip[0] * (1 - clipDissolve);
      const fromY = fromAnchor.y + clip[1] * (1 - clipDissolve);
      const toX = toAnchor.x + clip[2] * (1 - clipDissolve);
      const toY = toAnchor.y + clip[3] * (1 - clipDissolve);
      const dist = distance(fromX, fromY, toX, toY);

      path.push(fromX, fromY, toX, toY);
      pathLength.step.push(dist);
      pathLength.total += dist;
      pathLength.sum.push(pathLength.total);
    }

    step(anchors.leftTop, anchors.midTop, [clipLeftTop!, 0, 0, 0]); // line
    step(anchors.midTop, anchors.rightTop, [0, 0, -clipRightTop!, 0]); // line
    step(anchors.rightTop, anchors.rightTop, [
      -clipRightTop!,
      0,
      0,
      clipRightTop!,
    ]); // corner
    step(anchors.rightTop, anchors.rightMid, [0, clipRightTop!, 0, 0]); // line
    step(anchors.rightMid, anchors.rightBot, [0, 0, 0, -clipRightBot!]); // line
    step(anchors.rightBot, anchors.rightBot, [
      0,
      -clipRightBot!,
      -clipRightBot!,
      0,
    ]); // corner
    step(anchors.rightBot, anchors.midBot, [-clipRightBot!, 0, 0, 0]); // line
    step(anchors.midBot, anchors.leftBot, [0, 0, clipLeftBot!, 0]); // line
    step(anchors.leftBot, anchors.leftBot, [clipLeftBot!, 0, 0, -clipLeftBot!]); // corner
    step(anchors.leftBot, anchors.leftMid, [0, -clipLeftBot!, 0, 0]); // line
    step(anchors.leftMid, anchors.leftTop, [0, 0, 0, clipLeftTop!]); // line
    step(anchors.leftTop, anchors.leftTop, [0, clipLeftTop!, clipLeftTop!, 0]); // corner

    return { path, pathLength };
  }

  // Keep synced with DOM and resize
  useEffect(() => {
    const { diamond, offsetAmount, offsetHorizontal, offsetVertical } = props;

    const dimensionMultiplier = diamond
      ? scalingFactorOfRotatedRect(containerWidth, containerHeight, Math.PI / 4)
      : 1;
    const totalWidth =
      containerWidth * dimensionMultiplier +
      offsetAmount! * 2 * offsetHorizontal! +
      CANVAS_BLEED * 2;
    const totalHeight =
      containerHeight * dimensionMultiplier +
      offsetAmount! * 2 * offsetVertical! +
      CANVAS_BLEED * 2;

    canvas.update({
      canvas: canvasRef.current,
      width: totalWidth,
      height: totalHeight,
      // dprLimit: 2,
      // fpsLimit: 48
    });

    // Offset canvas relative to container
    const left = (totalWidth - containerWidth) / 2;
    const top = (totalHeight - containerHeight) / 2;

    canvasRef.current.style.left = `${-left}px`;
    canvasRef.current.style.top = `${-top}px`;
  }, [
    // Re-bind when references change (i.e. React re-render)...
    containerRef,
    canvasRef,
    // ... or when parent container dimensions change (i.e. on resize)
    containerWidth,
    containerHeight,
  ]);

  function updateCanvasOptions() {
    const style = {
      stroke: props.strokeColor,
      accent: props.accentColor,
      fill: props.fillColor,
      accentThickness: props.accentThickness,
    };
    const transition = {
      active: transitionActivated,
      startTime: transitionStartTime,
      type: props.transition,
      duration: props.transitionDuration,
      delay: props.transitionDelay,
    };
    const countdown = {
      active: props.countdown,
      duration: props.countdownDuration,
      startTime: props.countdownStartTime,
    };
    const shared = {
      style,
      transition,
      countdown,
      hovering: props.hovering,
      hoverProgress: hover.progress,
    };

    if (props.circular) {
      // Update rendering options
      canvas.options = { ...shared, circular: props.circular };
    } else {
      const path = constructPath(
        updateAnchors(containerWidth, containerHeight),
        props.hoverEase!(hover.progress)
      );

      // Update rendering options
      canvas.options = {
        ...shared,
        diamond: props.diamond,
        ...path,
        maskTop: props.maskTop,
        clipSize: props.clipRightTop,
      };
    }
  }

  // Update options as props change
  useEffect(() => {
    updateCanvasOptions();
    canvas.tick(ticker.time.delta, ticker.time.elapsed);
  }, [
    // Re-bind when references change (i.e. React re-render)...
    containerRef,
    canvasRef,
    // ... or when parent container dimensions change (i.e. on resize)...
    containerWidth,
    containerHeight,
    // ... or when transition state changes...
    transitionActivated,
    // ... or when control props change
    ...Object.values(props),
  ]);

  useTicker(
    ({ delta, elapsed }) => {
      // For interactive items, constantly update the path

      if (props.interactive) {
        const prevProgress = hover.progress;
        hover.progress +=
          (delta / props.hoverDuration!) * (props.hovering ? 1 : -1);
        hover.progress = clamp(hover.progress, 0, 1);
        if (hover.progress !== prevProgress) {
          updateCanvasOptions();
        }
      }

      // Only tick when active and if containerHeight is tall enough to not appear broken
      if (props.isActive && containerHeight > 10) {
        canvas.tick(delta, elapsed);
      }
    },
    [
      // Re-bind when references change (i.e. React re-render)...
      containerRef,
      canvasRef,
      // ... or when parent container dimensions change (i.e. on resize)...
      containerWidth,
      containerHeight,
      // ... or when transition state changes...
      transitionActivated,
      // ... or when control props change
      ...Object.values(props),
    ]
  );

  const refresh = () => updateBounds(containerRef.current);

  useResize(() => refresh());

  // Trigger transitions
  useEffect(() => {
    if (!transitionActivated && props.isActive) {
      setTransitionActivated(true);
      setTransitionStartTime(
        typeof window === "undefined" ? 0 : performance.now()
      );
    }
  }, [transitionActivated, props.isActive]);

  useEffect(() => {
    if (!props.onInit) return;
    props.onInit({
      refresh,
    });
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "1px",
        right: "1px",
        bottom: "1px",
        left: "1px",
        pointerEvents: "none",
      }}
      ref={containerRef}
      className={props.className}
    >
      <canvas
        style={{
          position: "absolute",
          display: "block",
          width: "100%",
          height: "100%",
        }}
        ref={canvasRef}
      />
    </div>
  );
};

HexOutline.defaultProps = { ...defaultProps };

export default HexOutline;
