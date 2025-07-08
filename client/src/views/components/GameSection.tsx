import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameSection.css';

export interface GameCardData {
  title: string;
  image: string;
  badge?: string;
  gameId?: string;
  isUnityGame?: boolean;
}

interface GameSectionProps {
  title: string;
  viewMoreHref?: string;
  games: GameCardData[];
}

export default function GameSection({ title, viewMoreHref, games }: GameSectionProps) {
  const navigate = useNavigate();

  const handleGameClick = (game: GameCardData) => {
    if (game.isUnityGame && game.gameId) {
      navigate(`/game/${game.gameId}`);
    } else {
      // Handle non-Unity games (external links, etc.)
      console.log('Non-Unity game clicked:', game.title);
    }
  };

  return (
    <section className="game-section">
      <div className="game-section-header">
        <h2 className="game-section-title">{title}</h2>
        {viewMoreHref && <a className="game-section-viewmore" href={viewMoreHref}>View more</a>}
      </div>
      <div className="game-section-row">
        {games.map((game, idx) => (
          <div 
            className={`game-section-card ${game.isUnityGame ? 'unity-game' : ''}`} 
            key={game.title + idx}
            onClick={() => handleGameClick(game)}
            style={{ cursor: game.isUnityGame ? 'pointer' : 'default' }}
          >
            {game.badge && <span className={`game-section-badge badge-${game.badge.toLowerCase().replace(' ', '-')}`}>{game.badge}</span>}
            <div className="game-section-image">{game.image}</div>
            <div className="game-section-titlecard">{game.title}</div>
            {game.isUnityGame && <div className="unity-indicator">🎮 Unity</div>}
          </div>
        ))}
      </div>
    </section>
  );
} 