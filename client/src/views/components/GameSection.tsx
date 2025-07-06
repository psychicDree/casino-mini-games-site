import React from 'react';
import './GameSection.css';

export interface GameCardData {
  title: string;
  image: string;
  badge?: string;
}

interface GameSectionProps {
  title: string;
  viewMoreHref?: string;
  games: GameCardData[];
}

export default function GameSection({ title, viewMoreHref, games }: GameSectionProps) {
  return (
    <section className="game-section">
      <div className="game-section-header">
        <h2 className="game-section-title">{title}</h2>
        {viewMoreHref && <a className="game-section-viewmore" href={viewMoreHref}>View more</a>}
      </div>
      <div className="game-section-row">
        {games.map((game, idx) => (
          <div className="game-section-card" key={game.title + idx}>
            {game.badge && <span className={`game-section-badge badge-${game.badge.toLowerCase().replace(' ', '-')}`}>{game.badge}</span>}
            <div className="game-section-image">{game.image}</div>
            <div className="game-section-titlecard">{game.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 