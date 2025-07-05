import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

interface Game {
  id: string
  name: string
  url: string
}

interface User {
  id: string
  username: string
  wallet: {
    balance: number
  }
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [games, setGames] = useState<Game[]>([])
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (token) {
      fetchGames()
    }
  }, [token])

  const fetchGames = async () => {
    try {
      const res = await axios.get('/api/games', { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      setGames(res.data)
    } catch (err) {
      console.error('Failed to fetch games:', err)
    }
  }

  const handleAuth = async () => {
    setLoading(true)
    setError('')
    
    try {
      const endpoint = isLogin ? '/login' : '/signup'
      const res = await axios.post(endpoint, { username, password })
      
      if (isLogin) {
        localStorage.setItem('token', res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
      } else {
        setIsLogin(true)
        setError('Account created! Please login.')
      }
    } catch (err: any) {
      setError(err.response?.data || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setGames([])
  }

  if (token && user) {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">🎰 Casino Mini Games</div>
          <div className="nav-user">
            <span>Welcome, {user.username}!</span>
            <span className="wallet">💰 ${user.wallet.balance}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </nav>
        
        <main className="main-content">
          <h1 className="games-title">🎮 Available Games</h1>
          <div className="games-grid">
            {games.map(game => (
              <div key={game.id} className="game-card">
                <div className="game-icon">🎲</div>
                <h3>{game.name}</h3>
                <a href={game.url} className="play-btn" target="_blank" rel="noopener noreferrer">
                  Play Now
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            🎰 Welcome to Casino Mini Games
          </h1>
          <p className="hero-subtitle">
            Experience the thrill of classic casino games in a modern, secure environment
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Secure & Fair</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎮</span>
              <span>Multiple Games</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💰</span>
              <span>Virtual Wallet</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">♠️</div>
          <div className="floating-card card-2">♥️</div>
          <div className="floating-card card-3">♦️</div>
          <div className="floating-card card-4">♣️</div>
        </div>
      </section>

      {/* Auth Section */}
      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
          
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
            <div className="form-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="form-input"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Casino Mini Games. Play responsibly!</p>
      </footer>
    </div>
  )
}
