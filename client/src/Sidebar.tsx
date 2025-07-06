import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { icon: '🏠', label: 'Home', to: '/' },
  { icon: '⭐', label: 'Featured', to: '/featured' },
  { icon: '🗂️', label: 'Categories', to: '/categories' },
  { icon: '🆕', label: 'New', to: '/new' },
  { icon: '🎬', label: 'Originals', to: '/originals' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}> 
      <div className="sidebar-logo" title="Web3 P2E Arcade">
        <span className="sidebar-logo-icon">🪙</span>
        <span className="sidebar-logo-text">P2E Web3 Arcade</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              'sidebar-nav-item' + (isActive ? ' active' : '')
            }
            end={item.to === '/'}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="sidebar-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? '←' : '☰'}
      </button>
    </aside>
  );
} 