# Examples

This directory contains example code and files demonstrating how to use otio.js.

## Files

### TypeScript Examples

- **`create-timeline.ts`** - How to create a timeline from scratch programmatically
- **`read-and-modify.ts`** - How to read an OTIO file and modify its contents
- **`time-calculations.ts`** - Working with time values, ranges, and conversions
- **`browser-example.html`** - Interactive browser example with file upload and visualization

### Sample OTIO File

- **`sample-timeline.otio`** - A sample OpenTimelineIO file you can use for testing

## Running the Examples

### Node.js Examples

```bash
# Install ts-node if you haven't already
npm install -g ts-node

# Run an example
ts-node examples/create-timeline.ts
ts-node examples/time-calculations.ts
ts-node examples/read-and-modify.ts
```

### Browser Example

Open `browser-example.html` in a modern web browser. You'll need to:

1. Build the library first:
```bash
npm run build
```

2. Serve the files with a local web server (due to ES modules and CORS):
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js http-server
npx http-server
```

3. Open `http://localhost:8000/examples/browser-example.html` in your browser

## Example: Quick Start

```typescript
import { readTimelineFromFile, Timeline, Clip } from 'opentimelineio';

// Read a timeline
const timeline = await readTimelineFromFile('sample-timeline.otio');

// Get all clips
const clips = timeline.findClips();
console.log(`Found ${clips.length} clips`);

// Iterate through clips
clips.forEach((composable) => {
  if (composable instanceof Clip) {
    const clip = composable as Clip;
    console.log(`Clip: ${clip.name}`);
    console.log(`  Duration: ${clip.duration()?.duration.toSeconds()}s`);
  }
});
```

## More Information

See the main [README.md](../README.md) for complete API documentation.

