import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import JoseonTest from './pages/JoseonTest'
import MbtiAnimalTest from './pages/MbtiAnimalTest'
import CountryPastTest from './pages/CountryPastTest'
import LoveTypeTest from './pages/LoveTypeTest'
import MoneyMindTest from './pages/MoneyMindTest'
import FriendTypeTest from './pages/FriendTypeTest'
import OfficeSurvivalTest from './pages/OfficeSurvivalTest'
import BalanceGame from './pages/BalanceGame'
import IdealTypeBalance from './pages/IdealTypeBalance'
import FoodBalance from './pages/FoodBalance'
import LifeBalance from './pages/LifeBalance'
import LunchRandom from './pages/LunchRandom'
import DinnerRandom from './pages/DinnerRandom'
import DailyFortune from './pages/DailyFortune'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 심리테스트 */}
        <Route path="/test/joseon" element={<JoseonTest />} />
        <Route path="/test/mbti-animal" element={<MbtiAnimalTest />} />
        <Route path="/test/country" element={<CountryPastTest />} />
        <Route path="/test/love" element={<LoveTypeTest />} />
        <Route path="/test/money" element={<MoneyMindTest />} />
        <Route path="/test/friend" element={<FriendTypeTest />} />
        <Route path="/test/office" element={<OfficeSurvivalTest />} />
        {/* 밸런스게임 */}
        <Route path="/game/balance" element={<BalanceGame />} />
        <Route path="/game/ideal" element={<IdealTypeBalance />} />
        <Route path="/game/food" element={<FoodBalance />} />
        <Route path="/game/life" element={<LifeBalance />} />
        {/* 랜덤추천 */}
        <Route path="/random/lunch" element={<LunchRandom />} />
        <Route path="/random/dinner" element={<DinnerRandom />} />
        <Route path="/random/fortune" element={<DailyFortune />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
