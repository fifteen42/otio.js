/**
 * Base class for all serializable objects in OTIO.
 * Provides common metadata functionality and serialization support.
 */

export interface AnyDictionary {
  [key: string]: unknown;
}

export interface SerializableObjectData {
  OTIO_SCHEMA: string;
  name?: string;
  metadata?: AnyDictionary;
}

export abstract class SerializableObject {
  private _name: string;
  private _metadata: AnyDictionary;

  constructor(name: string = '', metadata: AnyDictionary = {}) {
    this._name = name;
    this._metadata = metadata;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get metadata(): AnyDictionary {
    return this._metadata;
  }

  set metadata(value: AnyDictionary) {
    this._metadata = value;
  }

  /**
   * Returns the schema name for this object type.
   */
  abstract schemaName(): string;

  /**
   * Returns the schema version.
   */
  schemaVersion(): number {
    return 1;
  }

  /**
   * Deep clone this object.
   */
  abstract clone(): SerializableObject;

  /**
   * Check if two objects are equal.
   */
  equals(other: SerializableObject): boolean {
    return (
      this.schemaName() === other.schemaName() &&
      this._name === other._name &&
      JSON.stringify(this._metadata) === JSON.stringify(other._metadata)
    );
  }

  /**
   * Serialize to JSON-compatible object.
   */
  toJSON(): any {
    return {
      OTIO_SCHEMA: `${this.schemaName()}.${this.schemaVersion()}`,
      name: this._name || undefined,
      metadata: Object.keys(this._metadata).length > 0 ? this._metadata : undefined,
    };
  }

  /**
   * Returns a JSON string representation.
   */
  toJSONString(indent?: number): string {
    return JSON.stringify(this.toJSON(), null, indent);
  }
}

