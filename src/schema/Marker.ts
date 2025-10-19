import { SerializableObject, AnyDictionary } from '../core/SerializableObject';
import { TimeRange } from '../opentime/TimeRange';

export enum MarkerColor {
  RED = 'RED',
  PINK = 'PINK',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  CYAN = 'CYAN',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
  MAGENTA = 'MAGENTA',
  BLACK = 'BLACK',
  WHITE = 'WHITE',
}

/**
 * Marker represents a marked range on a timeline item.
 */
export class Marker extends SerializableObject {
  private _markedRange: TimeRange;
  private _color: MarkerColor;
  private _comment: string;

  constructor(
    name: string = '',
    markedRange: TimeRange = new TimeRange(),
    color: MarkerColor = MarkerColor.RED,
    comment: string = '',
    metadata: AnyDictionary = {}
  ) {
    super(name, metadata);
    this._markedRange = markedRange;
    this._color = color;
    this._comment = comment;
  }

  get markedRange(): TimeRange {
    return this._markedRange;
  }

  set markedRange(value: TimeRange) {
    this._markedRange = value;
  }

  get color(): MarkerColor {
    return this._color;
  }

  set color(value: MarkerColor) {
    this._color = value;
  }

  get comment(): string {
    return this._comment;
  }

  set comment(value: string) {
    this._comment = value;
  }

  schemaName(): string {
    return 'Marker';
  }

  clone(): Marker {
    return new Marker(
      this.name,
      this._markedRange,
      this._color,
      this._comment,
      { ...this.metadata }
    );
  }

  toJSON(): any {
    const result = super.toJSON();
    result.marked_range = this._markedRange.toJSON();
    result.color = this._color;
    if (this._comment) {
      result.comment = this._comment;
    }
    return result;
  }

  static fromJSON(data: {
    name?: string;
    marked_range: { start_time: { value: number; rate: number }; duration: { value: number; rate: number } };
    color?: string;
    comment?: string;
    metadata?: AnyDictionary;
  }): Marker {
    return new Marker(
      data.name || '',
      TimeRange.fromJSON(data.marked_range),
      (data.color as MarkerColor) || MarkerColor.RED,
      data.comment || '',
      data.metadata || {}
    );
  }
}

