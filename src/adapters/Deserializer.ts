import { SerializableObject } from '../core/SerializableObject';
import { Timeline } from '../schema/Timeline';
import { Stack } from '../schema/Stack';
import { Track } from '../schema/Track';
import { Clip } from '../schema/Clip';
import { Gap } from '../schema/Gap';
import { Transition } from '../schema/Transition';
import { Marker } from '../schema/Marker';
import { TimeEffect, LinearTimeWarp } from '../schema/Effect';
import { ExternalReference, GeneratorReference, MissingReference } from '../schema/MediaReference';

type SchemaData = Record<string, unknown> & {
  OTIO_SCHEMA?: string;
};

/**
 * Factory class for deserializing OTIO JSON data.
 */
export class Deserializer {
  /**
   * Deserialize any OTIO object from JSON data.
   */
  static deserialize(data: SchemaData): SerializableObject | null {
    if (!data || !data.OTIO_SCHEMA) {
      return null;
    }

    const schemaName = this.parseSchemaName(data.OTIO_SCHEMA as string);

    switch (schemaName) {
      case 'Timeline':
        return this.deserializeTimeline(data);
      case 'Stack':
        return this.deserializeStack(data);
      case 'Track':
        return this.deserializeTrack(data);
      case 'Clip':
        return this.deserializeClip(data);
      case 'Gap':
        return this.deserializeGap(data);
      case 'Transition':
        return this.deserializeTransition(data);
      case 'Marker':
        return this.deserializeMarker(data);
      case 'TimeEffect':
        return this.deserializeTimeEffect(data);
      case 'LinearTimeWarp':
        return this.deserializeLinearTimeWarp(data);
      case 'ExternalReference':
        return this.deserializeExternalReference(data);
      case 'GeneratorReference':
        return this.deserializeGeneratorReference(data);
      case 'MissingReference':
        return this.deserializeMissingReference(data);
      default:
        console.warn(`Unknown schema type: ${schemaName}`);
        return null;
    }
  }

  private static parseSchemaName(schema: string): string {
    // Schema format: "SchemaName.version"
    return schema.split('.')[0];
  }

  private static deserializeTimeline(data: SchemaData): Timeline {
    const timeline = Timeline.fromJSON(data as any);
    
    if (data.tracks) {
      const tracks = this.deserialize(data.tracks as SchemaData);
      if (tracks && tracks instanceof Stack) {
        timeline.tracks = tracks;
      }
    }

    return timeline;
  }

  private static deserializeStack(data: SchemaData): Stack {
    const stack = Stack.fromJSON(data as any);
    
    if (data.children && Array.isArray(data.children)) {
      stack.children = data.children
        .map((child) => this.deserialize(child as SchemaData))
        .filter((c) => c !== null) as any[];
    }

    if (data.markers && Array.isArray(data.markers)) {
      stack.markers = data.markers
        .map((marker) => this.deserialize(marker as SchemaData))
        .filter((m) => m !== null && m instanceof Marker) as Marker[];
    }

    if (data.effects && Array.isArray(data.effects)) {
      stack.effects = data.effects
        .map((effect) => this.deserialize(effect as SchemaData))
        .filter((e) => e !== null) as any[];
    }

    return stack;
  }

  private static deserializeTrack(data: SchemaData): Track {
    const track = Track.fromJSON(data as any);
    
    if (data.children && Array.isArray(data.children)) {
      track.children = data.children
        .map((child) => this.deserialize(child as SchemaData))
        .filter((c) => c !== null) as any[];
    }

    if (data.markers && Array.isArray(data.markers)) {
      track.markers = data.markers
        .map((marker) => this.deserialize(marker as SchemaData))
        .filter((m) => m !== null && m instanceof Marker) as Marker[];
    }

    if (data.effects && Array.isArray(data.effects)) {
      track.effects = data.effects
        .map((effect) => this.deserialize(effect as SchemaData))
        .filter((e) => e !== null) as any[];
    }

    return track;
  }

  private static deserializeClip(data: SchemaData): Clip {
    const clip = Clip.fromJSON(data as any);
    
    if (data.media_reference) {
      const mediaRef = this.deserialize(data.media_reference as SchemaData);
      if (mediaRef) {
        clip.mediaReference = mediaRef as any;
      }
    }

    if (data.markers && Array.isArray(data.markers)) {
      clip.markers = data.markers
        .map((marker) => this.deserialize(marker as SchemaData))
        .filter((m) => m !== null && m instanceof Marker) as Marker[];
    }

    if (data.effects && Array.isArray(data.effects)) {
      clip.effects = data.effects
        .map((effect) => this.deserialize(effect as SchemaData))
        .filter((e) => e !== null) as any[];
    }

    return clip;
  }

  private static deserializeGap(data: SchemaData): Gap {
    const gap = Gap.fromJSON(data as any);
    
    if (data.markers && Array.isArray(data.markers)) {
      gap.markers = data.markers
        .map((marker) => this.deserialize(marker as SchemaData))
        .filter((m) => m !== null && m instanceof Marker) as Marker[];
    }

    if (data.effects && Array.isArray(data.effects)) {
      gap.effects = data.effects
        .map((effect) => this.deserialize(effect as SchemaData))
        .filter((e) => e !== null) as any[];
    }

    return gap;
  }

  private static deserializeTransition(data: SchemaData): Transition {
    const transition = Transition.fromJSON(data as any);
    
    if (data.markers && Array.isArray(data.markers)) {
      transition.markers = data.markers
        .map((marker) => this.deserialize(marker as SchemaData))
        .filter((m) => m !== null && m instanceof Marker) as Marker[];
    }

    if (data.effects && Array.isArray(data.effects)) {
      transition.effects = data.effects
        .map((effect) => this.deserialize(effect as SchemaData))
        .filter((e) => e !== null) as any[];
    }

    return transition;
  }

  private static deserializeMarker(data: SchemaData): Marker {
    return Marker.fromJSON(data as any);
  }

  private static deserializeTimeEffect(data: SchemaData): TimeEffect {
    return TimeEffect.fromJSON(data as any);
  }

  private static deserializeLinearTimeWarp(data: SchemaData): LinearTimeWarp {
    return LinearTimeWarp.fromJSON(data as any);
  }

  private static deserializeExternalReference(data: SchemaData): ExternalReference {
    return ExternalReference.fromJSON(data as any);
  }

  private static deserializeGeneratorReference(data: SchemaData): GeneratorReference {
    return GeneratorReference.fromJSON(data as any);
  }

  private static deserializeMissingReference(data: SchemaData): MissingReference {
    return MissingReference.fromJSON(data as any);
  }

  /**
   * Read OTIO from a JSON string.
   */
  static fromJSONString(jsonString: string): SerializableObject | null {
    try {
      const data = JSON.parse(jsonString);
      return this.deserialize(data);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return null;
    }
  }
}

