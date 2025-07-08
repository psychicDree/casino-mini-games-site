import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UnityWebGLPage from './UnityWebGLPage';
import { GameController } from '../../controllers/GameController';
import { Game } from '../../models/Game';
import './UnityGamePage.css';

const UnityGamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      if (!gameId) {
        setError('Game ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // In a real app, you would fetch the game from API
        // For now, we'll use a mock game based on the gameId
        const mockGame = createMockGame(gameId);
        
        if (!mockGame.isUnityGame) {
          setError('This game is not a Unity game');
          setLoading(false);
          return;
        }

        setGame(mockGame);
        setLoading(false);
      } catch (err) {
        setError('Failed to load game');
        setLoading(false);
        console.error('Game load error:', err);
      }
    };

    loadGame();
  }, [gameId]);

  const createMockGame = (id: string): Game => {
    // Mock game data - in real app, this would come from API
    const gameData = {
      'slot-machine': {
        name: 'Slot Machine',
        unityBuildPath: '/unity-builds/slot-machine',
        isUnityGame: true
      },
      'blackjack': {
        name: 'Blackjack',
        unityBuildPath: '/unity-builds/blackjack',
        isUnityGame: true
      },
      'roulette': {
        name: 'Roulette',
        unityBuildPath: '/unity-builds/roulette',
        isUnityGame: true
      },
      'poker': {
        name: 'Poker',
        unityBuildPath: '/unity-builds/poker',
        isUnityGame: true
      },
      'test-build': {
        name: 'Test Game',
        unityBuildPath: '/unity-builds/test-build',
        isUnityGame: true
      }
    };

    const gameInfo = gameData[id as keyof typeof gameData] || {
      name: 'Unknown Game',
      unityBuildPath: '/unity-builds/test-build',
      isUnityGame: true
    };

    return new Game({
      id,
      name: gameInfo.name,
      url: `/game/${id}`,
      type: 'unity',
      badge: 'Unity',
      unityBuildPath: gameInfo.unityBuildPath,
      isUnityGame: gameInfo.isUnityGame
    });
  };

  const handleBackToGames = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="unity-game-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading game...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="unity-game-error">
        <h2>Error Loading Game</h2>
        <p>{error || 'Game not found'}</p>
        <button onClick={handleBackToGames}>Back to Games</button>
      </div>
    );
  }

  return (
    <div className="unity-game-page">
      <div className="unity-game-header">
        <button onClick={handleBackToGames} className="back-btn">
          ← Back to Games
        </button>
        <h1>{game.name}</h1>
        {game.badge && <span className="game-badge">{game.badge}</span>}
      </div>
      
      <UnityWebGLPage 
        buildPath={game.unityBuildPath!}
        gameName={game.name}
      />
    </div>
  );
};

export default UnityGamePage; 