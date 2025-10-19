/**
 * RationalTime represents a measure of time of (value / rate) seconds.
 * It is stored as integer numerator (value) and integer denominator (rate).
 */
export class RationalTime {
  private _value: number;
  private _rate: number;

  constructor(value: number = 0, rate: number = 1) {
    this._value = value;
    this._rate = rate;
  }

  get value(): number {
    return this._value;
  }

  get rate(): number {
    return this._rate;
  }

  /**
   * Returns the time value in seconds as a floating point number.
   */
  toSeconds(): number {
    if (this._rate === 0) {
      return 0;
    }
    return this._value / this._rate;
  }

  /**
   * Returns the time value as a number of frames at the given rate.
   */
  toFrames(rate?: number): number {
    if (rate !== undefined) {
      return Math.round(this.toSeconds() * rate);
    }
    return this._value;
  }

  /**
   * Returns the nearest integer frame number at this rate.
   */
  toFrameNumber(): number {
    return Math.round(this._value);
  }

  /**
   * Creates a RationalTime from seconds.
   */
  static fromSeconds(seconds: number, rate: number = 1): RationalTime {
    return new RationalTime(seconds * rate, rate);
  }

  /**
   * Creates a RationalTime from frames.
   */
  static fromFrames(frames: number, rate: number = 24): RationalTime {
    return new RationalTime(frames, rate);
  }

  /**
   * Creates a RationalTime from timecode string (HH:MM:SS:FF).
   */
  static fromTimecode(timecode: string, rate: number = 24): RationalTime {
    const parts = timecode.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid timecode format. Expected HH:MM:SS:FF');
    }

    const [hours, minutes, seconds, frames] = parts.map((p) => parseInt(p, 10));
    const totalFrames = hours * 3600 * rate + minutes * 60 * rate + seconds * rate + frames;

    return new RationalTime(totalFrames, rate);
  }

  /**
   * Returns a timecode string representation (HH:MM:SS:FF).
   */
  toTimecode(): string {
    const totalFrames = Math.floor(this._value);
    const hours = Math.floor(totalFrames / (this._rate * 3600));
    const minutes = Math.floor((totalFrames % (this._rate * 3600)) / (this._rate * 60));
    const seconds = Math.floor((totalFrames % (this._rate * 60)) / this._rate);
    const frames = totalFrames % this._rate;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  }

  /**
   * Returns a rescaled copy of this time at the given rate.
   */
  rescaledTo(newRate: number): RationalTime {
    if (newRate === this._rate) {
      return new RationalTime(this._value, this._rate);
    }
    const seconds = this.toSeconds();
    return RationalTime.fromSeconds(seconds, newRate);
  }

  /**
   * Add two RationalTime values.
   */
  add(other: RationalTime): RationalTime {
    if (this._rate === other._rate) {
      return new RationalTime(this._value + other._value, this._rate);
    }
    // Rescale to common rate
    const newRate = this._rate;
    const otherRescaled = other.rescaledTo(newRate);
    return new RationalTime(this._value + otherRescaled._value, newRate);
  }

  /**
   * Subtract two RationalTime values.
   */
  subtract(other: RationalTime): RationalTime {
    if (this._rate === other._rate) {
      return new RationalTime(this._value - other._value, this._rate);
    }
    const newRate = this._rate;
    const otherRescaled = other.rescaledTo(newRate);
    return new RationalTime(this._value - otherRescaled._value, newRate);
  }

  /**
   * Compare two RationalTime values.
   */
  compare(other: RationalTime): number {
    const thisSeconds = this.toSeconds();
    const otherSeconds = other.toSeconds();
    if (thisSeconds < otherSeconds) return -1;
    if (thisSeconds > otherSeconds) return 1;
    return 0;
  }

  /**
   * Check if two RationalTime values are equal.
   */
  equals(other: RationalTime): boolean {
    return this.compare(other) === 0;
  }

  /**
   * Serialize to JSON.
   */
  toJSON(): { value: number; rate: number } {
    return {
      value: this._value,
      rate: this._rate,
    };
  }

  /**
   * Deserialize from JSON.
   */
  static fromJSON(data: { value: number; rate: number }): RationalTime {
    return new RationalTime(data.value, data.rate);
  }

  toString(): string {
    return `RationalTime(${this._value}, ${this._rate})`;
  }
}

