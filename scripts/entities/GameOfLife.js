import GameField from './GameField.js';
import GameCanvas from './GameCanvas.js';

export default class GameOfLife {
  #gameField;
  #gameCanvas;
  #timerId;
  #delay = 20;
  #isPlaying = false;
  #generation = 0;
  #fieldSize;
  infoCallback;

  constructor(size) {
    this.size = size;
    this.#gameCanvas = new GameCanvas(this.#fieldSize);
    this.#gameField = new GameField(this.#fieldSize, this.#gameCanvas.getCanvasDataArray);
    this.#gameCanvas.clickCallback = this.#gameField.toggleCellAndReturnField;
  }

  get isPlaying() {
    return this.#isPlaying;
  }

  get speed() {
    return 1000 / this.#delay;
  }

  set speed(newValue) {
    this.#delay = 1000 / newValue;
    if (this.#isPlaying) {
      this.pause();
      this.start();
    }
  }

  get size() {
    return this.#fieldSize;
  }

  set size(newValue) {
    if (newValue < 2 || newValue > 10000) {
      throw new Error('Game size must be between 2 and 10000');
    }
    if (this.#isPlaying) this.pause();
    if (this.infoCallback) this.infoCallback((this.#generation = 0), 0);
    this.#fieldSize = newValue;
    if (this.#gameCanvas) this.#gameCanvas.fieldSize = newValue;
    if (this.#gameField) this.#gameField.fieldSize = newValue;
  }

  start = () => {
    this.#isPlaying = true;
    this.#timerId = setInterval(() => {
      const startTimeStamp = Date.now();
      this.#gameField.createNextGeneration();
      this.#gameCanvas.drawField(this.#gameField.field);
      const lastGenerationTime = Date.now() - startTimeStamp;
      if (this.infoCallback) {
        this.infoCallback(++this.#generation, lastGenerationTime);
      }
    }, this.#delay);
  };

  pause = () => {
    this.#isPlaying = false;
    clearInterval(this.#timerId);
  };

  toggle = () => {
    if (this.#isPlaying) {
      this.pause();
    } else {
      this.start();
    }
  };

  generate = () => {
    if (this.#isPlaying) this.pause();
    this.infoCallback((this.#generation = 0), 0);
    this.#gameField.generate();
    this.#gameCanvas.drawField(this.#gameField.field);
  };
  
  clear = () => {
    if (this.#isPlaying) this.pause();
    this.infoCallback((this.#generation = 0), 0);
    this.#gameCanvas.drawField();
    this.#gameField.clear();
  };
}
