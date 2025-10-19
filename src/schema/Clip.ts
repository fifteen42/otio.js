import { Composable } from './Composable';
import { MediaReference } from './MediaReference';
import { TimeRange } from '../opentime/TimeRange';
import { Marker } from './Marker';
import { Effect } from './Effect';
import { AnyDictionary } from '../core/SerializableObject';

/**
 * Clip represents a segment of media.
 */
export class Clip extends Composable {
  private _mediaReference: MediaReference | null;
  private _sourceRange: TimeRange | null;

  constructor(
    name: string = '',
    mediaReference: MediaReference | null = null,
    sourceRange: TimeRange | null = null,
    markers: Marker[] = [],
    effects: Effect[] = [],
    enabled: boolean = true,
    metadata: AnyDictionary = {}
  ) {
    super(name, markers, effects, enabled, metadata);
    this._mediaReference = mediaReference;
    this._sourceRange = sourceRange;
  }

  get mediaReference(): MediaReference | null {
    return this._mediaReference;
  }

  set mediaReference(value: MediaReference | null) {
    this._mediaReference = value;
  }

  get sourceRange(): TimeRange | null {
    return this._sourceRange;
  }

  set sourceRange(value: TimeRange | null) {
    this._sourceRange = value;
  }

  schemaName(): string {
    return 'Clip';
  }

  duration(): TimeRange | null {
    return this._sourceRange;
  }

  /**
   * Returns the available range from the media reference.
   */
  availableRange(): TimeRange | null {
    return this._mediaReference?.availableRange || null;
  }

  clone(): Clip {
    return new Clip(
      this.name,
      this._mediaReference?.clone() || null,
      this._sourceRange,
      this.markers.map((m) => m.clone()),
      this.effects.map((e) => e.clone()),
      this.enabled,
      { ...this.metadata }
    );
  }

  toJSON(): any {
    const result = super.toJSON();
    if (this._mediaReference) {
      result.media_reference = this._mediaReference.toJSON();
    }
    if (this._sourceRange) {
      result.source_range = this._sourceRange.toJSON();
    }
    return result;
  }

  static fromJSON(data: {
    name?: string;
    media_reference?: Record<string, unknown>;
    source_range?: { start_time: { value: number; rate: number }; duration: { value: number; rate: number } };
    markers?: unknown[];
    effects?: unknown[];
    enabled?: boolean;
    metadata?: AnyDictionary;
  }): Clip {
    // Note: media_reference deserialization would need a factory pattern
    // For now, we'll handle it in the main deserializer
    const sourceRange = data.source_range ? TimeRange.fromJSON(data.source_range) : null;
    
    return new Clip(
      data.name || '',
      null, // Will be set by deserializer
      sourceRange,
      [], // Will be set by deserializer
      [], // Will be set by deserializer
      data.enabled !== false,
      data.metadata || {}
    );
  }
}

