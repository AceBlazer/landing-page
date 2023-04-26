export interface Config {
  canvas: HTMLCanvasElement | null;
  width: number;
  height: number;
  dprLimit: number;
  fpsLimit: number | null;
}

class Canvas2d {
  protected _config: Config = {
    canvas: null, // Canvas element to draw upon
    width: 256, // Width of canvas
    height: 256, // Height of canvas
    dprLimit: 0, // Maximum devicePixelRatio value, zero = no limit
    fpsLimit: null, // No framerate limiting by default
  };

  protected _options: any = {};

  protected _ctx: CanvasRenderingContext2D | null = null;

  protected _invalidated: boolean;

  private _fps: {
    timer: number;
    skipNextFrame: boolean;
  };

  set options(payload: Record<string, unknown>) {
    this._options = { ...this._options, ...payload };
    this._invalidated = true;
  }

  constructor() {
    this._fps = {
      timer: 0,
      skipNextFrame: false,
    };
    this._invalidated = true;
  }

  update(config: Partial<Config>) {
    this._config = { ...this._config, ...config };
    this._setupInstance();
  }

  tick = (delta: number, elapsed: number) => this._tick(delta, elapsed);
  resize = (width: number, height: number, dpr: number) =>
    this._resize(width, height, dpr);

  // Abstract, override in extending canvas classes
  protected _draw(
    ctx: CanvasRenderingContext2D,
    delta: number,
    elapsed: number
  ) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  private _setupInstance() {
    const { canvas, width, height } = this._config;
    if (!canvas) return;

    const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio;

    this._ctx = canvas.getContext("2d");

    this._resize(width, height, dpr);
  }

  private _resize(width: number, height: number, dpr = 1) {
    const resolution =
      this._config.dprLimit === 0 ? dpr : Math.min(dpr, this._config.dprLimit);

    this._config.width = width;
    this._config.height = height;

    if (!this._ctx) return;

    this._ctx.canvas.width = width * resolution;
    this._ctx.canvas.height = height * resolution;

    this._ctx.canvas.style.width = width + "px";
    this._ctx.canvas.style.height = height + "px";

    this._ctx.scale(resolution, resolution);

    this._invalidated = true;
  }

  private _tick(delta: number, elapsed: number) {
    if (!this._ctx) return;

    if (!this._config.fpsLimit) {
      this._draw(this._ctx, delta, elapsed);
    } else if (!this._fps.skipNextFrame) {
      this._draw(this._ctx, 1000 / this._config.fpsLimit, elapsed);
    }

    if (this._config.fpsLimit) {
      const fpsDelta = 1000 / this._config.fpsLimit;
      this._fps.timer += delta;
      if (this._fps.timer >= fpsDelta) {
        this._fps.skipNextFrame = false;
        this._fps.timer -= fpsDelta;
      } else {
        this._fps.skipNextFrame = true;
      }
    }
  }
}

export default Canvas2d;
