import Platform from "./Platform";
import Player from "./Player";
import { getRandom } from "./utils";

enum GameState {
  Start,
  Playing,
  GameOver,
}

export default class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  platforms: Platform[];
  player: Player;
  minPlatformSpace: number;
  maxPlatformSpace: number;
  platformWidth: number;
  platformHeight: number;
  platformStart: number;
  playerDirection: number;
  keydown: boolean;
  prevPlayerY: number;
  gameState: GameState;
  score: number;
  highScore: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.platforms = [];
    this.platformWidth = 65;
    this.platformHeight = 20;
    this.platformStart = canvas.height - 50;
    this.minPlatformSpace = 150;
    this.maxPlatformSpace = 10;
    this.playerDirection = 0;
    this.keydown = false;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem("highScore") || "0", 10);

    this.player = new Player(
      this.canvas.width / 2 - 20,
      this.platformStart - 60
    );
    this.prevPlayerY = this.player.y;
    this.gameState = GameState.Start;

    this.platformsInitialize();
    this.eventListener();
    requestAnimationFrame(this.mainLoop.bind(this));
  }

  platformsInitialize() {
    let y = this.platformStart;
    this.platforms.push(
      new Platform(
        this.canvas.width / 2 - this.platformWidth / 2,
        y,
        this.platformWidth,
        this.platformHeight
      )
    );

    while (y > 0) {
      y -=
        this.platformHeight +
        getRandom(this.minPlatformSpace, this.maxPlatformSpace);
      let x;
      do {
        x = getRandom(25, this.canvas.width - this.platformWidth - 25);
      } while (
        y > this.canvas.height / 2 &&
        x > this.canvas.width / 2 - this.platformWidth * 1.5 &&
        x < this.canvas.width / 2 + this.platformWidth / 2
      );
      this.platforms.push(
        new Platform(x, y, this.platformWidth, this.platformHeight)
      );
    }
  }

  eventListener() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.playerDirection = -1;
        this.keydown = true;
        this.player.dx = -3;
        this.player.image.src = "player-left.png";
      } else if (e.key === "ArrowRight") {
        this.playerDirection = 1;
        this.keydown = true;
        this.player.dx = 3;
        this.player.image.src = "player-right.png";
      } else if (e.key === "Enter") {
        if (
          this.gameState === GameState.Start ||
          this.gameState === GameState.GameOver
        ) {
          this.restart();
        }
      }
    });

    document.addEventListener("keyup", () => {
      this.keydown = false;
    });
  }

  restart() {
    this.platforms = [];
    this.player = new Player(
      this.canvas.width / 2 - 20,
      this.platformStart - 60
    );
    this.prevPlayerY = this.player.y;
    this.minPlatformSpace = 150;
    this.maxPlatformSpace = 10;
    this.platformsInitialize();
    this.gameState = GameState.Playing;
  }

  startGame() {
    this.ctx.fillStyle = "#D1D8C5";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#615EFC";
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "DOODLE JUMP GAME !!",
      this.canvas.width / 2,
      this.canvas.height / 2 - 50
    );
    this.ctx.fillText(
      "Press Enter to Start",
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
    );
  }

  endGame() {
    this.ctx.fillStyle = "#D1D8C5";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#615EFC";
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Game Over",
      this.canvas.width / 2,
      this.canvas.height / 2 - 30
    );
    this.ctx.fillText(
      "Press Enter to Restart",
      this.canvas.width / 2,
      this.canvas.height / 2 + 30
    );
  }

  mainLoop() {
    requestAnimationFrame(this.mainLoop.bind(this));
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.gameState) {
      case GameState.Start:
        this.startGame();
        break;

      case GameState.Playing:
        this.updateGame();
        break;

      case GameState.GameOver:
        this.endGame();
        break;
    }
  }

  updateGame() {
    this.player.updatePlayer();
    this.player.applyDrag();
    this.player.wrapPlayer(this.canvas.width);

    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "#DC5F00";
    this.ctx.fillText(`Score: ${this.score}`, 50, 20);
    this.ctx.fillText(`High Score: ${this.highScore}`, 65, 50);

    if (this.player.y < this.canvas.height / 2 && this.player.dy < 0) {
      this.platforms.forEach((platform) => (platform.y += -this.player.dy));
      while (this.platforms[this.platforms.length - 1].y > 0) {
        const lastPlatform = this.platforms[this.platforms.length - 1];
        const newY =
          lastPlatform.y -
          (this.platformHeight +
            getRandom(this.minPlatformSpace, this.maxPlatformSpace));
        const newX = getRandom(0, this.canvas.width - this.platformWidth);
        this.platforms.push(
          new Platform(newX, newY, this.platformWidth, this.platformHeight)
        );
        this.minPlatformSpace += 0.5;
        this.maxPlatformSpace += 0.5;
        this.maxPlatformSpace = Math.min(
          this.maxPlatformSpace,
          this.canvas.height / 2
        );
      }
      const outOfBoundsPlatforms = this.platforms.filter(
        (platform) => platform.y > this.canvas.height
      );
      this.score += outOfBoundsPlatforms.length;
    } else {
      this.player.y += this.player.dy;
    }

    this.platforms.forEach((platform) => {
      platform.draw(this.ctx);
      if (
        this.player.dy > 0 &&
        this.prevPlayerY + this.player.height <= platform.y &&
        this.player.x < platform.x + platform.width &&
        this.player.x + this.player.width > platform.x &&
        this.player.y < platform.y + platform.height &&
        this.player.y + this.player.height > platform.y
      ) {
        this.player.y = platform.y - this.player.height;
        this.player.jumpPlayer();
      }
    });

    this.player.draw(this.ctx);
    this.prevPlayerY = this.player.y;

    this.platforms = this.platforms.filter(
      (platform) => platform.y < this.canvas.height
    );

    //Checking the player's position
    if (this.player.y > this.canvas.height) {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem("highScore", this.highScore.toString());
      }
      this.gameState = GameState.GameOver;
    }
  }
}
