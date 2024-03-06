const CONTROLS = {
  play: 'play',
  generate: 'generate',
  clear: 'clear',
  speed: 'speed',
  size: 'size',
};
Object.freeze(CONTROLS);

const SELECTORS = {
  panel: '.game__panel',
  counter: '.game__counter-value',
  time: '.game__time-value',
  canvas: '.game__canvas',
  controls: {
    [CONTROLS.play]: `[name="${CONTROLS.play}"]`,
    [CONTROLS.generate]: `[name="${CONTROLS.generate}"]`,
    [CONTROLS.clear]: `[name="${CONTROLS.clear}"]`,
    [CONTROLS.speed]: `[name="${CONTROLS.speed}"]`,
    [CONTROLS.size]: `[name="${CONTROLS.size}"]`,
  },
};
Object.freeze(SELECTORS);

export { CONTROLS, SELECTORS };
