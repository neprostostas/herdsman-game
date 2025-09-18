import { Bounds, Point } from '../types/game';

export function createBounds(
  left: number, 
  top: number, 
  right: number, 
  bottom: number
): Bounds {
  return { left, top, right, bottom };
}

export function createBoundsWithBuffer(
  bounds: Bounds, 
  buffer: number
): Bounds {
  return {
    left: bounds.left - buffer,
    top: bounds.top - buffer,
    right: bounds.right + buffer,
    bottom: bounds.bottom + buffer,
  };
}

export function isPointInBounds(point: Point, bounds: Bounds): boolean {
  return (
    point.x >= bounds.left &&
    point.x <= bounds.right &&
    point.y >= bounds.top &&
    point.y <= bounds.bottom
  );
}

export function getBoundsCenter(bounds: Bounds): Point {
  return {
    x: (bounds.left + bounds.right) / 2,
    y: (bounds.top + bounds.bottom) / 2,
  };
}

export function getBoundsSize(bounds: Bounds): { width: number; height: number } {
  return {
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top,
  };
}
