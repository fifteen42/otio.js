# otio.js

[![npm version](https://img.shields.io/npm/v/otio.js.svg)](https://www.npmjs.com/package/otio.js)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

JavaScript/TypeScript implementation of [OpenTimelineIO](http://opentimeline.io/) - an interchange format and API for editorial timeline information.

## Features

- 🎬 **Complete OTIO Schema Support** - Timeline, Track, Clip, Transition, Marker, and more
- ⏱️ **Powerful Time Classes** - RationalTime, TimeRange, TimeTransform for precise time calculations
- 📦 **Browser-Friendly** - Works seamlessly in modern browsers (no Node.js dependencies required)
- 🔄 **Full Serialization** - Read and write OTIO JSON files
- 📝 **TypeScript Support** - Full type definitions included
- 🚀 **Zero Dependencies** - Lightweight and fast

## Installation

```bash
npm install otio.js
```

Or using yarn:

```bash
yarn add otio.js
```

## Quick Start

### Reading an OTIO File

```typescript
import { readTimelineFromFile } from 'otio.js';

// Read from URL
const timeline = await readTimelineFromFile('/path/to/timeline.otio');
console.log(`Timeline: ${timeline.name}`);
console.log(`Duration: ${timeline.duration()}`);

// Find all clips
const clips = timeline.findClips();
clips.forEach((clip) => {
  console.log(`Clip: ${clip.name}`);
});
```

### Creating a Timeline Programmatically

```typescript
import {
  Timeline,
  Stack,
  Track,
  Clip,
  ExternalReference,
  RationalTime,
  TimeRange,
  TrackKind,
} from 'otio.js';

// Create a timeline
const timeline = new Timeline('My Timeline');

// Create a stack of tracks
const stack = new Stack('Main Stack');

// Create a video track
const videoTrack = new Track('Video Track 1', [], TrackKind.VIDEO);

// Create a clip with media reference
const mediaRef = new ExternalReference('/path/to/media.mov');
const sourceRange = new TimeRange(
  RationalTime.fromFrames(0, 24),
  RationalTime.fromFrames(100, 24)
);

const clip = new Clip('My Clip', mediaRef, sourceRange);

// Add clip to track
videoTrack.appendChild(clip);

// Add track to stack
stack.appendChild(videoTrack);

// Add stack to timeline
timeline.tracks = stack;

// Export to JSON
const jsonString = timeline.toJSONString(2);
console.log(jsonString);
```

### Working with Time

```typescript
import { RationalTime, TimeRange } from 'otio.js';

// Create time from frames
const time1 = RationalTime.fromFrames(100, 24); // 100 frames at 24fps

// Create time from seconds
const time2 = RationalTime.fromSeconds(5.0, 24); // 5 seconds at 24fps

// Time arithmetic
const sum = time1.add(time2);
const diff = time1.subtract(time2);

// Convert to different units
console.log(time1.toSeconds()); // Convert to seconds
console.log(time1.toTimecode()); // Get timecode string "HH:MM:SS:FF"

// Create a time range
const range = new TimeRange(
  RationalTime.fromFrames(0, 24),
  RationalTime.fromFrames(100, 24)
);

console.log(range.durationSeconds()); // Duration in seconds
```

### Adding Markers

```typescript
import { Marker, MarkerColor, TimeRange, RationalTime } from 'otio.js';

const marker = new Marker(
  'Important moment',
  new TimeRange(
    RationalTime.fromFrames(50, 24),
    RationalTime.fromFrames(1, 24)
  ),
  MarkerColor.RED,
  'This is an important frame'
);

clip.markers.push(marker);
```

### File Upload in Browser

```html
<input type="file" id="otioFile" accept=".otio" />

<script type="module">
  import { OTIOAdapter } from 'otio.js';

  document.getElementById('otioFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const timeline = await OTIOAdapter.readFromFileObject(file);
    
    if (timeline) {
      console.log('Timeline loaded:', timeline.name);
      console.log('Clips:', timeline.findClips().length);
    }
  });
</script>
```

### Downloading a Timeline

```typescript
import { downloadTimeline } from 'otio.js';

// Download timeline as a file
downloadTimeline(timeline, 'my-timeline.otio');
```

## API Documentation

### Core Classes

#### Timeline
The top-level container for OTIO data.

```typescript
const timeline = new Timeline(name, tracks, globalStartTime, metadata);
timeline.duration(); // Get timeline duration
timeline.findClips(); // Find all clips recursively
timeline.videoTracks(); // Get all video tracks
timeline.audioTracks(); // Get all audio tracks
```

#### Track
Represents a sequence of clips, gaps, and transitions.

```typescript
const track = new Track(name, children, kind, sourceRange, markers, effects);
track.kind; // TrackKind.VIDEO or TrackKind.AUDIO
track.appendChild(clip); // Add a child
```

#### Clip
Represents a segment of media.

```typescript
const clip = new Clip(name, mediaReference, sourceRange, markers, effects);
clip.duration(); // Get clip duration
clip.availableRange(); // Get available media range
```

#### RationalTime
Represents time as a rational number (value/rate).

```typescript
const time = new RationalTime(value, rate);
const time = RationalTime.fromFrames(100, 24);
const time = RationalTime.fromSeconds(5.0, 24);
const time = RationalTime.fromTimecode('01:00:30:15', 24);
```

#### TimeRange
Represents a range in time.

```typescript
const range = new TimeRange(startTime, duration);
const range = TimeRange.fromStartEndTime(startTime, endTime);
range.contains(time); // Check if time is in range
range.overlaps(otherRange); // Check if ranges overlap
```

### Media References

#### ExternalReference
Reference to external media file.

```typescript
const mediaRef = new ExternalReference(
  '/path/to/media.mov',
  availableRange,
  name,
  metadata
);
```

#### GeneratorReference
Reference to generated media (color bars, test patterns, etc.).

```typescript
const genRef = new GeneratorReference(
  'SolidColor',
  { color: [1, 0, 0] },
  availableRange
);
```

### Effects

#### LinearTimeWarp
Time scaling effect (speed changes).

```typescript
const effect = new LinearTimeWarp('speed', '', 2.0); // 2x speed
clip.effects.push(effect);
```

## Browser Usage

You can use otio.js directly in the browser via CDN:

```html
<script type="module">
  import { Timeline, readTimelineFromFile } from 'https://unpkg.com/otio.js@latest/dist/index.mjs';
  
  const timeline = await readTimelineFromFile('/timeline.otio');
  console.log(timeline);
</script>
```

## TypeScript Support

otio.js is written in TypeScript and includes full type definitions:

```typescript
import type { Timeline, Clip, Track } from 'otio.js';

function processTimeline(timeline: Timeline): void {
  const clips: Clip[] = timeline.findClips();
  // TypeScript knows the exact types
}
```

## Examples

Check out the [examples](./examples) directory for more usage examples:

- [Basic Timeline Creation](./examples/create-timeline.ts)
- [Reading and Modifying OTIO Files](./examples/read-and-modify.ts)
- [Time Calculations](./examples/time-calculations.ts)
- [Browser Integration](./examples/browser-example.html)

## Differences from Python OTIO

This JavaScript implementation maintains API compatibility with the official Python OpenTimelineIO where possible, with these differences:

- Snake_case properties are converted to camelCase (JavaScript convention)
- File I/O is adapted for browser environments (using fetch and Blob APIs)
- No plugin system (may be added in future versions)
- Subset of adapter formats (native .otio JSON only)

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Lint code
npm run lint

# Format code
npm run format
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

This is an unofficial JavaScript implementation. The official OpenTimelineIO project is maintained by the Academy Software Foundation at https://github.com/AcademySoftwareFoundation/OpenTimelineIO

## Related Projects

- [OpenTimelineIO](https://github.com/AcademySoftwareFoundation/OpenTimelineIO) - Official Python/C++ implementation
- [OpenTimelineIO Documentation](https://opentimelineio.readthedocs.io/)
