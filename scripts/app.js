import GameOfLife from './entities/GameOfLife.js';
import ControlPanel from './entities/ControlPanel.js';
import { CONTROLS } from './data/constants.js';

const controlPanel = new ControlPanel();
const gameOfLife = new GameOfLife(100);

gameOfLife.infoCallback = (generation, time) => {
  controlPanel.generation = generation;
  controlPanel.time = time;
};

controlPanel.setControlCallback(CONTROLS.play, gameOfLife.toggle);
controlPanel.setControlCallback(CONTROLS.generate, gameOfLife.generate);
controlPanel.setControlCallback(CONTROLS.clear, gameOfLife.clear);
controlPanel.setControlCallback(
  CONTROLS.speed,
  e => (gameOfLife.speed = Number(e.target.value))
);
controlPanel.setControlCallback(CONTROLS.size, e => {
  const size = Number(e.target.value);
  if (2 <= size && size <= 10000) {
    gameOfLife.size = size;
  }
});
