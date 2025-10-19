/**
 * Example: Working with Time Calculations
 * This example demonstrates various time-related operations in OTIO.
 */

import { RationalTime, TimeRange, TimeTransform } from '../src/index';

console.log('=== Time Calculations Examples ===\n');

// Creating RationalTime objects
console.log('1. Creating RationalTime:');
const time1 = new RationalTime(100, 24); // 100 frames at 24fps
const time2 = RationalTime.fromFrames(50, 24);
const time3 = RationalTime.fromSeconds(2.5, 24);
const time4 = RationalTime.fromTimecode('00:00:10:00', 24);

console.log(`time1: ${time1.value}/${time1.rate} = ${time1.toSeconds()}s`);
console.log(`time2: ${time2.toFrames()} frames`);
console.log(`time3: ${time3.toSeconds()} seconds`);
console.log(`time4: ${time4.toTimecode()}`);

// Time arithmetic
console.log('\n2. Time Arithmetic:');
const sum = time1.add(time2);
const difference = time1.subtract(time2);
console.log(`${time1.toFrames()} + ${time2.toFrames()} = ${sum.toFrames()} frames`);
console.log(`${time1.toFrames()} - ${time2.toFrames()} = ${difference.toFrames()} frames`);

// Time comparison
console.log('\n3. Time Comparison:');
console.log(`time1 > time2: ${time1.compare(time2) > 0}`);
console.log(`time1 == time2: ${time1.equals(time2)}`);
console.log(`time1 < time2: ${time1.compare(time2) < 0}`);

// Frame rate conversion
console.log('\n4. Frame Rate Conversion:');
const time24fps = RationalTime.fromFrames(24, 24); // 1 second at 24fps
const time30fps = time24fps.rescaledTo(30); // Convert to 30fps
const time60fps = time24fps.rescaledTo(60); // Convert to 60fps

console.log(`24fps: ${time24fps.toFrames()} frames = ${time24fps.toSeconds()}s`);
console.log(`30fps: ${time30fps.toFrames()} frames = ${time30fps.toSeconds()}s`);
console.log(`60fps: ${time60fps.toFrames()} frames = ${time60fps.toSeconds()}s`);

// Timecode conversions
console.log('\n5. Timecode Conversions:');
const timecodes = [
  '00:00:01:00', // 1 second
  '00:01:00:00', // 1 minute
  '01:00:00:00', // 1 hour
  '23:59:59:23', // Almost 24 hours
];

timecodes.forEach((tc) => {
  const t = RationalTime.fromTimecode(tc, 24);
  console.log(`${tc} = ${t.toSeconds()}s (${t.toFrames()} frames)`);
});

// Working with TimeRange
console.log('\n6. TimeRange Operations:');
const range1 = new TimeRange(
  RationalTime.fromFrames(0, 24),
  RationalTime.fromFrames(100, 24)
);

const range2 = new TimeRange(
  RationalTime.fromFrames(50, 24),
  RationalTime.fromFrames(100, 24)
);

console.log(`Range 1: ${range1.startTime.toFrames()} to ${range1.endTimeExclusive().toFrames()}`);
console.log(`Range 2: ${range2.startTime.toFrames()} to ${range2.endTimeExclusive().toFrames()}`);
console.log(`Ranges overlap: ${range1.overlaps(range2)}`);

const testTime = RationalTime.fromFrames(75, 24);
console.log(`Frame 75 in range1: ${range1.contains(testTime)}`);
console.log(`Frame 75 in range2: ${range2.contains(testTime)}`);

// Range extensions and clamping
const extended = range1.extended(range2);
console.log(`Extended range: ${extended.startTime.toFrames()} to ${extended.endTimeExclusive().toFrames()}`);

const clamped = range1.clamped(range2);
if (clamped) {
  console.log(`Clamped range: ${clamped.startTime.toFrames()} to ${clamped.endTimeExclusive().toFrames()}`);
}

// Time transforms
console.log('\n7. Time Transforms:');
const transform = new TimeTransform(
  RationalTime.fromFrames(10, 24), // offset by 10 frames
  2.0 // scale by 2x (double speed)
);

const originalTime = RationalTime.fromFrames(100, 24);
const transformedTime = transform.applied(originalTime);

console.log(`Original: ${originalTime.toFrames()} frames`);
console.log(`Transformed (offset +10, scale 2x): ${transformedTime.toFrames()} frames`);

// Practical example: Calculate edit points for a montage
console.log('\n8. Practical Example - Montage Edit Points:');
const clipDurations = [120, 90, 150, 60, 180]; // Frame counts
const fps = 24;
let currentTime = RationalTime.fromFrames(0, fps);

console.log('Montage timeline:');
clipDurations.forEach((duration, index) => {
  const startTime = currentTime;
  const endTime = currentTime.add(RationalTime.fromFrames(duration, fps));
  
  console.log(
    `  Clip ${index + 1}: ${startTime.toTimecode()} - ${endTime.toTimecode()} (${duration} frames, ${(duration / fps).toFixed(2)}s)`
  );
  
  currentTime = endTime;
});

console.log(`Total montage duration: ${currentTime.toTimecode()} (${currentTime.toSeconds().toFixed(2)}s)`);

