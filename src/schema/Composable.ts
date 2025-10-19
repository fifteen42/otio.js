import { SerializableObject, AnyDictionary } from '../core/SerializableObject';
import { TimeRange } from '../opentime/TimeRange';
import { Marker } from './Marker';
import { Effect } from './Effect';

/**
 * Base class for objects that can be composed into a sequence.
 */
export abstract class Composable extends SerializableObject {
  private _markers: Marker[];
  private _effects: Effect[];
  private _enabled: boolean;

  constructor(
    name: string = '',
    markers: Marker[] = [],
    effects: Effect[] = [],
    enabled: boolean = true,
    metadata: AnyDictionary = {}
  ) {
    super(name, metadata);
    this._markers = markers;
    this._effects = effects;
    this._enabled = enabled;
  }

  get markers(): Marker[] {
    return this._markers;
  }

  set markers(value: Marker[]) {
    this._markers = value;
  }

  get effects(): Effect[] {
    return this._effects;
  }

  set effects(value: Effect[]) {
    this._effects = value;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  /**
   * Returns the duration of this composable object.
   */
  abstract duration(): TimeRange | null;

  abstract clone(): Composable;

  toJSON(): any {
    const result = super.toJSON();
    if (this._markers.length > 0) {
      result.markers = this._markers.map((m) => m.toJSON());
    }
    if (this._effects.length > 0) {
      result.effects = this._effects.map((e) => e.toJSON());
    }
    if (!this._enabled) {
      result.enabled = this._enabled;
    }
    return result;
  }
}

