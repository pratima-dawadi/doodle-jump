export default class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  gravity: number;
  drag: number;
  velocity: number;
  image: HTMLImageElement;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 50;
    this.dx = 0;
    this.dy = 0;
    this.gravity = 0.33;
    this.drag = 0.3;
    this.velocity = -8;
    this.image = new Image();
    this.image.src = "player.png";
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  updatePlayer() {
    this.dy += this.gravity;
    this.y += this.dy;
    this.x += this.dx;
  }

  jumpPlayer() {
    this.dy = this.velocity;
  }

  applyDrag() {
    if (this.dx < 0) {
      this.dx += this.drag;
      if (this.dx > 0) this.dx = 0;
    } else if (this.dx > 0) {
      this.dx -= this.drag;
      if (this.dx < 0) this.dx = 0;
    }
  }

  wrapPlayer(canvasWidth: number) {
    if (this.x + this.width < 0) {
      this.x = canvasWidth;
    } else if (this.x > canvasWidth) {
      this.x = -this.width;
    }
  }
}
