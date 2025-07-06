import React from 'react';
import './TopBar.css';

interface User {
  username: string;
  wallet: { balance: number };
}

interface TopBarProps {
  onLoginClick: () => void;
  user?: User | null;
  onLogout?: () => void;
}

export default function TopBar({ onLoginClick, user, onLogout }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-logo">🪙</span>
        <span className="topbar-welcome">PlayCipherX</span>
      </div>
      <div className="topbar-center">
        <input className="topbar-search" type="text" placeholder="Search games..." />
      </div>
      <div className="topbar-actions">
        <span className="topbar-action" title="Games">🎲 100+</span>
        <span className="topbar-action" title="No install needed">⚡</span>
        <span className="topbar-action" title="On any device">📱</span>
        <span className="topbar-action" title="Play with friends">👥</span>
        <span className="topbar-action" title="All for free">🆓</span>
        {user ? (
          <div className="topbar-user">
            <span className="topbar-username">{user.username}</span>
            <span className="topbar-wallet">💰 ${user.wallet.balance}</span>
            <button className="topbar-logout" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <button className="topbar-login" onClick={onLoginClick}>Log in</button>
        )}
      </div>
    </header>
  );
} 