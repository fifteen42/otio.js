import { Composable } from './Composable';
import { TimeRange } from '../opentime/TimeRange';
import { RationalTime } from '../opentime/RationalTime';
import { Marker } from './Marker';
import { Effect } from './Effect';
import { AnyDictionary } from '../core/SerializableObject';

/**
 * Base class for compositions that contain other composable objects.
 */
export abstract class Composition extends Composable {
  private _children: Composable[];

  constructor(
    name: string = '',
    children: Composable[] = [],
    markers: Marker[] = [],
    effects: Effect[] = [],
    enabled: boolean = true,
    metadata: AnyDictionary = {}
  ) {
    super(name, markers, effects, enabled, metadata);
    this._children = children;
  }

  get children(): Composable[] {
    return this._children;
  }

  set children(value: Composable[]) {
    this._children = value;
  }

  /**
   * Append a child to the composition.
   */
  appendChild(child: Composable): void {
    this._children.push(child);
  }

  /**
   * Insert a child at the specified index.
   */
  insertChild(index: number, child: Composable): void {
    this._children.splice(index, 0, child);
  }

  /**
   * Remove a child from the composition.
   */
  removeChild(index: number): Composable | undefined {
    return this._children.splice(index, 1)[0];
  }

  /**
   * Find all clips recursively in this composition.
   */
  findClips(): Composable[] {
    const clips: Composable[] = [];
    
    for (const child of this._children) {
      if (child.schemaName() === 'Clip') {
        clips.push(child);
      } else if (child instanceof Composition) {
        clips.push(...child.findClips());
      }
    }
    
    return clips;
  }

  /**
   * Returns the duration of this composition.
   */
  duration(): TimeRange | null {
    if (this._children.length === 0) {
      return null;
    }

    let totalDuration = new RationalTime(0, 24);
    
    for (const child of this._children) {
      const childDuration = child.duration();
      if (childDuration) {
        totalDuration = totalDuration.add(childDuration.duration);
      }
    }

    return new TimeRange(new RationalTime(0, totalDuration.rate), totalDuration);
  }

  abstract clone(): Composition;

  toJSON(): any {
    const result = super.toJSON();
    if (this._children.length > 0) {
      result.children = this._children.map((c) => c.toJSON());
    }
    return result;
  }
}

