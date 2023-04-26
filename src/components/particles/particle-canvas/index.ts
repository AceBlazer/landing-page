import { ParticleProps } from "../";
import { InputManagerInstance } from "../../../managers";
import Canvas2d from "../../../utils/classes/Canvas2d";
import Particle from "./particle";

// ParticleCanvas

class ParticleCanvas extends Canvas2d {
  private _particles: Particle[] = [];

  private _elapsed = 0.0;
  private _direction = -1.0;

  private _pointerX = 0.0;

  constructor() {
    super();
  }

  setup(options: ParticleProps & Record<string, unknown>): void {
    this.options = options;

    this._direction = this._options.direction === "UP" ? -1.0 : 1.0;
    this._particles = [];

    for (let i = 0; i < this._options.population; i++) {
      const particle = this._createParticle(new Particle(), i);
      this._particles.push(particle);
    }
  }

  // private _drawCircle( ctx:CanvasRenderingContext2D, x:number, y:number, radius:number ) {
  //   ctx.arc(x, y, radius, 0.0, this.TWO_PI);
  // }

  // private _drawSquare( ctx:CanvasRenderingContext2D, x:number, y:number, radius:number ) {
  //   ctx.rect(x - radius, y - radius, radius * 2.0, radius * 2.0);
  // }

  protected _draw(
    ctx: CanvasRenderingContext2D,
    delta: number,
    elapsed: number
  ): void {
    const { width, height } = this._config;

    const pointerX = InputManagerInstance.normal.x * -2.0 + 1.0;
    this._pointerX += (pointerX - this._pointerX) * 0.04;

    this._elapsed = elapsed;

    ctx.clearRect(0.0, 0.0, ctx.canvas.width, ctx.canvas.height);

    this._particles.forEach((particle, index) => {
      // check for particle death
      if (!particle.update(ctx, delta, elapsed, height, this._pointerX)) {
        // generate new particle
        this._createParticle(this._particles[index], index);
      }
    });
  }

  private _createParticle(particle: Particle, index: number) {
    const { width, height } = this._config;

    particle.set(
      Math.random() * width, // x
      Math.random() * height, // y
      Math.random(),
      this._options.colors[index % this._options.colors.length],
      2.8, // radius
      this._direction,
      0.01 + Math.random() * 0.1, // velocity
      Math.random() * 0.0026, // acceleration
      // Math.random(),
      // -0.1 + Math.random() * 0.2, // rotation
      this._elapsed, // birth
      2000.0 + Math.random() * 8000.0 // lifetime
      // this._drawCircle
    );

    return particle;
  }
}

export default ParticleCanvas;
