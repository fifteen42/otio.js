import { describe, it, expect } from 'vitest';
import { RationalTime } from '../opentime/RationalTime';

describe('RationalTime', () => {
  it('should create a RationalTime with default values', () => {
    const time = new RationalTime();
    expect(time.value).toBe(0);
    expect(time.rate).toBe(1);
  });

  it('should create a RationalTime from frames', () => {
    const time = RationalTime.fromFrames(100, 24);
    expect(time.value).toBe(100);
    expect(time.rate).toBe(24);
    expect(time.toFrames()).toBe(100);
  });

  it('should create a RationalTime from seconds', () => {
    const time = RationalTime.fromSeconds(1.0, 24);
    expect(time.toSeconds()).toBe(1.0);
    expect(time.toFrames()).toBe(24);
  });

  it('should convert to seconds correctly', () => {
    const time = new RationalTime(48, 24);
    expect(time.toSeconds()).toBe(2.0);
  });

  it('should add two RationalTime values', () => {
    const time1 = RationalTime.fromFrames(100, 24);
    const time2 = RationalTime.fromFrames(50, 24);
    const sum = time1.add(time2);
    expect(sum.toFrames()).toBe(150);
  });

  it('should subtract two RationalTime values', () => {
    const time1 = RationalTime.fromFrames(100, 24);
    const time2 = RationalTime.fromFrames(50, 24);
    const diff = time1.subtract(time2);
    expect(diff.toFrames()).toBe(50);
  });

  it('should compare RationalTime values', () => {
    const time1 = RationalTime.fromFrames(100, 24);
    const time2 = RationalTime.fromFrames(50, 24);
    expect(time1.compare(time2)).toBeGreaterThan(0);
    expect(time2.compare(time1)).toBeLessThan(0);
    expect(time1.compare(time1)).toBe(0);
  });

  it('should check equality', () => {
    const time1 = RationalTime.fromFrames(100, 24);
    const time2 = RationalTime.fromFrames(100, 24);
    const time3 = RationalTime.fromFrames(50, 24);
    expect(time1.equals(time2)).toBe(true);
    expect(time1.equals(time3)).toBe(false);
  });

  it('should rescale to different rates', () => {
    const time24 = RationalTime.fromFrames(24, 24);
    const time30 = time24.rescaledTo(30);
    expect(time30.rate).toBe(30);
    expect(time30.toSeconds()).toBeCloseTo(1.0, 5);
  });

  it('should convert to timecode', () => {
    const time = RationalTime.fromFrames(24 * 60 * 60 + 24 * 30 + 15, 24); // 1:00:30:15
    const timecode = time.toTimecode();
    expect(timecode).toBe('01:00:30:15');
  });

  it('should create from timecode', () => {
    const time = RationalTime.fromTimecode('01:00:30:15', 24);
    expect(time.toTimecode()).toBe('01:00:30:15');
  });

  it('should serialize to JSON', () => {
    const time = RationalTime.fromFrames(100, 24);
    const json = time.toJSON();
    expect(json).toEqual({ value: 100, rate: 24 });
  });

  it('should deserialize from JSON', () => {
    const json = { value: 100, rate: 24 };
    const time = RationalTime.fromJSON(json);
    expect(time.value).toBe(100);
    expect(time.rate).toBe(24);
  });
});

