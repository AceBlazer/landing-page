import Canvas2d from "../../../utils/classes/Canvas2d";
import clamp from "../../../utils/math/clamp";
import lerp from "../../../utils/math/lerp";
import * as ease from "../../../utils/math/easing";
import drawCircle from "../../../utils/canvas/draw-circle";
import drawPath from "../../../utils/canvas/draw-path";

import { DEBUG, CANVAS_BLEED, HexTransitionType, PathLengthType } from "../";

class HexCanvas extends Canvas2d {
  protected _draw(
    ctx: CanvasRenderingContext2D,
    delta: number,
    elapsed: number
  ) {
    const { width, height } = this._config;
    const { circular } = this._options;

    // Only draw if flagged as invalidated. This allows us to optimize by only
    // clearing and redrawing the canvas when something changes, i.e. on resize
    // or while an entry or hover animation is currently running.
    if (!this._invalidated) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();

    // Align origin to center of canvas
    ctx.translate(width / 2, height / 2);

    if (circular) this._drawCircular(ctx, delta, elapsed);
    else this._drawRectangular(ctx, delta, elapsed);

    ctx.restore();
  }

  set path(to: { path: number[]; pathLength: PathLengthType }) {
    this._options.path = to.path;
    this._options.pathLength = to.pathLength;
  }

  set hoverProgress(progress: number) {
    this._options.hoverProgress = progress;
  }

  // --------
  // Circular
  // --------

  private _drawCircular(
    ctx: CanvasRenderingContext2D,
    delta: number,
    elapsed: number
  ) {
    const { width } = this._config;
    const { style, countdown, transition } = this._options;

    const activationProgress = this.getActivationProgress(
      elapsed,
      transition.duration,
      transition.delay
    );

    const radius = width / 2 - CANVAS_BLEED;
    const twoPi = Math.PI * 2;
    const third = twoPi / 3;

    // Don't draw at all until transition has been activated
    if (!transition.active) return;

    // Draw outline
    // ---
    ctx.strokeStyle = style.stroke;
    drawCircle(
      ctx,
      0,
      0,
      radius,
      -Math.PI,
      -Math.PI + ease.outQuart(activationProgress) * twoPi
    );
    ctx.stroke();

    // Draw accents
    // ---
    const progress =
      ((elapsed - countdown.startTime) % countdown.duration) /
      countdown.duration;

    const position = countdown.active
      ? ease.inOutQuart(progress) * twoPi
      : progress * twoPi;

    const thickness = countdown.active
      ? style.accentThickness * progress * (1 - Math.pow(progress, 18))
      : style.accentThickness;

    const growth = countdown.active
      ? ease.inOutCubic(progress) * third
      : third * 0.5 + third * 0.2 * Math.sin(progress * twoPi);

    ctx.strokeStyle = style.accent;
    ctx.lineWidth = thickness * activationProgress;

    drawCircle(ctx, 0, 0, radius - thickness / 2, position, position + growth);
    ctx.stroke();

    drawCircle(
      ctx,
      0,
      0,
      radius - thickness / 2,
      position + third,
      position + third + growth
    );
    ctx.stroke();

    drawCircle(
      ctx,
      0,
      0,
      radius - thickness / 2,
      position + third * 2,
      position + third * 2 + growth
    );
    ctx.stroke();
  }

  // -----------
  // Rectangular
  // -----------

