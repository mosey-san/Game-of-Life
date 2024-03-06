import { SELECTORS } from '../data/constants.js';

export default class ControlPanel {
  #controls = {};
  #generationNode;
  #timeNode;

  constructor() {
    const panel = document.querySelector(SELECTORS.panel);
    if (!panel) {
      throw new Error('Panel not found');
    }
    for (const controlName in SELECTORS.controls) {
      this.#controls[controlName] = panel.querySelector(
        SELECTORS.controls[controlName]
      );
      if (!this.#controls[controlName]) {
        throw new Error(`Control ${controlName} not found`);
      }
    }

    this.#generationNode = document.querySelector(SELECTORS.counter);
    this.#timeNode = document.querySelector(SELECTORS.time);
  }
  
  setControlCallback = (controlName, callback) => {
    if (this.#controls[controlName]) {
      if (this.#controls[controlName] instanceof HTMLButtonElement) {
        this.#controls[controlName].addEventListener('click', callback);
      } else {
        this.#controls[controlName].addEventListener('input', callback);
      }
    }
  };

  set generation(value) {
    this.#generationNode.textContent = value;
  }
  
  set time(value) {
    this.#timeNode.textContent = value;
  }
}
