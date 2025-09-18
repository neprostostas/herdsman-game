import { describe, it, expect } from 'vitest';
import { clamp, distance, circleRectOverlap } from '../../src/utils/math';

describe('Math Utils', () => {
  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('distance', () => {
    it('should calculate distance between two points', () => {
      expect(distance(0, 0, 3, 4)).toBe(5);
      expect(distance(1, 1, 1, 1)).toBe(0);
    });
  });

  describe('circleRectOverlap', () => {
    it('should detect circle-rectangle overlap', () => {
      expect(circleRectOverlap(5, 5, 2, 0, 0, 10, 10)).toBe(true);
      expect(circleRectOverlap(15, 15, 2, 0, 0, 10, 10)).toBe(false);
    });
  });
});
