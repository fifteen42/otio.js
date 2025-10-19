import { Composable } from './Composable';
import { TimeRange } from '../opentime/TimeRange';
import { Marker } from './Marker';
import { Effect } from './Effect';
import { AnyDictionary } from '../core/SerializableObject';

/**
 * Gap represents empty space in a timeline.
 */
export class Gap extends Composable {
  private _sourceRange: TimeRange | null;

  constructor(
    name: string = '',
    sourceRange: TimeRange | null = null,
    markers: Marker[] = [],
    effects: Effect[] = [],
    enabled: boolean = true,
    metadata: AnyDictionary = {}
  ) {
    super(name, markers, effects, enabled, metadata);
    this._sourceRange = sourceRange;
  }

  get sourceRange(): TimeRange | null {
    return this._sourceRange;
  }

  set sourceRange(value: TimeRange | null) {
    this._sourceRange = value;
  }

  schemaName(): string {
    return 'Gap';
  }

  duration(): TimeRange | null {
    return this._sourceRange;
  }

  clone(): Gap {
    return new Gap(
      this.name,
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
    source_range?: { start_time: { value: number; rate: number }; duration: { value: number; rate: number } };
    markers?: unknown[];
    effects?: unknown[];
    enabled?: boolean;
    metadata?: AnyDictionary;
  }): Gap {
    const sourceRange = data.source_range ? TimeRange.fromJSON(data.source_range) : null;
    
    return new Gap(
      data.name || '',
      sourceRange,
      [], // Will be set by deserializer
      [], // Will be set by deserializer
      data.enabled !== false,
      data.metadata || {}
    );
  }
}

