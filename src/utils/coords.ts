export function randomCenteredOffset(marginX: number, marginY: number) {
  const maxX = Math.max(20, window.innerWidth / 2 - marginX);
  const maxY = Math.max(20, window.innerHeight / 2 - marginY);
  return {
    x: (Math.random() * 2 - 1) * maxX,
    y: (Math.random() * 2 - 1) * maxY,
  };
}

// Converts a "centered, y-up" world coordinate (three.js convention) to
// fixed-position CSS pixel coordinates (origin top-left, y-down).
export function worldToDom(x: number, y: number) {
  return {
    left: window.innerWidth / 2 + x,
    top: window.innerHeight / 2 - y,
  };
}
