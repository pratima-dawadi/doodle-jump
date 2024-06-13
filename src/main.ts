import Game from "./Game";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const game = new Game(canvas);
(window as any).game = game;
