import { Composable } from './Composable';
import { TimeRange } from '../opentime/TimeRange';
import { RationalTime } from '../opentime/RationalTime';
import { Marker } from './Marker';
import { Effect } from './Effect';
import { AnyDictionary } from '../core/SerializableObject';

/**
 * Transition represents a transition between two clips.
 */
export class Transition extends Composable {
  private _transitionType: string;
  private _inOffset: RationalTime;
  private _outOffset: RationalTime;

  constructor(
    name: string = '',
    transitionType: string = '',
    inOffset: RationalTime = new RationalTime(0, 24),
    outOffset: RationalTime = new RationalTime(0, 24),
    markers: Marker[] = [],
    effects: Effect[] = [],
    enabled: boolean = true,
    metadata: AnyDictionary = {}
  ) {
    super(name, markers, effects, enabled, metadata);
    this._transitionType = transitionType;
    this._inOffset = inOffset;
    this._outOffset = outOffset;
  }

  get transitionType(): string {
    return this._transitionType;
  }

  set transitionType(value: string) {
    this._transitionType = value;
  }

  get inOffset(): RationalTime {
    return this._inOffset;
  }

  set inOffset(value: RationalTime) {
    this._inOffset = value;
  }

  get outOffset(): RationalTime {
    return this._outOffset;
  }

  set outOffset(value: RationalTime) {
    this._outOffset = value;
  }

  schemaName(): string {
    return 'Transition';
  }

  duration(): TimeRange | null {
    const totalDuration = this._inOffset.add(this._outOffset);
    return new TimeRange(new RationalTime(0, totalDuration.rate), totalDuration);
  }

  clone(): Transition {
    return new Transition(
      this.name,
      this._transitionType,
      this._inOffset,
      this._outOffset,
      this.markers.map((m) => m.clone()),
      this.effects.map((e) => e.clone()),
      this.enabled,
      { ...this.metadata }
    );
  }

  toJSON(): any {
    const result = super.toJSON();
    result.transition_type = this._transitionType;
    result.in_offset = this._inOffset.toJSON();
    result.out_offset = this._outOffset.toJSON();
    return result;
  }

  static fromJSON(data: {
    name?: string;
    transition_type?: string;
    in_offset: { value: number; rate: number };
    out_offset: { value: number; rate: number };
    markers?: unknown[];
    effects?: unknown[];
    enabled?: boolean;
    metadata?: AnyDictionary;
  }): Transition {
    return new Transition(
      data.name || '',
      data.transition_type || '',
      RationalTime.fromJSON(data.in_offset),
      RationalTime.fromJSON(data.out_offset),
      [], // Will be set by deserializer
      [], // Will be set by deserializer
      data.enabled !== false,
      data.metadata || {}
    );
  }
}

