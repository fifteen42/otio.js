import { SerializableObject } from '../core/SerializableObject';
import { Timeline } from '../schema/Timeline';
import { Deserializer } from './Deserializer';

/**
 * Adapter for reading and writing OTIO JSON files.
 */
export class OTIOAdapter {
  /**
   * Read OTIO from a JSON string.
   */
  static readFromString(otioJson: string): SerializableObject | null {
    return Deserializer.fromJSONString(otioJson);
  }

  /**
   * Write OTIO object to a JSON string.
   */
  static writeToString(otioObject: SerializableObject, indent: number = 4): string {
    return otioObject.toJSONString(indent);
  }

  /**
   * Read OTIO from a file (Browser environment using fetch).
   */
  static async readFromFile(url: string): Promise<SerializableObject | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonString = await response.text();
      return this.readFromString(jsonString);
    } catch (error) {
      console.error('Failed to read OTIO file:', error);
      return null;
    }
  }

  /**
   * Read OTIO from a File object (Browser file upload).
   */
  static async readFromFileObject(file: File): Promise<SerializableObject | null> {
    try {
      const jsonString = await file.text();
      return this.readFromString(jsonString);
    } catch (error) {
      console.error('Failed to read OTIO file:', error);
      return null;
    }
  }

  /**
   * Download OTIO object as a file in the browser.
   */
  static downloadAsFile(
    otioObject: SerializableObject,
    filename: string = 'timeline.otio'
  ): void {
    const jsonString = this.writeToString(otioObject);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}

/**
 * Convenience functions for common operations.
 */

/**
 * Read a Timeline from a JSON string.
 */
export function readTimelineFromString(otioJson: string): Timeline | null {
  const result = OTIOAdapter.readFromString(otioJson);
  return result instanceof Timeline ? result : null;
}

/**
 * Read a Timeline from a URL.
 */
export async function readTimelineFromFile(url: string): Promise<Timeline | null> {
  const result = await OTIOAdapter.readFromFile(url);
  return result instanceof Timeline ? result : null;
}

/**
 * Write a Timeline to a JSON string.
 */
export function writeTimelineToString(timeline: Timeline, indent: number = 4): string {
  return timeline.toJSONString(indent);
}

/**
 * Download a Timeline as a file.
 */
export function downloadTimeline(timeline: Timeline, filename: string = 'timeline.otio'): void {
  const jsonString = timeline.toJSONString(4);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

