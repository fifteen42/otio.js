import { SerializableObject, AnyDictionary } from '../core/SerializableObject';
import { Stack } from './Stack';
import { RationalTime } from '../opentime/RationalTime';
import { Composable } from './Composable';

/**
 * Timeline is the top-level container for OTIO data.
 * It contains a stack of tracks and global metadata.
 */
export class Timeline extends SerializableObject {
  private _tracks: Stack;
  private _globalStartTime: RationalTime | null;

  constructor(
    name: string = '',
    tracks: Stack = new Stack(),
    globalStartTime: RationalTime | null = null,
    metadata: AnyDictionary = {}
  ) {
    super(name, metadata);
    this._tracks = tracks;
    this._globalStartTime = globalStartTime;
  }

  get tracks(): Stack {
    return this._tracks;
  }

  set tracks(value: Stack) {
    this._tracks = value;
  }

  get globalStartTime(): RationalTime | null {
    return this._globalStartTime;
  }

  set globalStartTime(value: RationalTime | null) {
    this._globalStartTime = value;
  }

  schemaName(): string {
    return 'Timeline';
  }

  /**
   * Returns the duration of the timeline.
   */
  duration(): RationalTime | null {
    const tracksDuration = this._tracks.duration();
    return tracksDuration ? tracksDuration.duration : null;
  }

  /**
   * Find all clips in the timeline.
   */
  findClips(): Composable[] {
    return this._tracks.findClips();
  }

  /**
   * Find all video tracks.
   */
  videoTracks(): Composable[] {
    return this._tracks.children.filter(
      (track) => track.schemaName() === 'Track' && (track as any).kind === 'Video'
    );
  }

  /**
   * Find all audio tracks.
   */
  audioTracks(): Composable[] {
    return this._tracks.children.filter(
      (track) => track.schemaName() === 'Track' && (track as any).kind === 'Audio'
    );
  }

  clone(): Timeline {
    return new Timeline(
      this.name,
      this._tracks.clone() as Stack,
      this._globalStartTime,
      { ...this.metadata }
    );
  }

  toJSON() {
    const result: any = super.toJSON();
    result.tracks = this._tracks.toJSON();
    if (this._globalStartTime) {
      result.global_start_time = this._globalStartTime.toJSON();
    }
    return result;
  }

  static fromJSON(data: {
    name?: string;
    tracks?: Record<string, unknown>;
    global_start_time?: { value: number; rate: number };
    metadata?: AnyDictionary;
  }): Timeline {
    const globalStartTime = data.global_start_time
      ? RationalTime.fromJSON(data.global_start_time)
      : null;
    
    return new Timeline(
      data.name || '',
      new Stack(), // Will be set by deserializer
      globalStartTime,
      data.metadata || {}
    );
  }
}

