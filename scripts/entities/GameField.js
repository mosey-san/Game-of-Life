import forEachNeighbor from '../utils/forEachNeighbor.js';


export default class GameField {
  field; // Игровое поле типа Uint8Array(size**2) или Uint8ClampedArray(size**2*4)
  #fieldSize;
  #isPerPixelRenderingMode = false; // Флаг попиксельного рендеринга - одна ячейка = один пиксель
  #getCanvasDataArray; // Хук для получения данных из холста

  constructor(fieldSize, getCanvasDataArray) {
    this.#getCanvasDataArray = getCanvasDataArray;
    this.fieldSize = fieldSize;
  }

  set fieldSize(size) {
    this.#fieldSize = size;
    if (size > 500) {
      this.#isPerPixelRenderingMode = true;
      this.field = this.#getCanvasDataArray();
    } else {
      this.#isPerPixelRenderingMode = false;
      this.field = new Uint8Array(size ** 2);
    }
  }

  #getCell(x, y) {
    let n = x + y * this.#fieldSize;
    if (this.#isPerPixelRenderingMode) {
      return this.field.data[n * 4] ? 1 : 0;
    } else {
      return this.field[n];
    }
  }

  #setCell(x, y, val) {
    const n = x + y * this.#fieldSize;
    if (this.#isPerPixelRenderingMode) {
      val *= 255;
      this.field.data[n * 4] = val;
      this.field.data[n * 4 + 1] = val;
      this.field.data[n * 4 + 2] = val;
    } else {
      this.field[n] = val;
    }
  }

  toggleCellAndReturnField = (x, y) => {
    this.#setCell(x, y, 1 - this.#getCell(x, y));
    return this.field;
  };

  createNextGeneration() {
    // Создаем вспомогательный массив для хранения количества соседей
    const neighborsField = new Uint8Array(this.#fieldSize ** 2);

    // Заполняем массив соседей
    for (let y = 0; y < this.#fieldSize; y++) {
      for (let x = 0; x < this.#fieldSize; x++) {
        const value = this.#getCell(x, y);
        // Только в случае заполненности ячейки
        if (value) {
          forEachNeighbor(x, y, this.#fieldSize, (newX, newY) => {
            neighborsField[newX + newY * this.#fieldSize]++;
          });
        }
      }
    }

    // Меняем игровое поле по правилам
    for (let y = 0; y < this.#fieldSize; y++) {
      for (let x = 0; x < this.#fieldSize; x++) {
        const neighborsCount = neighborsField[x + y * this.#fieldSize];
        const cellValue = this.#getCell(x, y);
        if (
          (cellValue && (neighborsCount < 2 || neighborsCount > 3)) ||
          (!cellValue && neighborsCount === 3)
        ) {
          this.#setCell(x, y, 1 - cellValue);
        }
      }
    }
  }

  generate = () => {
    if (this.#isPerPixelRenderingMode) {
      for (let i = 0; i < this.#fieldSize ** 2; i++) {
        const value = Math.random() > 0.5 ? 255 : 0;
        this.field.data[4 * i] = value;
        this.field.data[4 * i + 1] = value;
        this.field.data[4 * i + 2] = value;
      }
    } else {
      for (let i = 0; i < this.#fieldSize ** 2; i++) {
        this.field[i] = Number(Math.random() > 0.5);
      }
    }
  };

  clear = () => {
    if (this.#isPerPixelRenderingMode) {
      this.field = this.#getCanvasDataArray();
    } else {
      this.field = new Uint8Array(this.#fieldSize ** 2);
    }
  };
}
