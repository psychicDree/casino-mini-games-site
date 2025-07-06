import React from 'react';
import './HeroCarousel.css';

const games = [
  {
    title: 'Smash Karts',
    image: '🏎️',
    badge: 'Hot',
    bg: 'linear-gradient(135deg, #7f8cff 0%, #282828 100%)',
  },
  {
    title: 'Hazmob FPS',
    image: '🔫',
    badge: 'Updated',
    bg: 'linear-gradient(135deg, #00e6a2 0%, #1F2030 100%)',
  },
  {
    title: 'Traffic Rider',
    image: '🏍️',
    badge: '',
    bg: 'linear-gradient(135deg, #ffb347 0%, #252525 100%)',
  },
  {
    title: 'Stone Grass',
    image: '🚜',
    badge: '',
    bg: 'linear-gradient(135deg, #7fff7f 0%, #202020 100%)',
  },
  {
    title: 'Bloxd.io',
    image: '🧱',
    badge: 'Top Rated',
    bg: 'linear-gradient(135deg, #ff5c5c 0%, #383838 100%)',
  },
];

export default function HeroCarousel() {
  return (
    <section className="hero-carousel">
      <div className="carousel-scroll">
        {games.map((game, idx) => (
          <div
            className="carousel-card"
            key={game.title}
            style={{ background: game.bg }}
          >
            {game.badge && <span className={`carousel-badge badge-${game.badge.toLowerCase().replace(' ', '-')}`}>{game.badge}</span>}
            <div className="carousel-image">{game.image}</div>
            <div className="carousel-title">{game.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 