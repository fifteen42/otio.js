// OpenTimelineIO JavaScript/TypeScript Implementation

// Export opentime (time-related classes)
export * from './opentime';

// Export core
export { SerializableObject, AnyDictionary } from './core/SerializableObject';

// Export schema classes
export * from './schema';

// Export adapters
export {
  OTIOAdapter,
  readTimelineFromString,
  readTimelineFromFile,
  writeTimelineToString,
  downloadTimeline,
} from './adapters/OTIOAdapter';

export { Deserializer } from './adapters/Deserializer';

// Version
export const VERSION = '0.1.0';

