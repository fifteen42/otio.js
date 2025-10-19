import { SerializableObject, AnyDictionary } from '../core/SerializableObject';

/**
 * Base class for effects that can be attached to clips and tracks.
 */
export abstract class Effect extends SerializableObject {
  private _effectName: string;

  constructor(name: string = '', effectName: string = '', metadata: AnyDictionary = {}) {
    super(name, metadata);
    this._effectName = effectName;
  }

  get effectName(): string {
    return this._effectName;
  }

  set effectName(value: string) {
    this._effectName = value;
  }

  abstract clone(): Effect;

  toJSON(): any {
    const result = super.toJSON();
    result.effect_name = this._effectName;
    return result;
  }
}

/**
 * A time effect (speed change, reverse, freeze frame, etc.)
 */
export class TimeEffect extends Effect {
  schemaName(): string {
    return 'TimeEffect';
  }

  clone(): TimeEffect {
    return new TimeEffect(this.name, this.effectName, { ...this.metadata });
  }

  static fromJSON(data: {
    name?: string;
    effect_name?: string;
    metadata?: AnyDictionary;
  }): TimeEffect {
    return new TimeEffect(data.name || '', data.effect_name || '', data.metadata || {});
  }
}

/**
 * A linear time warp effect.
 */
export class LinearTimeWarp extends TimeEffect {
  private _timeScalar: number;

  constructor(
    name: string = '',
    effectName: string = '',
    timeScalar: number = 1.0,
    metadata: AnyDictionary = {}
  ) {
    super(name, effectName, metadata);
    this._timeScalar = timeScalar;
  }

  get timeScalar(): number {
    return this._timeScalar;
  }

  set timeScalar(value: number) {
    this._timeScalar = value;
  }

  schemaName(): string {
    return 'LinearTimeWarp';
  }

  clone(): LinearTimeWarp {
    return new LinearTimeWarp(this.name, this.effectName, this._timeScalar, { ...this.metadata });
  }

  toJSON(): any {
    const result = super.toJSON();
    result.time_scalar = this._timeScalar;
    return result;
  }

  static fromJSON(data: {
    name?: string;
    effect_name?: string;
    time_scalar?: number;
    metadata?: AnyDictionary;
  }): LinearTimeWarp {
    return new LinearTimeWarp(
      data.name || '',
      data.effect_name || '',
      data.time_scalar || 1.0,
      data.metadata || {}
    );
  }
}

