/**
 * Example: Creating a Timeline from Scratch
 * This example demonstrates how to create a complete OTIO timeline programmatically.
 */

import {
  Timeline,
  Stack,
  Track,
  Clip,
  Gap,
  Transition,
  ExternalReference,
  Marker,
  MarkerColor,
  RationalTime,
  TimeRange,
  TrackKind,
  LinearTimeWarp,
} from '../src/index';

// Create a new timeline
const timeline = new Timeline('My First Timeline');

// Set global start time (optional)
timeline.globalStartTime = RationalTime.fromTimecode('01:00:00:00', 24);

// Create a stack (container for tracks)
const stack = new Stack('Main Stack');

// Create a video track
const videoTrack = new Track('Video Track 1', [], TrackKind.VIDEO);

// Create clips with media references
const clip1 = new Clip(
  'Shot 1',
  new ExternalReference('/media/shot1.mov'),
  new TimeRange(
    RationalTime.fromFrames(0, 24),
    RationalTime.fromFrames(120, 24) // 5 seconds at 24fps
  )
);

// Add a marker to the first clip
const marker1 = new Marker(
  'Action starts',
  new TimeRange(RationalTime.fromFrames(24, 24), RationalTime.fromFrames(1, 24)),
  MarkerColor.GREEN,
  'Main character enters'
);
clip1.markers.push(marker1);

// Create a transition
const transition = new Transition(
  'Dissolve',
  'SMPTE_Dissolve',
  RationalTime.fromFrames(12, 24), // 12 frames in
  RationalTime.fromFrames(12, 24)  // 12 frames out
);

// Create second clip
const clip2 = new Clip(
  'Shot 2',
  new ExternalReference('/media/shot2.mov'),
  new TimeRange(
    RationalTime.fromFrames(50, 24),
    RationalTime.fromFrames(100, 24)
  )
);

// Add a speed effect to the second clip (slow motion)
const speedEffect = new LinearTimeWarp('SlowMo', 'LinearTimeWarp', 0.5);
clip2.effects.push(speedEffect);

// Create a gap (empty space)
const gap = new Gap(
  'Gap 1',
  new TimeRange(
    RationalTime.fromFrames(0, 24),
    RationalTime.fromFrames(24, 24) // 1 second gap
  )
);

// Add elements to the video track
videoTrack.appendChild(clip1);
videoTrack.appendChild(transition);
videoTrack.appendChild(clip2);
videoTrack.appendChild(gap);

// Create an audio track
const audioTrack = new Track('Audio Track 1', [], TrackKind.AUDIO);

const audioClip = new Clip(
  'Background Music',
  new ExternalReference('/media/music.wav'),
  new TimeRange(
    RationalTime.fromFrames(0, 48000), // Audio often has higher sample rate
    RationalTime.fromFrames(240000, 48000)
  )
);

audioTrack.appendChild(audioClip);

// Add tracks to the stack
stack.appendChild(videoTrack);
stack.appendChild(audioTrack);

// Set the stack as the timeline's tracks
timeline.tracks = stack;

// Add metadata to the timeline
timeline.metadata = {
  project: 'My Film Project',
  editor: 'John Doe',
  created: new Date().toISOString(),
  frameRate: 24,
};

// Print timeline info
console.log('Timeline created:', timeline.name);
console.log('Duration:', timeline.duration()?.toSeconds(), 'seconds');
console.log('Number of video tracks:', timeline.videoTracks().length);
console.log('Number of audio tracks:', timeline.audioTracks().length);
console.log('Total clips:', timeline.findClips().length);

// Export to JSON
const jsonOutput = timeline.toJSONString(2);
console.log('\nJSON Output:');
console.log(jsonOutput);

// You can also save this to a file or download it
// downloadTimeline(timeline, 'my-timeline.otio');

export { timeline };

