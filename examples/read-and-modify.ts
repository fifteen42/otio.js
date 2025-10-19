/**
 * Example: Reading and Modifying OTIO Files
 * This example shows how to read an OTIO file and modify its contents.
 */

import {
  readTimelineFromString,
  Timeline,
  Clip,
  Marker,
  MarkerColor,
  RationalTime,
  TimeRange,
  ExternalReference,
} from '../src/index';

// Example OTIO JSON (in a real scenario, you'd load this from a file)
const exampleOTIO = `{
  "OTIO_SCHEMA": "Timeline.1",
  "name": "Example Timeline",
  "tracks": {
    "OTIO_SCHEMA": "Stack.1",
    "name": "tracks",
    "children": [
      {
        "OTIO_SCHEMA": "Track.1",
        "name": "Video",
        "kind": "Video",
        "children": [
          {
            "OTIO_SCHEMA": "Clip.1",
            "name": "Clip 1",
            "source_range": {
              "start_time": {
                "value": 0,
                "rate": 24
              },
              "duration": {
                "value": 100,
                "rate": 24
              }
            },
            "media_reference": {
              "OTIO_SCHEMA": "ExternalReference.1",
              "target_url": "file:///media/clip1.mov"
            }
          },
          {
            "OTIO_SCHEMA": "Clip.1",
            "name": "Clip 2",
            "source_range": {
              "start_time": {
                "value": 0,
                "rate": 24
              },
              "duration": {
                "value": 150,
                "rate": 24
              }
            },
            "media_reference": {
              "OTIO_SCHEMA": "ExternalReference.1",
              "target_url": "file:///media/clip2.mov"
            }
          }
        ]
      }
    ]
  }
}`;

// Read the timeline from JSON
console.log('=== Reading and Modifying OTIO ===\n');
const timeline = readTimelineFromString(exampleOTIO);

if (!timeline) {
  console.error('Failed to parse timeline');
  process.exit(1);
}

console.log('1. Original Timeline:');
console.log(`   Name: ${timeline.name}`);
console.log(`   Duration: ${timeline.duration()?.toSeconds()}s`);
console.log(`   Clips: ${timeline.findClips().length}`);

// Modify the timeline
console.log('\n2. Modifying Timeline:');

// Change the timeline name
timeline.name = 'Modified Timeline';
console.log(`   - Changed name to: ${timeline.name}`);

// Add metadata
timeline.metadata = {
  ...timeline.metadata,
  modified_date: new Date().toISOString(),
  modified_by: 'OTIO.js Example',
  version: '1.0',
};
console.log('   - Added metadata');

// Find all clips and add markers
const clips = timeline.findClips();
console.log(`\n3. Adding markers to ${clips.length} clips:`);

clips.forEach((composable, index) => {
  if (composable instanceof Clip) {
    const clip = composable as Clip;
    
    // Add a marker at the start of each clip
    const marker = new Marker(
      `Marker ${index + 1}`,
      new TimeRange(
        RationalTime.fromFrames(0, 24),
        RationalTime.fromFrames(1, 24)
      ),
      index % 2 === 0 ? MarkerColor.GREEN : MarkerColor.BLUE,
      `Auto-generated marker for ${clip.name}`
    );
    
    clip.markers.push(marker);
    console.log(`   - Added marker to "${clip.name}"`);
  }
});

// Modify clip durations
console.log('\n4. Trimming clips:');
clips.forEach((composable) => {
  if (composable instanceof Clip) {
    const clip = composable as Clip;
    const originalDuration = clip.sourceRange?.duration.toFrames();
    
    if (clip.sourceRange && originalDuration) {
      // Trim 10 frames from the end of each clip
      const newDuration = RationalTime.fromFrames(
        Math.max(1, originalDuration - 10),
        24
      );
      
      clip.sourceRange = new TimeRange(clip.sourceRange.startTime, newDuration);
      
      console.log(`   - Trimmed "${clip.name}": ${originalDuration} → ${newDuration.toFrames()} frames`);
    }
  }
});

// Add a new clip
console.log('\n5. Adding a new clip:');
const newClip = new Clip(
  'New Clip',
  new ExternalReference('file:///media/new_clip.mov'),
  new TimeRange(
    RationalTime.fromFrames(0, 24),
    RationalTime.fromFrames(120, 24)
  )
);

// Add marker to new clip
newClip.markers.push(
  new Marker(
    'Start',
    new TimeRange(RationalTime.fromFrames(0, 24), RationalTime.fromFrames(1, 24)),
    MarkerColor.RED
  )
);

// Get the first video track and add the clip
const videoTracks = timeline.videoTracks();
if (videoTracks.length > 0) {
  const firstTrack = videoTracks[0];
  (firstTrack as any).appendChild(newClip);
  console.log(`   - Added new clip to "${firstTrack.name}"`);
}

// Print summary
console.log('\n6. Modified Timeline Summary:');
console.log(`   Name: ${timeline.name}`);
console.log(`   Duration: ${timeline.duration()?.toSeconds()}s`);
console.log(`   Total clips: ${timeline.findClips().length}`);
console.log(`   Video tracks: ${timeline.videoTracks().length}`);
console.log(`   Audio tracks: ${timeline.audioTracks().length}`);

// Print all clips with markers
console.log('\n7. Clips and Markers:');
timeline.findClips().forEach((composable, index) => {
  if (composable instanceof Clip) {
    const clip = composable as Clip;
    console.log(`   Clip ${index + 1}: ${clip.name}`);
    console.log(`     Duration: ${clip.sourceRange?.duration.toFrames()} frames`);
    console.log(`     Markers: ${clip.markers.length}`);
    
    clip.markers.forEach((marker) => {
      console.log(`       - ${marker.name} (${marker.color}): ${marker.comment}`);
    });
  }
});

// Export modified timeline
console.log('\n8. Exporting modified timeline:');
const modifiedJSON = timeline.toJSONString(2);
console.log('   JSON output length:', modifiedJSON.length, 'characters');
// console.log(modifiedJSON); // Uncomment to see full JSON

// In a browser, you could download it:
// downloadTimeline(timeline, 'modified-timeline.otio');

export { timeline };