  private _drawRectangular(
    ctx: CanvasRenderingContext2D,
    delta: number,
    elapsed: number
  ) {
    const { height } = this._config;

    const {
      diamond,
      countdown,
      path,
      pathLength,
      style,
      hoverProgress,
      transition,
      maskTop,
    } = this._options;

    const activationProgress = this.getActivationProgress(
      elapsed,
      transition.duration,
      transition.delay
    );

    if (activationProgress >= 1 && !countdown.active) this._invalidated = false;

    // Don't draw at all until transition has been activated
    if (!transition.active) return;

    if (diamond) {
      ctx.rotate(Math.PI / 4);
    }

    // Draw fill
    // ---
    if (style.fill) {
      ctx.save();
      ctx.fillStyle = style.fill;
      ctx.globalAlpha = activationProgress;
      drawPath(ctx, path);
      ctx.fill();
      ctx.restore();
    }

    // Draw outline
    // ---
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = 1.1; // Avoid little rendering dips between anchors

    // Grow
    if (transition.type === HexTransitionType.GROW) {
      // if (activationProgress < 1) {
      //   const third = 1 / 3;
      //   const progress = ease.inOutQuart(activationProgress);

      //   drawPath(ctx, this.getPathSection(0, third * progress));
      //   ctx.stroke();
      //   drawPath(ctx, this.getPathSection(third, third + third * progress));
      //   ctx.stroke();
      //   drawPath(
      //     ctx,
      //     this.getPathSection(third * 2, third * 2 + third * progress)
      //   );
      //   ctx.stroke();
      // } else {
      drawPath(ctx, path);
      ctx.closePath();
      ctx.stroke();
      // }
    }
    // Wire
    else if (transition.type === HexTransitionType.WIRE) {
      const progress = ease.inOutQuart(activationProgress);

      activationProgress < 1
        ? drawPath(ctx, this.getPathSection(0, progress))
        : drawPath(ctx, path);

      ctx.stroke();
    }

    // Draw accents
    // ---
    if (style.accent) {
      ctx.strokeStyle = style.accent;

      // Countdown
      if (countdown.active) {
        const third = 1 / 3;
        const progress =
          ((elapsed - countdown.startTime) % countdown.duration) /
          countdown.duration;
        const position = ease.inOutQuart(progress) * third;
        const thickness =
          style.accentThickness * progress * (1 - Math.pow(progress, 15));
        const growth = ease.inOutCubic(progress) * third;

        ctx.lineWidth = thickness;

        drawPath(
          ctx,
          this.getPathSection(position, position + growth),
          thickness / 2
        );
        ctx.stroke();

        drawPath(
          ctx,
          this.getPathSection(position + third, position + third + growth),
          thickness / 2
        );
        ctx.stroke();

        drawPath(
          ctx,
          this.getPathSection(
            position + third * 2,
            position + third * 2 + growth
          ),
          thickness / 2
        );
        ctx.stroke();
      }
      // Standard
      else {
        // Grow

        if (transition.type === HexTransitionType.GROW) {
          // Only shown on interactive items
          if (hoverProgress > 0) {
            const topRightCornerLength = pathLength.sum[2];
            const progress = ease.inExpo(hoverProgress);
            const growth =
              (this._options.clipSize / pathLength.total) * 1.5 * progress;
            const position = topRightCornerLength / pathLength.total;

            ctx.lineWidth = style.accentThickness;
            drawPath(
              ctx,
              this.getPathSection(position - growth, position + growth),
              style.accentThickness / 2
            );
            ctx.stroke();
          }
        }
        // Wire
        else if (transition.type === HexTransitionType.WIRE) {
          const progress = this.getActivationProgress(
            elapsed,
            transition.duration,
            transition.delay
          );
          const position = 0.95 * ease.inOutQuart(progress);
          const thickness =
            style.accentThickness *
            (1 - Math.pow(Math.abs(progress * 2 - 1), 1.2));
          const growth = 0.1 * ease.outQuart(progress);

          ctx.lineWidth = thickness;

          if (progress < 1) {
            drawPath(
              ctx,
              this.getPathSection(position, position + growth),
              thickness / 2
            );
            ctx.stroke();
          }
        }
      }
    }

    // Apply top mask
    // ---
    if (maskTop) {
      const thickness = 1 + style.accentThickness;

      ctx.save();
      ctx.translate(maskTop * -0.5, height * -0.5);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(0, 0, maskTop, thickness);
      ctx.restore();
    }
  }

  // -------
  // Helpers
  // -------

  private getActivationProgress(
    elapsed: number,
    duration: number,
    delay: number
  ) {
    return clamp(
      (elapsed - (this._options.transition.startTime + delay)) / duration,
      0,
      1
    );
  }

