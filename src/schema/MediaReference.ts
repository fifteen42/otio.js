import { SerializableObject, AnyDictionary } from '../core/SerializableObject';
import { TimeRange } from '../opentime/TimeRange';

/**
 * Base class for media references.
 */
export abstract class MediaReference extends SerializableObject {
  private _availableRange: TimeRange | null;

  constructor(name: string = '', availableRange: TimeRange | null = null, metadata: AnyDictionary = {}) {
    super(name, metadata);
    this._availableRange = availableRange;
  }

  get availableRange(): TimeRange | null {
    return this._availableRange;
  }

  set availableRange(value: TimeRange | null) {
    this._availableRange = value;
  }

  abstract clone(): MediaReference;

  toJSON(): any {
    const result = super.toJSON();
    if (this._availableRange) {
      result.available_range = this._availableRange.toJSON();
    }
    return result;
  }
}

/**
 * Reference to media via a URL or file path.
 */
export class ExternalReference extends MediaReference {
  private _targetUrl: string;

  constructor(
    targetUrl: string = '',
    availableRange: TimeRange | null = null,
    name: string = '',
    metadata: AnyDictionary = {}
  ) {
    super(name, availableRange, metadata);
    this._targetUrl = targetUrl;
  }

  get targetUrl(): string {
    return this._targetUrl;
  }

  set targetUrl(value: string) {
    this._targetUrl = value;
  }

  schemaName(): string {
    return 'ExternalReference';
  }

  clone(): ExternalReference {
    return new ExternalReference(
      this._targetUrl,
      this.availableRange,
      this.name,
      { ...this.metadata }
    );
  }

  toJSON(): any {
    const result = super.toJSON();
    result.target_url = this._targetUrl;
    return result;
  }

  static fromJSON(data: {
    target_url?: string;
    available_range?: { start_time: { value: number; rate: number }; duration: { value: number; rate: number } };
    name?: string;
    metadata?: AnyDictionary;
  }): ExternalReference {
    const availableRange = data.available_range ? TimeRange.fromJSON(data.available_range) : null;
    return new ExternalReference(
      data.target_url || '',
      availableRange,
      data.name || '',
      data.metadata || {}
    );
  }
}

/**
 * Reference to media via a generator plugin.
 */
export class GeneratorReference extends MediaReference {
  private _generatorKind: string;
  private _parameters: AnyDictionary;

  constructor(
    generatorKind: string = '',
    parameters: AnyDictionary = {},
    availableRange: TimeRange | null = null,
    name: string = '',
    metadata: AnyDictionary = {}
  ) {
    super(name, availableRange, metadata);
    this._generatorKind = generatorKind;
    this._parameters = parameters;
  }

  get generatorKind(): string {
    return this._generatorKind;
  }

  set generatorKind(value: string) {
    this._generatorKind = value;
  }

  get parameters(): AnyDictionary {
    return this._parameters;
  }

  set parameters(value: AnyDictionary) {
    this._parameters = value;
  }

  schemaName(): string {
    return 'GeneratorReference';
  }

  clone(): GeneratorReference {
    return new GeneratorReference(
      this._generatorKind,
      { ...this._parameters },
      this.availableRange,
      this.name,
      { ...this.metadata }
    );
  }

  toJSON(): any {
    const result = super.toJSON();
    result.generator_kind = this._generatorKind;
    result.parameters = this._parameters;
    return result;
  }

  static fromJSON(data: {
    generator_kind?: string;
    parameters?: AnyDictionary;
    available_range?: { start_time: { value: number; rate: number }; duration: { value: number; rate: number } };
    name?: string;
    metadata?: AnyDictionary;
  }): GeneratorReference {
    const availableRange = data.available_range ? TimeRange.fromJSON(data.available_range) : null;
    return new GeneratorReference(
      data.generator_kind || '',
      data.parameters || {},
      availableRange,
      data.name || '',
      data.metadata || {}
    );
  }
}

/**
 * Reference to media that is missing or offline.
 */
export class MissingReference extends MediaReference {
  schemaName(): string {
    return 'MissingReference';
  }

  clone(): MissingReference {
    return new MissingReference(this.name, this.availableRange, { ...this.metadata });
  }

  static fromJSON(data: {
    available_range?: { start_time: { value: number; rate: number }; duration: { value: number; rate: number } };
    name?: string;
    metadata?: AnyDictionary;
  }): MissingReference {
    const availableRange = data.available_range ? TimeRange.fromJSON(data.available_range) : null;
    return new MissingReference(data.name || '', availableRange, data.metadata || {});
  }
}

