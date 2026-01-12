import React, { createContext, useContext, ReactNode } from 'react';
import { useYouTubeAudioEngine, YouTubeAudioState } from '../components/music/YouTubeAudioEngine';
import { YouTubeTrack } from '../data/youtubePlaylist';

interface MusicPlayerContextType {
  // State
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
  
  // Methods
  play: () => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playTrackByIndex: (index: number) => void;
  playTrack: (track: YouTubeTrack) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export const MusicPlayerProvider: React.FC<MusicPlayerProviderProps> = ({ children }) => {
  const { audioEngine, state } = useYouTubeAudioEngine();
  
  const contextValue: MusicPlayerContextType = {
    // State properties
    isPlaying: state.isPlaying,
    currentTrack: state.currentTrack,
    currentTime: state.currentTime,
    duration: state.duration,
    volume: state.volume,
    isLoading: state.isLoading,
    isShuffle: state.isShuffle,
    repeatMode: state.repeatMode,
    playlist: state.playlist,
    currentIndex: state.currentIndex,
    
    // Methods
    play: () => audioEngine?.play(),
    pause: () => audioEngine?.pause(),
    stop: () => audioEngine?.stop(),
    setVolume: (volume: number) => audioEngine?.setVolume(volume),
    seek: (time: number) => audioEngine?.seek(time),
    nextTrack: () => audioEngine?.nextTrack(),
    previousTrack: () => audioEngine?.previousTrack(),
    toggleShuffle: () => audioEngine?.toggleShuffle(),
    toggleRepeat: () => audioEngine?.toggleRepeat(),
    playTrackByIndex: (index: number) => audioEngine?.playTrackByIndex(index),
    playTrack: (track: YouTubeTrack) => audioEngine?.loadTrack(track),
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export default MusicPlayerContext;
