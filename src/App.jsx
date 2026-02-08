import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import JoseonTest from './pages/JoseonTest'
import BalanceGame from './pages/BalanceGame'
import LunchRandom from './pages/LunchRandom'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test/joseon" element={<JoseonTest />} />
        <Route path="/game/balance" element={<BalanceGame />} />
        <Route path="/random/lunch" element={<LunchRandom />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
