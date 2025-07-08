import { useEffect, useState } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import HeroCarousel from './views/components/HeroCarousel'
import GameSection from './views/components/GameSection'
import AuthModal from './AuthModal'
import HomePage from './views/pages/HomePage'
import UnityWebGLPage from './views/pages/UnityWebGLPage'
import UnityGamePage from './views/pages/UnityGamePage'

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

function FeaturedPage(props: any) {
  return <GameSection title="Featured games" viewMoreHref="#" games={props.featuredGames} />
}

function CategoriesPage() {
  return <div style={{color: 'var(--text-main)', padding: '2rem'}}>Categories page coming soon!</div>
}

function NewPage(props: any) {
  return <GameSection title="New games" viewMoreHref="#" games={props.newGames} />
}

function OriginalsPage(props: any) {
  return <GameSection title="CrazyGames Originals" viewMoreHref="#" games={props.originals} />
}

function UnityTestPage() {
  return <UnityWebGLPage buildPath="/unity-builds/test-build" gameName="Unity Test Game" />
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
  const [showAuthModal, setShowAuthModal] = useState(false)

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

  const handleAuth = async (username: string, password: string, isLogin: boolean) => {
    setLoading(true)
    setError('')
    
    try {
      const endpoint = isLogin ? '/login' : '/signup'
      const res = await axios.post(endpoint, { username, password })
      
      if (isLogin) {
        localStorage.setItem('token', res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
        setShowAuthModal(false)
      } else {
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

  // Demo data for game sections
  const featuredGames = [
    { title: 'Slot Machine', image: '🎰', badge: 'Hot', gameId: 'slot-machine', isUnityGame: true },
    { title: 'Blackjack', image: '🃏', badge: 'Hot', gameId: 'blackjack', isUnityGame: true },
    { title: 'Roulette', image: '🎲', badge: 'Hot', gameId: 'roulette', isUnityGame: true },
    { title: 'Poker', image: '♠️', gameId: 'poker', isUnityGame: true },
    { title: 'Hook King Runner', image: '🪝' },
    { title: 'Boom Karts', image: '🏎️' },
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

  if (token && user) {
    return (
      <BrowserRouter>
        <div className="app-with-sidebar">
          <Sidebar />
          <div className="main-content-with-sidebar">
            <TopBar user={user} onLogout={logout} onLoginClick={() => setShowAuthModal(true)} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/featured" element={<FeaturedPage featuredGames={featuredGames} />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/new" element={<NewPage newGames={newGames} />} />
              <Route path="/originals" element={<OriginalsPage originals={originals} />} />
              <Route path="/unity-test" element={<UnityTestPage />} />
              <Route path="/game/:gameId" element={<UnityGamePage />} />
            </Routes>
            <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} onAuth={handleAuth} loading={loading} error={error} />
          </div>
        </div>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <div className="app-with-sidebar">
        <Sidebar />
        <div className="main-content-with-sidebar">
          <TopBar onLoginClick={() => setShowAuthModal(true)} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/featured" element={<FeaturedPage featuredGames={featuredGames} />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/new" element={<NewPage newGames={newGames} />} />
            <Route path="/originals" element={<OriginalsPage originals={originals} />} />
            <Route path="/unity-test" element={<UnityTestPage />} />
            <Route path="/game/:gameId" element={<UnityGamePage />} />
          </Routes>
          <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} onAuth={handleAuth} loading={loading} error={error} />
        </div>
      </div>
    </BrowserRouter>
  )
}
