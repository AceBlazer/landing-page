/*

  InputManager
  -
  A self contained controller class that handles user input.
  Internally manages event bindings and input dimensions.

*/

import { TickManagerInstance as ticker } from "../";
import sign from "../../utils/math/sign";

export default class InputManager {
  private _state: {
    isActive: boolean;
    isTouch: boolean;
    isDown: boolean;
    isMoving: boolean;
    // Pointer browser coordinates where top/left is 0/0, and bottom/right is w/h
    client: {
      x: number;
      y: number;
    };
    // Pointer normalized coordinates where top/left is 0/0, and bottom/right is 1/1
    // This is commonly used with an origin at the viewport center:
    // normal.[x|y] * 2 - 1, giving a range from -1 to +1 on the axis
    normal: {
      x: number;
      y: number;
    };
    // Pointer signed abs travelled between current tick and when isDown was set
    travel: {
      startX: number;
      startY: number;
      x: number;
      y: number;
    };
    // Pointer normalized delta parameters, calculated each tick
    delta: {
      x: number;
      y: number;
      abs: number;
      prevX: number;
      prevY: number;
    };
    // Scroll wheel parameters, updated each `wheel` event
    wheel: {
      deltaX: number;
      deltaY: number;
      directionX: number;
      directionY: number;
    };
  };

  private _element: HTMLElement | undefined;

  private _bounds: {
    width: number;
    height: number;
    left: number;
    top: number;
  };

  private _tickId: string | undefined;

  get defaults() {
    return {
      isActive: false,
      isTouch: false,
      isDown: false,
      isMoving: false,
      client: { x: 0, y: 0 },
      normal: { x: 0, y: 0 },
      travel: { startX: 0, startY: 0, x: 0, y: 0 },
      delta: { x: 0, y: 0, abs: 0, prevX: 0, prevY: 0 },
      wheel: { deltaX: 0, deltaY: 0, directionX: 0, directionY: 0 },
    };
  }

  // Return a static copy of the current tracking data
  get latest() {
    return { ...this._state };
  }
  get client() {
    return { ...this._state.client };
  }
  get normal() {
    return { ...this._state.normal };
  }
  get travel() {
    return { ...this._state.travel };
  }
  get delta() {
    return { ...this._state.delta };
  }
  get wheel() {
    return { ...this._state.wheel };
  }

  // Return a prototypal copy of the tracking data object
  // The copy can have it's properties changed by the requester without affecting the Manager's state,
  // and continues to receive updated properties delegated from the Manager for un-changed properties.
  get subscribe() {
    return Object.create(this._state);
  }

  constructor() {
    this._state = { ...this.defaults };
    this._bounds = { width: 0, height: 0, left: 0, top: 0 };
  }

  bind(element: HTMLElement, startingX = 0, startingY = 0) {
    if (typeof window === "undefined") {
      console.log("InputManager: no window object, ignoring...");
      return;
    }

    if (this._state.isActive) {
      console.warn("InputManager: start() was called while already active...");
      return;
    }

    this._element = element;
    this._state.isActive = true;

    this.refresh();
    this._setPointer(startingX, startingY);
    this._updatePointerSpeed();

    this._attachEvents();
  }

  unbind() {
    if (typeof window === "undefined") {
      console.log("InputManager: no window object, ignoring...");
      return;
    }

    this._state.isActive = false;
    this._state = { ...this.defaults };

    this._detachEvents();
  }

  /*
    Refresh tracking parameters (i.e. resize bounds with window resize)
  */
  refresh() {
    const { width, height, left, top } = this._element!.getBoundingClientRect();

    this._bounds.width = width;
    this._bounds.height = height;
    this._bounds.left = left;
    this._bounds.top = top;

    if (width === 0) {
      console.warn(
        "InputManager.js: this._element's width is currently zero, this will break normal.x calculations due to division by zero."
      );
    }
    if (height === 0) {
      console.warn(
        "InputManager.js: this._element's height is currently zero, this will break normal.y calculations due to division by zero."
      );
    }
  }

  /*
    Release a current input action (i.e. release a touch once a certain action is complete)
  */
  release() {
    this._onUp(this._state.client.x, this._state.client.y);
  }

