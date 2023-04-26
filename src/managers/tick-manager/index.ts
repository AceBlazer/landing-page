/*

  TickManager
  -
  A controller class which manages an Animation loop. It allows components to register
  to this overarching loop rather than binding their own on requestAnimationFrame.

  Items can register with the tick loop using the register() or on() methods:

  const tickID = TickManager.on( ( {delta, elapsed, stamp} ) => {
    console.log( delta, elapsed, stamp )
  } )

  The ID returned from the registration should be used to de-register when needed:

  TickManager.off( tickID );

*/

import uuid from "../../utils/math/uuid";

export type Handler = (data: {
  delta: number;
  elapsed: number;
  stamp: number;
}) => void;

class TickManager {
  private _state: {
    isRunning: boolean;
    time: {
      elapsed: number;
      delta: number;
      prev: number;
      stamp: number;
    };
  };
  private _stack: { [uuid: string]: Handler };
  private _raf = 0;

  get defaults() {
    return {
      isRunning: false,
      time: {
        elapsed: 0,
        delta: 0,
        prev: 0,
        stamp: Date.now(),
      },
    };
  }

  constructor() {
    this._state = { ...this.defaults };
    this._stack = {};
  }

  // Return a static copy of the current time data
  get time() {
    return { ...this._state.time };
  }

  start() {
    if (typeof window === "undefined") {
      console.log("TickManager: no window object, ignoring...");
      return;
    }

    if (this._state.isRunning) {
      console.error("TickManager: instance was already running!");
      return;
    }

    this._state.isRunning = true;

    this._attachEvents();
  }

  stop() {
    if (typeof window === "undefined") {
      console.log("TickManager: no window object, ignoring...");
      return;
    }

    this._state.isRunning = false;

    this._detachEvents();
  }

  register(handler: Handler) {
    const id = uuid();

    this._stack[id] = handler;

    return id;
  }
  on = (handler: Handler) => this.register(handler);

  deregister(id: string) {
    delete this._stack[id];
  }
  off = (id: string) => this.deregister(id);

  // Private
  // -------

  private _attachEvents() {
    this._raf = window.requestAnimationFrame(this._onTick);
  }

  private _detachEvents() {
    window.cancelAnimationFrame(this._raf);
  }

  private _onTick = () => {
    this._raf = window.requestAnimationFrame(this._onTick);

    this._updateTime();
    this._propagate();
  };

  private _updateTime() {
    const now = performance.now();

    this._state.time.elapsed = now;
    this._state.time.delta = now - this._state.time.prev;
    this._state.time.prev = now;
    this._state.time.stamp = Date.now();
  }

  private _propagate() {
    const { delta, elapsed, stamp } = this._state.time;
    const keys = Object.keys(this._stack);

    for (let i = 0, len = keys.length; i < len; i++) {
      if (typeof this._stack[keys[i]] === "function") {
        this._stack[keys[i]]({ delta, elapsed, stamp });
      }
    }
  }
}

export default TickManager;
