import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PlayIcon, PauseIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const FocusTimer = ({ onClose }) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFlat, setIsFlat] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showRedScreen, setShowRedScreen] = useState(false);
  
  const timerRef = useRef(null);
  
  // Format time
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          startTimer();
        } else {
          alert('Odak modu için cihaz hareket sensörüne izin vermeniz gerekmektedir.');
        }
      } catch (error) {
        console.error(error);
        // Fallback for non-iOS or if API fails
        setPermissionGranted(true);
        startTimer();
      }
    } else {
      setPermissionGranted(true);
      startTimer();
    }
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(0);
    setIsFlat(true);
    setShowRedScreen(false);
  };

  useEffect(() => {
    if (isActive && !isPaused && isFlat) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isActive, isPaused, isFlat]);

  useEffect(() => {
    if (!permissionGranted && isActive) return;

    const handleOrientation = (event) => {
      const { beta, gamma } = event;
      // beta: front-back tilt [-180, 180]
      // gamma: left-right tilt [-90, 90]
      
      // Hysteresis logic to prevent flickering
      // If currently flat, require larger deviation to switch to not flat (> 20 deg)
      // If currently not flat, require strictly flat to switch back (< 10 deg)
      
      const currentBeta = Math.abs(beta);
      const currentGamma = Math.abs(gamma);
      
      // Null check for desktop testing
      if (beta === null || gamma === null) return;
      
      if (isFlat) {
        // Switch to NOT flat if deviation is high
        if (currentBeta > 20 || currentGamma > 20) {
          setIsFlat(false);
          setShowRedScreen(true);
          // We pause instead of reset to solve the user's issue
          // pauseTimer(); 
          // Actually, let's keep it running but just warn? 
          // Or pause? User complained about reset. Pause is safer.
        }
      } else {
        // Switch to FLAT if deviation is low
        if (currentBeta < 10 && currentGamma < 10) {
          setIsFlat(true);
          setShowRedScreen(false);
        }
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isFlat, permissionGranted, isActive]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-300 ${showRedScreen ? 'bg-red-600' : 'bg-slate-900'}`}>
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>
      
      <div className="text-center space-y-8">
        <h2 className="text-white/80 text-xl font-medium tracking-wide">ODAK MODU</h2>
        
        <div className="text-7xl font-mono font-bold text-white tracking-wider">
          {formatTime(time)}
        </div>
        
        {!isActive ? (
          <button 
            onClick={requestPermission}
            className="btn btn-primary px-8 py-3 text-lg rounded-full"
          >
            <PlayIcon className="w-6 h-6 mr-2" />
            Başlat
          </button>
        ) : (
          <div className="flex items-center gap-4 justify-center">
            <button 
              onClick={isPaused ? startTimer : pauseTimer}
              className="p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              {isPaused ? <PlayIcon className="w-8 h-8" /> : <PauseIcon className="w-8 h-8" />}
            </button>
            <button 
              onClick={resetTimer}
              className="p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <ArrowPathIcon className="w-8 h-8" />
            </button>
          </div>
        )}
        
        <p className={`text-white/60 transition-opacity duration-300 ${showRedScreen ? 'opacity-100 font-bold text-white' : 'opacity-60'}`}>
          {showRedScreen ? 'TELEFONU DÜZ TUTUN!' : 'Telefonu düz bir zemine koyun'}
        </p>
      </div>
    </div>
  );
};

export default FocusTimer;