  private _attachEvents() {
    // Start animation loop
    this._tickId = ticker.on(() => this._onTick());

    // Listen for the interaction initiator on the element itself, but then
    // continue to track `move` and `up` events on the document. This allows
    // the interaction to continue updating, even if the pointer has left the
    // area of the tracked element, or is outside of the viewport.

    this._element!.addEventListener("mousedown", this._onPointerDown, false);
    document.addEventListener("mousemove", this._onPointerMove, false);
    document.addEventListener("mouseup", this._onPointerUp, false);

    this._element!.addEventListener("touchstart", this._onTouchStart, false);
    document.addEventListener("touchmove", this._onTouchMove, false);
    document.addEventListener("touchend", this._onTouchEnd, false);

    if ("onwheel" in document) window.addEventListener("wheel", this._onWheel);
  }

  private _detachEvents() {
    if (this._tickId) {
      ticker.off(this._tickId);
      delete this._tickId;
    }

    this._element!.removeEventListener("mousedown", this._onPointerDown, false);
    document.removeEventListener("mousemove", this._onPointerMove, false);
    document.removeEventListener("mouseup", this._onPointerUp, false);

    this._element!.removeEventListener("touchstart", this._onTouchStart, false);
    document.removeEventListener("touchmove", this._onTouchMove, false);
    document.removeEventListener("touchend", this._onTouchEnd, false);

    if ("onwheel" in document) {
      window.removeEventListener("wheel", this._onWheel);
    }
  }

  private _setPointer(clientX: number, clientY: number) {
    this._state.client.x = clientX - this._bounds.left;
    this._state.client.y = clientY - this._bounds.top;
    this._state.normal.x = this._state.client.x / this._bounds.width;
    this._state.normal.y = this._state.client.y / this._bounds.height;
  }

  private _updatePointerSpeed() {
    // Axis delta
    this._state.delta.x = this._state.normal.x - this._state.delta.prevX;
    this._state.delta.y = this._state.normal.y - this._state.delta.prevY;
    this._state.delta.prevX = this._state.normal.x;
    this._state.delta.prevY = this._state.normal.y;

    // Absolute delta
    this._state.delta.abs = Math.sqrt(
      this._state.delta.x * this._state.delta.x +
        this._state.delta.y * this._state.delta.y
    );

    // Movement status
    this._state.isMoving = this._state.isDown && this._state.delta.abs > 0;
  }

  // Handlers
  // --------

  private _onTick() {
    this._updatePointerSpeed();

    // Reset wheel values after one animation frame, this allows
    // animation loops to listen to wheel updates
    this._state.wheel = { ...this.defaults.wheel };
  }

  private _onDown(clientX: number, clientY: number) {
    this._state.isDown = true;

    this._setPointer(clientX, clientY);

    this._state.travel.startX = clientX;
    this._state.travel.startY = clientY;

    // Reset deltas
    this._state.travel.x = 0;
    this._state.travel.y = 0;
    this._state.delta.prevX = this._state.normal.x;
    this._state.delta.prevY = this._state.normal.y;
  }

  private _onMove(clientX: number, clientY: number) {
    this._setPointer(clientX, clientY);

    if (this._state.isDown) {
      this._state.travel.x = clientX - this._state.travel.startX;
      this._state.travel.y = clientY - this._state.travel.startY;
    }
  }

  private _onUp(clientX: number, clientY: number) {
    this._state.isDown = false;

    this._setPointer(clientX, clientY);

    this._state.travel.startX = 0;
    this._state.travel.startY = 0;
    this._state.travel.x = 0;
    this._state.travel.y = 0;
  }

  private _onPointerDown = (e: MouseEvent) => {
    this._onDown(e.clientX, e.clientY);
  };

  private _onPointerMove = (e: MouseEvent) => {
    this._onMove(e.clientX, e.clientY);
  };

  private _onPointerUp = (e: MouseEvent) => {
    this._onUp(e.clientX, e.clientY);
  };

  private _onTouchStart = (e: TouchEvent) => {
    this._state.isTouch = true;
    this._onDown(e.touches[0].clientX, e.touches[0].clientY);
  };

  private _onTouchMove = (e: TouchEvent) => {
    this._onMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  private _onTouchEnd = (e: TouchEvent) => {
    this._onUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  };

  private _onWheel = (e: WheelEvent) => {
    const { deltaX, deltaY } = e;
    const directionX = sign(deltaX);
    const directionY = sign(deltaY);

    this._state.wheel = { deltaX, deltaY, directionX, directionY };
  };
}
