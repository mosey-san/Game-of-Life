import { SELECTORS } from '../data/constants.js';

export default class GameCanvas {
  #canvasNode;
  #ctx;
  #cellSize = 100;
  #cellRenderSize = this.#cellSize + 1;
  #fieldSize;
  clickCallback;

  constructor(fieldSize) {
    this.#canvasNode = document.querySelector(SELECTORS.canvas);
    if (!this.#canvasNode) {
      throw new Error('Canvas not found');
    }
    this.#ctx = this.#canvasNode.getContext('2d', {
      alpha: false,
      willReadFrequently: true,
    });
    this.fieldSize = fieldSize;
    this.#canvasNode.addEventListener('click', this.#clickHandler);
  }

  set fieldSize(fieldSize) {
    this.#fieldSize = fieldSize;
    const newCellSize = Math.floor(1000 / fieldSize);
    this.#cellSize = Math.max(newCellSize, 1);
    this.#cellRenderSize = this.#cellSize + (this.#cellSize >= 10 ? 1 : 0);

    const cellsTotalPixelSize = this.#cellSize * fieldSize;
    const gridTotalPixelSize =
      (fieldSize - 1) * (this.#cellRenderSize - this.#cellSize);

    this.#canvasNode.setAttribute(
      'width',
      cellsTotalPixelSize + gridTotalPixelSize + 'px'
    );
    this.#canvasNode.setAttribute(
      'height',
      cellsTotalPixelSize + gridTotalPixelSize + 'px'
    );
    this.drawField();
  }

  getCanvasDataArray = () => {
    return this.#ctx.getImageData(0, 0, this.#fieldSize, this.#fieldSize);
  };

  #drawGrid() {
    this.#ctx.strokeStyle = 'gray';
    this.#ctx.lineWidth = 1;
    for (let i = 0; i <= this.#fieldSize; i++) {
      this.#ctx.beginPath();
      this.#ctx.moveTo(i * this.#cellRenderSize, 0);
      this.#ctx.lineTo(
        i * this.#cellRenderSize,
        this.#fieldSize * this.#cellRenderSize
      );
      this.#ctx.stroke();
      this.#ctx.beginPath();
      this.#ctx.moveTo(0, i * this.#cellRenderSize);
      this.#ctx.lineTo(
        this.#fieldSize * this.#cellRenderSize,
        i * this.#cellRenderSize
      );
      this.#ctx.stroke();
    }
  }

  #drawCell(x, y) {
    this.#ctx.fillStyle = 'white';
    this.#ctx.fillRect(
      x * this.#cellRenderSize,
      y * this.#cellRenderSize,
      this.#cellSize,
      this.#cellSize
    );
  }

  drawField = field => {
    this.#ctx.clearRect(0, 0, this.#canvasNode.width, this.#canvasNode.height);

    const isPerPixelRendering = this.#cellSize === 1;
    if (isPerPixelRendering) {
      if (field) {
        this.#ctx.putImageData(field, 0, 0);
      }
    } else {
      if (this.#cellRenderSize > this.#cellSize) {
        this.#drawGrid();
      }

      field?.forEach((cell, n) => {
        if (cell) {
          const x = n % this.#fieldSize;
          const y = (n - x) / this.#fieldSize;
          this.#drawCell(x, y);
        }
      });
    }
  };

  #clickHandler = event => {
    const x = Math.floor(event.offsetX / this.#cellRenderSize);
    const y = Math.floor(event.offsetY / this.#cellRenderSize);
    if (this.clickCallback) {
      const field = this.clickCallback(x, y);
      this.drawField(field);
    }
  };
}
