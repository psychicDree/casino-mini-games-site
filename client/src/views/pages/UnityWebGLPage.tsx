import React, { useEffect, useRef, useState } from 'react';
import UnityWebGLService, { UnityWebGLConfig } from '../../services/UnityWebGLService';
import './UnityWebGLPage.css';

interface UnityWebGLPageProps {
  buildPath?: string;
  gameName?: string;
}

const UnityWebGLPage: React.FC<UnityWebGLPageProps> = ({ 
  buildPath = '/unity-builds/test-build', 
  gameName = 'Test Game' 
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const unityServiceRef = useRef<UnityWebGLService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const loadUnityBuild = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const config: UnityWebGLConfig = {
          buildPath,
          gameName,
          width: 1280,
          height: 720,
          onProgress: (progress) => setProgress(progress),
          onLoaded: () => {
            setProgress(100);
            setIsLoading(false);
          },
          onError: (error) => {
            setError(error);
            setIsLoading(false);
          }
        };

        unityServiceRef.current = new UnityWebGLService(config);
        await unityServiceRef.current.loadUnityBuild(canvasRef.current || undefined);
        
        // Set up Unity message handlers
        if (unityServiceRef.current) {
          unityServiceRef.current.onUnityMessage('gameWon', (data) => {
            console.log('Game won:', data);
          });
          
          unityServiceRef.current.onUnityMessage('gameLost', (data) => {
            console.log('Game lost:', data);
          });
        }
      } catch (err) {
        setError('Failed to load Unity WebGL build');
        setIsLoading(false);
        console.error('Unity WebGL load error:', err);
      }
    };

    loadUnityBuild();

    // Cleanup on unmount
    return () => {
      if (unityServiceRef.current) {
        unityServiceRef.current.quit();
      }
    };
  }, [buildPath, gameName]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    // Handle Unity WebGL keyboard input
    if (event.key === 'Escape' && isFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (error) {
    return (
      <div className="unity-webgl-error">
        <h2>Error Loading Game</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="unity-webgl-page" onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="unity-webgl-header">
        <h1>{gameName}</h1>
        <div className="unity-controls">
          <button onClick={toggleFullscreen} className="fullscreen-btn">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      <div className="unity-webgl-container">
        {isLoading && (
          <div className="unity-loading">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading Unity WebGL Build...</div>
            <div className="loading-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
              <span className="progress-text">{progress}%</span>
            </div>
          </div>
        )}
        
        <div 
          ref={canvasRef}
          className="unity-canvas-container"
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>

      <div className="unity-webgl-info">
        <p>Use WASD or Arrow Keys to move • Space to jump • ESC to exit fullscreen</p>
      </div>
    </div>
  );
};

export default UnityWebGLPage; 