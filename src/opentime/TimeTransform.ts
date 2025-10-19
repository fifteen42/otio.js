import { RationalTime } from './RationalTime';

/**
 * TimeTransform represents a 1D transform for time coordinates.
 * It has an offset and a scale.
 */
export class TimeTransform {
  private _offset: RationalTime;
  private _scale: number;

  constructor(offset?: RationalTime, scale: number = 1) {
    this._offset = offset || new RationalTime(0, 1);
    this._scale = scale;
  }

  get offset(): RationalTime {
    return this._offset;
  }

  get scale(): number {
    return this._scale;
  }

  /**
   * Returns an identity transform.
   */
  static identity(): TimeTransform {
    return new TimeTransform(new RationalTime(0, 1), 1);
  }

  /**
   * Apply this transform to a RationalTime.
   */
  applied(time: RationalTime): RationalTime {
    const scaledValue = time.value * this._scale;
    const scaledTime = new RationalTime(scaledValue, time.rate);
    return scaledTime.add(this._offset);
  }

  /**
   * Compose two transforms together.
   */
  compose(other: TimeTransform): TimeTransform {
    const newOffset = this.applied(other._offset);
    const newScale = this._scale * other._scale;
    return new TimeTransform(newOffset, newScale);
  }

  /**
   * Serialize to JSON.
   */
  toJSON(): {
    offset: { value: number; rate: number };
    scale: number;
  } {
    return {
      offset: this._offset.toJSON(),
      scale: this._scale,
    };
  }

  /**
   * Deserialize from JSON.
   */
  static fromJSON(data: { offset: { value: number; rate: number }; scale: number }): TimeTransform {
    return new TimeTransform(RationalTime.fromJSON(data.offset), data.scale);
  }

  toString(): string {
    return `TimeTransform(${this._offset.toString()}, ${this._scale})`;
  }
}

