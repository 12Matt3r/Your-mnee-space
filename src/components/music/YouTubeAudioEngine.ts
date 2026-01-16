import { useState, useEffect, useRef } from 'react';
import { YouTubeTrack, youtubePlaylist } from '../../data/youtubePlaylist';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface YouTubeAudioState {
  isPlaying: boolean;
  currentTrack: YouTubeTrack | null;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  playlist: YouTubeTrack[];
  currentIndex: number;
}

export class YouTubeAudioEngine {
  private player: any = null;
  private state: YouTubeAudioState;
  private listeners: Set<(state: YouTubeAudioState) => void>;
  private intervalId: number | null = null;
  private apiReady: boolean = false;
  private pendingVideoId: string | null = null;

  constructor() {
    this.state = {
      isPlaying: false,
      currentTrack: null,
      currentTime: 0,
      duration: 0,
      volume: 80,
      isLoading: false,
      isShuffle: false,
      repeatMode: 'none',
      playlist: youtubePlaylist,
      currentIndex: -1
    };
    
    this.listeners = new Set();
    this.loadYouTubeAPI();
  }

  private loadYouTubeAPI(): void {
    if (window.YT && window.YT.Player) {
      this.apiReady = true;
      this.initPlayer();
      return;
    }

    // Load the YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      this.apiReady = true;
      this.initPlayer();
    };
  }

  private initPlayer(): void {
    // Create a hidden container for the YouTube player
    let container = document.getElementById('youtube-audio-player');
    if (!container) {
      container = document.createElement('div');
      container.id = 'youtube-audio-player';
      container.style.cssText = 'position: fixed; top: -9999px; left: -9999px; width: 1px; height: 1px; pointer-events: none;';
      document.body.appendChild(container);
    }

    this.player = new window.YT.Player('youtube-audio-player', {
      height: '1',
      width: '1',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        origin: window.location.origin
      },
      events: {
        onReady: () => {
          this.player.setVolume(this.state.volume);
          if (this.pendingVideoId) {
            this.player.loadVideoById(this.pendingVideoId);
            this.pendingVideoId = null;
          }
        },
        onStateChange: (event: any) => this.handleStateChange(event),
        onError: (event: any) => this.handleError(event)
      }
    });

    // Start time tracking interval
    this.intervalId = window.setInterval(() => {
      if (this.player && this.player.getCurrentTime && this.state.isPlaying) {
        const currentTime = this.player.getCurrentTime() || 0;
        const duration = this.player.getDuration() || 0;
        this.updateState({ currentTime, duration });
      }
    }, 500);
  }

  private handleStateChange(event: any): void {
    const PlayerState = window.YT.PlayerState;
    
    switch (event.data) {
      case PlayerState.PLAYING:
        this.updateState({ isPlaying: true, isLoading: false });
        break;
      case PlayerState.PAUSED:
        this.updateState({ isPlaying: false });
        break;
      case PlayerState.BUFFERING:
        this.updateState({ isLoading: true });
        break;
      case PlayerState.ENDED:
        this.handleTrackEnd();
        break;
      case PlayerState.CUED:
        this.updateState({ isLoading: false });
        break;
    }
  }

  private handleError(event: any): void {
    console.error('YouTube player error:', event.data);
    this.updateState({ isLoading: false, isPlaying: false });
    // Skip to next track on error
    setTimeout(() => this.nextTrack(), 1000);
  }

  private updateState(updates: Partial<YouTubeAudioState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  public subscribe(listener: (state: YouTubeAudioState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  public loadTrack(track: YouTubeTrack): void {
    this.updateState({ 
      isLoading: true,
      currentTrack: track
    });
    
    if (this.player && this.player.loadVideoById) {
      this.player.loadVideoById(track.videoId);
    } else {
      this.pendingVideoId = track.videoId;
    }
  }

  public play(): void {
    if (this.player && this.player.playVideo) {
      this.player.playVideo();
    }
  }

  public pause(): void {
    if (this.player && this.player.pauseVideo) {
      this.player.pauseVideo();
    }
  }

  public stop(): void {
    if (this.player && this.player.stopVideo) {
      this.player.stopVideo();
    }
  }

  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    if (this.player && this.player.setVolume) {
      this.player.setVolume(clampedVolume);
    }
    this.updateState({ volume: clampedVolume });
  }

  public seek(time: number): void {
    if (this.player && this.player.seekTo) {
      this.player.seekTo(time, true);
    }
  }

  public playTrackByIndex(index: number): void {
    if (index >= 0 && index < this.state.playlist.length) {
      this.updateState({ currentIndex: index });
      this.loadTrack(this.state.playlist[index]);
    }
  }

  public nextTrack(): void {
    if (this.state.playlist.length === 0) return;
    
    let nextIndex: number;
    
    if (this.state.isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * this.state.playlist.length);
      } while (nextIndex === this.state.currentIndex && this.state.playlist.length > 1);
    } else {
      nextIndex = (this.state.currentIndex + 1) % this.state.playlist.length;
    }
    
    this.playTrackByIndex(nextIndex);
  }

  public previousTrack(): void {
    if (this.state.playlist.length === 0) return;
    
    const prevIndex = this.state.currentIndex > 0
      ? this.state.currentIndex - 1 
      : this.state.playlist.length - 1;
    
    this.playTrackByIndex(prevIndex);
  }

  public toggleShuffle(): void {
    this.updateState({ isShuffle: !this.state.isShuffle });
  }

  public toggleRepeat(): void {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(this.state.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    this.updateState({ repeatMode: nextMode });
  }

  private handleTrackEnd(): void {
    switch (this.state.repeatMode) {
      case 'one':
        this.seek(0);
        this.play();
        break;
      case 'all':
        this.nextTrack();
        break;
      case 'none':
        if (this.state.currentIndex < this.state.playlist.length - 1) {
          this.nextTrack();
        } else {
          this.updateState({ isPlaying: false, currentIndex: -1 });
        }
        break;
    }
  }

  public getState(): YouTubeAudioState {
    return { ...this.state };
  }

  public destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.player && this.player.destroy) {
      this.player.destroy();
    }
    this.listeners.clear();
  }
}

// React hook for YouTube audio engine
export function useYouTubeAudioEngine(): {
  audioEngine: YouTubeAudioEngine;
  state: YouTubeAudioState;
} {
  const audioEngineRef = useRef<YouTubeAudioEngine | null>(null);
  const [state, setState] = useState<YouTubeAudioState>({
    isPlaying: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 80,
    isLoading: false,
    isShuffle: false,
    repeatMode: 'none',
    playlist: youtubePlaylist,
    currentIndex: -1
  });

  useEffect(() => {
    if (!audioEngineRef.current) {
      audioEngineRef.current = new YouTubeAudioEngine();
    }

    const unsubscribe = audioEngineRef.current.subscribe(setState);

    return () => {
      unsubscribe();
      if (audioEngineRef.current) {
        audioEngineRef.current.destroy();
        audioEngineRef.current = null;
      }
    };
  }, []);

  return {
    audioEngine: audioEngineRef.current!,
    state
  };
}
