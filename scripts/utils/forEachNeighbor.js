const NEIGHBORS = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

export default function forEachNeighbor(x, y, size, callback) {
  NEIGHBORS.forEach(([dx, dy]) => {
    let newX = x + dx;
    let newY = y + dy;
    if (newX < 0) {
      newX += size;
    } else if (newX >= size) newX -= size;
    if (newY < 0) {
      newY += size;
    } else if (newY >= size) newY -= size;
    callback(newX, newY);
  });
}
