import React, { useEffect, useRef, useState } from "react";
import ParticleCanvas from "./particle-canvas";
import { useTicker } from "../../utils/hooks/use-ticker";
import { useResize } from "../../utils/hooks/use-resize";

export enum ParticleDirectionType {
  UP = "UP",
  DOWN = "DOWN",
}

export interface ParticleProps {
  isActive: boolean;
  population?: number;
  colors?: string[] | null;
  direction?: ParticleDirectionType;
}

const defaultProps: ParticleProps = {
  isActive: false,
  population: 100.0,
  colors: ["#000"],
  direction: ParticleDirectionType.UP,
};

export const DEBUG = false;
export const CANVAS_BLEED = 2;

const Particles: React.FC<ParticleProps> = ({
  isActive,
  population,
  colors,
  direction,
}) => {
  const [canvas] = useState<ParticleCanvas>(() => new ParticleCanvas());

  const containerRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);

  const [containerWidth, setContainerWidth] = useState(100.0);
  const [containerHeight, setContainerHeight] = useState(100.0);

  // Keep synced with DOM and resize
  useEffect(() => {
    canvas.update({
      canvas: canvasRef.current,
      width: containerWidth,
      height: containerHeight,
      dprLimit: 1,
      fpsLimit: 30,
    });
  }, [
    canvas,
    // Re-bind when references change (i.e. React re-render)...
    containerRef,
    canvasRef,
    // ... or when parent container dimensions change (i.e. on resize)
    containerWidth,
    containerHeight,
  ]);

  // Update options as props change
  useEffect(() => {
    canvas.setup({ isActive, population, colors, direction });
  }, [
    canvas,
    // Re-bind when references change (i.e. React re-render)...
    containerRef,
    canvasRef,
    // ... or when parent container dimensions change (i.e. on resize)...
    containerWidth,
    containerHeight,
    // ... or when control props change
    isActive,
    population,
    colors,
    direction,
  ]);

  useTicker(
    ({ delta, elapsed }) => {
      if (isActive) {
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
      // ... or when control props change
      isActive,
    ]
  );

  useResize(() => {
    const bounds = containerRef.current.getBoundingClientRect();

    setContainerWidth(bounds.width);
    setContainerHeight(bounds.height);
  });

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
    >
      <canvas
        style={{
          position: "absolute",
          left: "-2px",
          top: "-2px",
          display: "block",
          width: "100%",
          height: "100%",
        }}
        ref={canvasRef}
      />
    </div>
  );
};

Particles.defaultProps = { ...defaultProps };

export default Particles;
