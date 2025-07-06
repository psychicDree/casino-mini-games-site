import React, { useEffect, useState } from 'react';
import { Game } from '../../models/Game';
import { GameController } from '../../controllers/GameController';
import HeroCarousel from '../components/HeroCarousel';
import GameSection from '../components/GameSection';

const gameController = new GameController();

const HomePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameController.getGames().then((games) => {
      setGames(games);
      setLoading(false);
    });
  }, []);

  // Demo data for game sections
  const featuredGames = [
    { title: 'Fragen', image: '🔥', badge: 'Hot' },
    { title: 'Hook King Runner', image: '🪝', badge: 'Hot' },
    { title: 'Boom Karts', image: '🏎️' },
    { title: 'Boxing', image: '🥊' },
    { title: 'Immortals Revenge', image: '🗡️' },
    { title: 'Park Town', image: '🌳', badge: 'Hot' },
  ];
  const newGames = [
    { title: 'Merge Rot', image: '🧬', badge: 'New' },
    { title: 'RBWAR Online', image: '🤖', badge: 'New' },
    { title: 'Dash Peach-It', image: '🍑', badge: 'New' },
    { title: 'Redline Idle Front', image: '🚦', badge: 'New' },
    { title: 'Obby Sprunki', image: '🐱', badge: 'New' },
    { title: 'Raidfield 2', image: '🪖', badge: 'Updated' },
  ];
  const originals = [
    { title: 'Crazy Miners', image: '⛏️' },
    { title: 'Space Waves', image: '🌌' },
    { title: 'Boom Karts', image: '🏎️' },
    { title: 'Sky Riders', image: '🛩️' },
    { title: 'EvoWars.io', image: '⚔️' },
    { title: 'Mini Golf Club', image: '⛳' },
  ];

  return (
    <>
      <HeroCarousel />
      <GameSection title="Featured games" viewMoreHref="#" games={featuredGames} />
      <GameSection title="New games" viewMoreHref="#" games={newGames} />
      <GameSection title="CrazyGames Originals" viewMoreHref="#" games={originals} />
      {games.length > 0 && (
        <GameSection title="Live Games" viewMoreHref="#" games={games.map(game => ({ title: game.name, image: '🎮' }))} />
      )}
    </>
  );
};

export default HomePage; 