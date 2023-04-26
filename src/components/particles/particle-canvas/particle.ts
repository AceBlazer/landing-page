// Particle

export default class Particle {
  private TWO_PI: number = 2.0 * Math.PI;

  private _x = 0.0;
  private _y = 0.0;
  private _z = 0.0;

  private _color = "#000";
  private _radius = 0.0;
  private _direction = 0.0;

  private _velocity = 0.0;
  private _acceleration = 0.0;

  // private _orientation  : number = 0.0;
  // private _rotation     : number = 0.0;

  private _birth = 0.0;
  private _lifetime = 0.0;

  set(
    x: number,
    y: number,
    z: number,
    color: string,
    radius: number,

    direction: number,

    velocity: number,
    acceleration: number,
    // orientation  : number,
    // rotation     : number,
    birth: number,
    lifetime: number
    // drawFunction : ( ctx:CanvasRenderingContext2D, x:number, y:number, radius:number ) => void
  ) {
    this._x = x;
    this._y = y;
    this._z = z;

    this._color = color;
    this._radius = this._z * radius;

    this._direction = direction;

    this._velocity = this._z * this._direction * velocity;
    this._acceleration = this._z * this._direction * acceleration;

    // this._orientation  = orientation;
    // this._rotation     = rotation;

    this._birth = birth;
    this._lifetime = lifetime;

    this._checkArea =
      this._direction === -1.0 ? this._checkTop : this._checkBottom;

    // this._drawFunction = drawFunction;
  }

  update(
    ctx: CanvasRenderingContext2D,
    delta: number,
    elapsed: number,
    height: number,
    pointerX = 0.0
  ) {
    this._velocity += this._acceleration;
    this._y += delta * this._velocity;

    // this._orientation += this._rotation;

    const progress = (elapsed - this._birth) / this._lifetime;

    ctx.beginPath();

    // ctx.save();
    // ctx.translate(this._x, this._y);
    // ctx.rotate(this._orientation);
    // ctx.translate(-this._x, -this._y);
    // this._drawFunction(ctx, this._x, this._y, this._radius);

    const xOffset = this._z * Math.sin((this._x + elapsed) * 0.001) * 80.0;
    const yEdgeProximity = Math.pow((height - Math.abs(this._y)) / height, 30);

    ctx.arc(
      this._x + this._z * (xOffset + pointerX * 100.0),
      this._y,
      this._z *
        this._radius *
        Math.abs(Math.sin(progress * Math.PI)) *
        (1 - yEdgeProximity),
      0.0,
      this.TWO_PI
    );

    ctx.fillStyle = this._color;
    ctx.fill();

    // ctx.restore();

    // return isAlive
    return progress < 1.0 && this._checkArea(height);
  }

  _checkTop(height: number) {
    return this._y > -this._radius;
  }

  _checkBottom(height: number) {
    return this._y < height - this._radius;
  }

  // private _drawFunction : ( ctx:CanvasRenderingContext2D, x:number, y:number, radius:number ) => void = function( ctx:CanvasRenderingContext2D, x:number, y:number, radius:number ) {};
  private _checkArea: (height: number) => boolean = (height: number) => true;
}
