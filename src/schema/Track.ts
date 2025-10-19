import { Composition } from './Composition';
import { Composable } from './Composable';
import { TimeRange } from '../opentime/TimeRange';
import { Marker } from './Marker';
import { Effect } from './Effect';
import { AnyDictionary } from '../core/SerializableObject';

export enum TrackKind {
  VIDEO = 'Video',
  AUDIO = 'Audio',
}

/**
 * Track represents a sequence of composable objects.
 */
export class Track extends Composition {
  private _kind: TrackKind | string;
  private _sourceRange: TimeRange | null;

  constructor(
    name: string = '',
    children: Composable[] = [],
    kind: TrackKind | string = TrackKind.VIDEO,
    sourceRange: TimeRange | null = null,
    markers: Marker[] = [],
    effects: Effect[] = [],
    enabled: boolean = true,
    metadata: AnyDictionary = {}
  ) {
    super(name, children, markers, effects, enabled, metadata);
    this._kind = kind;
    this._sourceRange = sourceRange;
  }

  get kind(): TrackKind | string {
    return this._kind;
  }

  set kind(value: TrackKind | string) {
    this._kind = value;
  }

  get sourceRange(): TimeRange | null {
    return this._sourceRange;
  }

  set sourceRange(value: TimeRange | null) {
    this._sourceRange = value;
  }

  schemaName(): string {
    return 'Track';
  }

  /**
   * Returns the trimmed range of the track.
   */
  duration(): TimeRange | null {
    if (this._sourceRange) {
      return this._sourceRange;
    }
    return super.duration();
  }

  clone(): Track {
    return new Track(
      this.name,
      this.children.map((c) => c.clone()),
      this._kind,
      this._sourceRange,
      this.markers.map((m) => m.clone()),
      this.effects.map((e) => e.clone()),
      this.enabled,
      { ...this.metadata }
    );
  }

  toJSON(): any {
    const result = super.toJSON();
    result.kind = this._kind;
    if (this._sourceRange) {
      result.source_range = this._sourceRange.toJSON();
    }
    return result;
  }

  static fromJSON(data: {
    name?: string;
    children?: unknown[];
    kind?: string;
    source_range?: { start_time: { value: number; rate: number }; duration: { value: number; rate: number } };
    markers?: unknown[];
    effects?: unknown[];
    enabled?: boolean;
    metadata?: AnyDictionary;
  }): Track {
    const sourceRange = data.source_range ? TimeRange.fromJSON(data.source_range) : null;
    
    return new Track(
      data.name || '',
      [], // Will be set by deserializer
      data.kind || TrackKind.VIDEO,
      sourceRange,
      [], // Will be set by deserializer
      [], // Will be set by deserializer
      data.enabled !== false,
      data.metadata || {}
    );
  }
}

