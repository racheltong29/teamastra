// ========================================
// BACKGROUND MUSIC SYSTEM
// ========================================

class MusicManager {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.volume = 0.3; // Default volume (30%)
    this.musicEnabled = this.loadMusicPreference();
    this.init();
  }

  init() {
    this.createAudioElement();
    this.updateMusicButton();
    this.loadVolumePreference();
    
    // Auto-play if music is enabled
    if (this.musicEnabled) {
      // Small delay to ensure audio is ready
      setTimeout(() => {
        this.playMusic();
      }, 100);
    }
  }

  createAudioElement() {
    // Create audio element
    this.audio = document.createElement('audio');
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = 'auto';
    
    // Add multiple music sources for better browser compatibility
    this.audio.innerHTML = `
      <source src="music/bgm.mp3" type="audio/mpeg">
      <source src="music/bgm.ogg" type="audio/ogg">
      <source src="music/bgm.wav" type="audio/wav">
    `;
    
    // Add error handling
    this.audio.addEventListener('error', () => {
      console.log('Music file not found, using fallback');
      this.createFallbackAudio();
    });
    
    // Save timestamp frequently while playing
    this.audio.addEventListener('timeupdate', () => {
      if (this.isPlaying && this.audio.currentTime > 0) {
        this.saveMusicTimestamp();
      }
    });
    
    // Save timestamp when paused
    this.audio.addEventListener('pause', () => {
      this.saveMusicTimestamp();
    });
    
    // Save timestamp when page is about to unload
    window.addEventListener('beforeunload', () => {
      this.saveMusicTimestamp();
    });
    
    // Add to document
    document.body.appendChild(this.audio);
  }

  createFallbackAudio() {
    // Create a simple tone as fallback if no music file exists
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.1);
    
    oscillator.start();
    
    // Store reference for control
    this.audioContext = audioContext;
    this.oscillator = oscillator;
    this.gainNode = gainNode;
  }

  toggleMusic() {
    if (this.musicEnabled) {
      this.stopMusic();
    } else {
      this.playMusic();
    }
    this.musicEnabled = !this.musicEnabled;
    this.saveMusicPreference();
    this.updateMusicButton();
  }

  playMusic() {
    if (this.audio && !this.audio.paused) return;
    
    if (this.audio) {
      // Restore saved timestamp
      const savedTime = this.loadMusicTimestamp();
      console.log('Restoring music from timestamp:', savedTime);
      
      if (savedTime > 0) {
        this.audio.currentTime = savedTime;
      }
      
      // Ensure audio is loaded before playing
      if (this.audio.readyState >= 2) {
        this.audio.play().catch(e => {
          console.log('Auto-play prevented:', e);
        });
        this.isPlaying = true;
      } else {
        // Wait for audio to load
        this.audio.addEventListener('canplay', () => {
          this.audio.play().catch(e => {
            console.log('Auto-play prevented:', e);
          });
          this.isPlaying = true;
        }, { once: true });
      }
    } else if (this.audioContext) {
      // Resume fallback audio
      this.audioContext.resume();
      this.isPlaying = true;
    }
  }

  stopMusic() {
    if (this.audio) {
      this.audio.pause();
    }
    
    if (this.audioContext) {
      this.audioContext.suspend();
    }
    
    this.isPlaying = false;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
    }
    
    this.saveVolumePreference();
    this.updateVolumeSlider();
  }

  updateMusicButton() {
    const musicBtn = document.querySelector('.music-toggle');
    if (musicBtn) {
      const icon = musicBtn.querySelector('i');
      if (this.musicEnabled) {
        icon.className = 'fas fa-volume-up';
        musicBtn.title = 'Mute Music';
      } else {
        icon.className = 'fas fa-volume-mute';
        musicBtn.title = 'Play Music';
      }
    }
  }

  updateVolumeSlider() {
    const volumeSlider = document.querySelector('.volume-slider');
    if (volumeSlider) {
      volumeSlider.value = this.volume * 100;
    }
  }

  loadMusicPreference() {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? JSON.parse(saved) : true; // Default to enabled
  }

  saveMusicPreference() {
    localStorage.setItem('musicEnabled', JSON.stringify(this.musicEnabled));
  }

  loadVolumePreference() {
    const saved = localStorage.getItem('musicVolume');
    if (saved !== null) {
      this.volume = parseFloat(saved);
      this.setVolume(this.volume);
    }
  }

  saveVolumePreference() {
    localStorage.setItem('musicVolume', this.volume.toString());
  }

  saveMusicTimestamp() {
    if (this.audio && this.isPlaying) {
      localStorage.setItem('musicTimestamp', this.audio.currentTime.toString());
    }
  }

  loadMusicTimestamp() {
    const saved = localStorage.getItem('musicTimestamp');
    return saved !== null ? parseFloat(saved) : 0;
  }
}

// Global music manager instance - only create once
if (!window.musicManager) {
  window.musicManager = new MusicManager();
}

// Music toggle function for HTML onclick
function toggleMusic() {
  if (window.musicManager) {
    window.musicManager.toggleMusic();
  }
}

// Volume control function
function setVolume(volume) {
  if (window.musicManager) {
    window.musicManager.setVolume(volume / 100);
  }
}

// Initialize music controls on page load
document.addEventListener('DOMContentLoaded', function() {
  createMusicControls();
});

// Create music controls in header
function createMusicControls() {
  const userStats = document.querySelector('.user-stats');
  if (!userStats) return;

  // Check if controls already exist
  if (document.querySelector('.music-controls')) return;

  // Create music controls container
  const musicControls = document.createElement('div');
  musicControls.className = 'music-controls';
  musicControls.innerHTML = `
    <button class="music-toggle" onclick="toggleMusic()" title="Toggle Music">
      <i class="fas fa-volume-up"></i>
    </button>
    <div class="volume-control">
      <input type="range" class="volume-slider" min="0" max="100" value="30" 
             onchange="setVolume(this.value)" title="Volume Control">
    </div>
  `;

  // Insert before user stats
  userStats.parentNode.insertBefore(musicControls, userStats);
  
  // Update initial state
  if (window.musicManager) {
    window.musicManager.updateMusicButton();
    window.musicManager.updateVolumeSlider();
  }
}

// Add CSS for music controls
const musicStyles = document.createElement('style');
musicStyles.textContent = `
  .music-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: 1rem;
  }

  .music-toggle {
    background: var(--gradient-candy);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    color: var(--text-white);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    box-shadow: var(--shadow-soft);
  }

  .music-toggle:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-strong);
  }

  .volume-control {
    display: flex;
    align-items: center;
  }

  .volume-slider {
    width: 80px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
  }

  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: var(--primary-pink);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: var(--shadow-soft);
  }

  .volume-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--primary-pink);
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: var(--shadow-soft);
  }

  .volume-slider::-ms-thumb {
    width: 16px;
    height: 16px;
    background: var(--primary-pink);
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: var(--shadow-soft);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .music-controls {
      margin-right: 0.5rem;
    }
    
    .volume-slider {
      width: 60px;
    }
  }
`;
document.head.appendChild(musicStyles);
