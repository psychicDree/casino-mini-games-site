import { useEffect, useState } from 'react'
import axios from 'axios'

interface Game {
  id: string
  name: string
  url: string
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    if (token) {
      axios.get('/api/games', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setGames(res.data))
    }
  }, [token])

  const login = async () => {
    const res = await axios.post('/login', { username, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
  }

  if (!token) {
    return (
      <div>
        <h1>Login</h1>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder='username'/>
        <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='password'/>
        <button onClick={login}>Login</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Games</h1>
      <ul>
        {games.map(g => (
          <li key={g.id}><a href={g.url}>{g.name}</a></li>
        ))}
      </ul>
    </div>
  )
}
