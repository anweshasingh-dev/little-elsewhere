export type Point = [number, number];
export type Stroke = Point[];
export const MAX_STROKES = 12;
export const MAX_POINTS = 128;
export const accessibleX = (): Stroke[] => [[[18, 20], [40, 43], [63, 65], [82, 80]], [[80, 18], [59, 39], [38, 62], [20, 82]]];
export const normalizePoint = (x: number, y: number, rect: { left: number; top: number; width: number; height: number }): Point => [
  Math.round(Math.max(0, Math.min(100, (x - rect.left) / Math.max(1, rect.width) * 100)) * 10) / 10,
  Math.round(Math.max(0, Math.min(100, (y - rect.top) / Math.max(1, rect.height) * 100)) * 10) / 10,
];
export function validStrokes(value: unknown): value is Stroke[] {
  return Array.isArray(value) && value.length <= MAX_STROKES && value.every((stroke: unknown) => Array.isArray(stroke) && stroke.length >= 2 && stroke.length <= MAX_POINTS && stroke.every((point: unknown) => Array.isArray(point) && point.length === 2 && point.every((coordinate: unknown) => typeof coordinate === 'number' && Number.isFinite(coordinate) && coordinate >= 0 && coordinate <= 100)));
}
function diagonal(stroke: Stroke) {
  const start = stroke[0]; const end = stroke[stroke.length - 1];
  const dx = end[0] - start[0]; const dy = end[1] - start[1];
  const chord = Math.hypot(dx, dy);
  const length = stroke.slice(1).reduce((sum, point, index) => sum + Math.hypot(point[0] - stroke[index][0], point[1] - stroke[index][1]), 0);
  return Math.abs(dx) >= 24 && Math.abs(dy) >= 24 && Math.abs(dx / dy) >= .35 && Math.abs(dx / dy) <= 2.8 && length <= chord * 3 ? { start, end, slope: Math.sign(dx * dy) } : null;
}
export function hasValidX(strokes: Stroke[]) {
  const diagonals = strokes.map(diagonal).filter((line) => line !== null);
  return diagonals.some((a, index) => diagonals.slice(index + 1).some((b) => {
    if (a.slope === b.slope) return false;
    const ax = a.end[0] - a.start[0], ay = a.end[1] - a.start[1];
    const bx = b.end[0] - b.start[0], by = b.end[1] - b.start[1];
    const denominator = ax * by - ay * bx;
    if (Math.abs(denominator) < 1) return false;
    const dx = b.start[0] - a.start[0], dy = b.start[1] - a.start[1];
    const t = (dx * by - dy * bx) / denominator;
    const u = (dx * ay - dy * ax) / denominator;
    const x = a.start[0] + t * ax, y = a.start[1] + t * ay;
    return t >= .1 && t <= .9 && u >= .1 && u <= .9 && x >= 15 && x <= 85 && y >= 15 && y <= 85;
  }));
}
