import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import StudentsPage from './pages/StudentsPage'
import GuardiansPage from './pages/GuardiansPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/students">Students</Link>
            </li>
            <li>
              <Link to="/guardians">Guardians</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Welcome to Bus App</h1>} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/guardians" element={<GuardiansPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App