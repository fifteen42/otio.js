import { describe, it, expect } from 'vitest';
import { Timeline } from '../schema/Timeline';
import { Stack } from '../schema/Stack';
import { Track, TrackKind } from '../schema/Track';
import { Clip } from '../schema/Clip';
import { ExternalReference } from '../schema/MediaReference';
import { RationalTime, TimeRange } from '../opentime';

describe('Timeline', () => {
  it('should create an empty timeline', () => {
    const timeline = new Timeline('Test Timeline');
    expect(timeline.name).toBe('Test Timeline');
    expect(timeline.schemaName()).toBe('Timeline');
  });

  it('should get duration from tracks', () => {
    const timeline = new Timeline('Test Timeline');
    const stack = new Stack('tracks');
    const track = new Track('Video 1', [], TrackKind.VIDEO);
    
    const clip = new Clip(
      'Clip 1',
      new ExternalReference('file.mov'),
      new TimeRange(
        RationalTime.fromFrames(0, 24),
        RationalTime.fromFrames(100, 24)
      )
    );
    
    track.appendChild(clip);
    stack.appendChild(track);
    timeline.tracks = stack;
    
    const duration = timeline.duration();
    expect(duration).not.toBeNull();
    expect(duration?.toFrames()).toBe(100);
  });

  it('should find all clips', () => {
    const timeline = new Timeline('Test Timeline');
    const stack = new Stack('tracks');
    const track = new Track('Video 1', [], TrackKind.VIDEO);
    
    const clip1 = new Clip(
      'Clip 1',
      new ExternalReference('file1.mov'),
      new TimeRange(RationalTime.fromFrames(0, 24), RationalTime.fromFrames(100, 24))
    );
    
    const clip2 = new Clip(
      'Clip 2',
      new ExternalReference('file2.mov'),
      new TimeRange(RationalTime.fromFrames(0, 24), RationalTime.fromFrames(50, 24))
    );
    
    track.appendChild(clip1);
    track.appendChild(clip2);
    stack.appendChild(track);
    timeline.tracks = stack;
    
    const clips = timeline.findClips();
    expect(clips.length).toBe(2);
  });

  it('should separate video and audio tracks', () => {
    const timeline = new Timeline('Test Timeline');
    const stack = new Stack('tracks');
    
    const videoTrack = new Track('Video', [], TrackKind.VIDEO);
    const audioTrack = new Track('Audio', [], TrackKind.AUDIO);
    
    stack.appendChild(videoTrack);
    stack.appendChild(audioTrack);
    timeline.tracks = stack;
    
    expect(timeline.videoTracks().length).toBe(1);
    expect(timeline.audioTracks().length).toBe(1);
  });

  it('should serialize and deserialize', () => {
    const timeline = new Timeline('Test Timeline');
    timeline.metadata = { project: 'Test Project' };
    
    const json = timeline.toJSON();
    expect(json.OTIO_SCHEMA).toBe('Timeline.1');
    expect(json.name).toBe('Test Timeline');
    expect(json.metadata).toEqual({ project: 'Test Project' });
  });

  it('should clone timeline', () => {
    const timeline = new Timeline('Original');
    const clone = timeline.clone();
    
    expect(clone.name).toBe('Original');
    expect(clone).not.toBe(timeline);
    
    clone.name = 'Modified';
    expect(timeline.name).toBe('Original');
  });
});

