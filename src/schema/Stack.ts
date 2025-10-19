import { Composition } from './Composition';
import { Composable } from './Composable';
import { TimeRange } from '../opentime/TimeRange';
import { RationalTime } from '../opentime/RationalTime';
import { Marker } from './Marker';
import { Effect } from './Effect';
import { AnyDictionary } from '../core/SerializableObject';

/**
 * Stack represents a stack of tracks playing simultaneously.
 */
export class Stack extends Composition {
  private _sourceRange: TimeRange | null;

  constructor(
    name: string = '',
    children: Composable[] = [],
    sourceRange: TimeRange | null = null,
    markers: Marker[] = [],
    effects: Effect[] = [],
    enabled: boolean = true,
    metadata: AnyDictionary = {}
  ) {
    super(name, children, markers, effects, enabled, metadata);
    this._sourceRange = sourceRange;
  }

  get sourceRange(): TimeRange | null {
    return this._sourceRange;
  }

  set sourceRange(value: TimeRange | null) {
    this._sourceRange = value;
  }

  schemaName(): string {
    return 'Stack';
  }

  /**
   * Returns the duration of the stack (longest track).
   */
  duration(): TimeRange | null {
    if (this._sourceRange) {
      return this._sourceRange;
    }

    if (this.children.length === 0) {
      return null;
    }

    let maxDuration: RationalTime | null = null;
    let rate = 24;

    for (const child of this.children) {
      const childDuration = child.duration();
      if (childDuration) {
        rate = childDuration.duration.rate;
        if (!maxDuration || childDuration.duration.compare(maxDuration) > 0) {
          maxDuration = childDuration.duration;
        }
      }
    }

    if (!maxDuration) {
      return null;
    }

    return new TimeRange(new RationalTime(0, rate), maxDuration);
  }

  clone(): Stack {
    return new Stack(
      this.name,
      this.children.map((c) => c.clone()),
      this._sourceRange,
      this.markers.map((m) => m.clone()),
      this.effects.map((e) => e.clone()),
      this.enabled,
      { ...this.metadata }
    );
  }

  toJSON(): any {
    const result = super.toJSON();
    if (this._sourceRange) {
      result.source_range = this._sourceRange.toJSON();
    }
    return result;
  }

  static fromJSON(data: {
    name?: string;
    children?: unknown[];
    source_range?: { start_time: { value: number; rate: number }; duration: { value: number; rate: number } };
    markers?: unknown[];
    effects?: unknown[];
    enabled?: boolean;
    metadata?: AnyDictionary;
  }): Stack {
    const sourceRange = data.source_range ? TimeRange.fromJSON(data.source_range) : null;
    
    return new Stack(
      data.name || '',
      [], // Will be set by deserializer
      sourceRange,
      [], // Will be set by deserializer
      [], // Will be set by deserializer
      data.enabled !== false,
      data.metadata || {}
    );
  }
}