  private getPathSection(alphaStart: number, alphaEnd: number) {
    const { path, pathLength } = this._options;

    const alphaA = alphaStart % 1;
    const alphaB = alphaEnd % 1;
    const originOverlap = alphaEnd > 1 ? alphaEnd % 1 : 0;

    const alphaStartLength = alphaA * pathLength.total;
    const alphaEndLength = alphaB * pathLength.total;
    const overlapLength = originOverlap * pathLength.total;
    let startClosestStepIndex = -1;
    let endClosestStepIndex = -1;
    let overlapClosestStepIndex = -1;

    // Find the closest steps to each alpha position
    for (let i = 0, l = pathLength.sum.length; i < l; i++) {
      if (
        pathLength.sum[i] > alphaStartLength &&
        startClosestStepIndex === -1
      ) {
        startClosestStepIndex = i;
      }
      if (pathLength.sum[i] > alphaEndLength && endClosestStepIndex === -1) {
        endClosestStepIndex = i;
      }
      if (pathLength.sum[i] > overlapLength && overlapClosestStepIndex === -1) {
        overlapClosestStepIndex = i;
      }
    }

    // Trim the full path down to the full segments within the alpha values
    const partial = originOverlap
      ? // When overlapping the origin, keep all segments past the startAlpha position
        path.slice(startClosestStepIndex * 4)
      : path.slice(startClosestStepIndex * 4, endClosestStepIndex * 4);

    // Gather additional full segments which overlap past the origin point
    const overlap = path.slice(0, overlapClosestStepIndex * 4);
    if (overlapClosestStepIndex === 0) {
      overlap.push(path[0], path[1]);
    }

    // Combine the partial and overlap segments into a single path
    const section = originOverlap > 0 ? [...partial, ...overlap] : [...partial];

    // Replace the first full segment's start position with the tail
    const tail = this.getPointOnPath(alphaA);
    section.splice(0, 2);
    section.unshift(tail.x, tail.y);
    // Add the head from the last full segment to the alphaStart position
    const head = this.getPointOnPath(alphaB);
    section.push(head.x, head.y);

    return section;
  }

  private getPointOnPath(alpha: number) {
    const { path, pathLength } = this._options;

    const alphaLength = alpha * pathLength.total;
    const stepCount = path.length / 4;
    let closestStepIndex = 0;

    for (let i = 0, l = pathLength.sum.length; i < l; i++) {
      closestStepIndex = i;
      if (pathLength.sum[i] > alphaLength) {
        break;
      }
    }

    const prevStepAlpha =
      (pathLength.sum[closestStepIndex] - pathLength.step[closestStepIndex]) /
      pathLength.total;
    const nextStepAlpha =
      closestStepIndex + 1 === stepCount
        ? 1
        : (pathLength.sum[closestStepIndex + 1] -
            pathLength.step[closestStepIndex + 1]) /
          pathLength.total;
    const beta = 1 - (nextStepAlpha - alpha) / (nextStepAlpha - prevStepAlpha);

    const prevPointX = path[closestStepIndex * 4];
    const prevPointY = path[closestStepIndex * 4 + 1];
    const nextPointX = path[closestStepIndex * 4 + 2];
    const nextPointY = path[closestStepIndex * 4 + 3];

    if (DEBUG && this._ctx) {
      this._ctx.save();
      this._ctx.fillStyle = "#0f0";
      this._ctx.fillRect(prevPointX - 4, prevPointY - 4, 8, 8);
      this._ctx.fillStyle = "#0ff";
      this._ctx.fillRect(nextPointX - 4, nextPointY - 4, 8, 8);
      this._ctx.fillStyle = "#f0f";
      this._ctx.fillRect(
        lerp(prevPointX, nextPointX, beta) - 4,
        lerp(prevPointY, nextPointY, beta) - 4,
        8,
        8
      );
      this._ctx.restore();
    }

    return {
      x: lerp(prevPointX, nextPointX, beta),
      y: lerp(prevPointY, nextPointY, beta),
    };
  }
}

export default HexCanvas;
