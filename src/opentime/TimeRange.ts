import { RationalTime } from './RationalTime';

/**
 * TimeRange represents a range in time with a start time and duration.
 */
export class TimeRange {
  private _startTime: RationalTime;
  private _duration: RationalTime;

  constructor(startTime?: RationalTime, duration?: RationalTime) {
    this._startTime = startTime || new RationalTime(0, 1);
    this._duration = duration || new RationalTime(0, 1);
  }

  get startTime(): RationalTime {
    return this._startTime;
  }

  get duration(): RationalTime {
    return this._duration;
  }

  /**
   * Returns the end time (exclusive) of the range.
   */
  endTimeExclusive(): RationalTime {
    return this._startTime.add(this._duration);
  }

  /**
   * Returns the end time (inclusive) of the range.
   */
  endTimeInclusive(): RationalTime {
    const rate = this._duration.rate;
    const oneFrame = new RationalTime(1, rate);
    return this.endTimeExclusive().subtract(oneFrame);
  }

  /**
   * Returns the duration as seconds.
   */
  durationSeconds(): number {
    return this._duration.toSeconds();
  }

  /**
   * Creates a TimeRange from start and end times.
   */
  static fromStartEndTime(startTime: RationalTime, endTimeExclusive: RationalTime): TimeRange {
    const duration = endTimeExclusive.subtract(startTime);
    return new TimeRange(startTime, duration);
  }

  /**
   * Check if a time is contained within this range.
   */
  contains(time: RationalTime): boolean {
    return time.compare(this._startTime) >= 0 && time.compare(this.endTimeExclusive()) < 0;
  }

  /**
   * Check if another range overlaps with this range.
   */
  overlaps(other: TimeRange): boolean {
    return (
      this.contains(other._startTime) ||
      this.contains(other.endTimeInclusive()) ||
      other.contains(this._startTime) ||
      other.contains(this.endTimeInclusive())
    );
  }

  /**
   * Returns the range extended by the given time range.
   */
  extended(other: TimeRange): TimeRange {
    const newStart =
      this._startTime.compare(other._startTime) < 0 ? this._startTime : other._startTime;
    const thisEnd = this.endTimeExclusive();
    const otherEnd = other.endTimeExclusive();
    const newEnd = thisEnd.compare(otherEnd) > 0 ? thisEnd : otherEnd;

    return TimeRange.fromStartEndTime(newStart, newEnd);
  }

  /**
   * Returns a range clamped to the bounds of this range.
   */
  clamped(other: TimeRange): TimeRange | null {
    if (!this.overlaps(other)) {
      return null;
    }

    const newStart =
      this._startTime.compare(other._startTime) > 0 ? this._startTime : other._startTime;
    const thisEnd = this.endTimeExclusive();
    const otherEnd = other.endTimeExclusive();
    const newEnd = thisEnd.compare(otherEnd) < 0 ? thisEnd : otherEnd;

    return TimeRange.fromStartEndTime(newStart, newEnd);
  }

  /**
   * Serialize to JSON.
   */
  toJSON(): {
    start_time: { value: number; rate: number };
    duration: { value: number; rate: number };
  } {
    return {
      start_time: this._startTime.toJSON(),
      duration: this._duration.toJSON(),
    };
  }

  /**
   * Deserialize from JSON.
   */
  static fromJSON(data: {
    start_time: { value: number; rate: number };
    duration: { value: number; rate: number };
  }): TimeRange {
    return new TimeRange(
      RationalTime.fromJSON(data.start_time),
      RationalTime.fromJSON(data.duration)
    );
  }

  toString(): string {
    return `TimeRange(${this._startTime.toString()}, ${this._duration.toString()})`;
  }
}

