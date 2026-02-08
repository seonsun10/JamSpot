import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
import './TestPage.css'

const CONTENT_ID = 'random-dinner'

const menus = {
  korean: [
    { name: '삼겹살', emoji: '🥓' },
    { name: '치킨', emoji: '🍗' },
    { name: '찜닭', emoji: '🐔' },
    { name: '족발', emoji: '🦶' },
    { name: '보쌈', emoji: '🥬' },
    { name: '갈비찜', emoji: '🍖' },
    { name: '김치찌개', emoji: '🍲' },
    { name: '부대찌개', emoji: '🥘' }
  ],
  chinese: [
    { name: '짜장면', emoji: '🍝' },
    { name: '짬뽕', emoji: '🍜' },
    { name: '탕수육', emoji: '🍖' },
    { name: '마라탕', emoji: '🌶️' },
    { name: '양꼬치', emoji: '🍢' },
    { name: '꿔바로우', emoji: '🥡' }
  ],
  japanese: [
    { name: '초밥', emoji: '🍣' },
    { name: '라멘', emoji: '🍜' },
    { name: '돈카츠', emoji: '🍱' },
    { name: '우동', emoji: '🥢' },
    { name: '사시미', emoji: '🐟' },
    { name: '오코노미야키', emoji: '🥞' }
  ],
  western: [
    { name: '파스타', emoji: '🍝' },
    { name: '피자', emoji: '🍕' },
    { name: '스테이크', emoji: '🥩' },
    { name: '햄버거', emoji: '🍔' },
    { name: '리조또', emoji: '🍚' },
    { name: '감바스', emoji: '🦐' }
  ],
  snack: [
    { name: '떡볶이', emoji: '🌶️' },
    { name: '순대', emoji: '🩸' },
    { name: '라면', emoji: '🍜' },
    { name: '컵밥', emoji: '🍚' },
    { name: '김밥', emoji: '🍙' },
    { name: '핫도그', emoji: '🌭' }
  ],
  special: [
    { name: '양식코스', emoji: '🍽️' },
    { name: '오마카세', emoji: '🍣' },
    { name: '한정식', emoji: '🍱' },
    { name: '와인바', emoji: '🍷' },
    { name: '무한리필', emoji: '♾️' },
    { name: '뷔페', emoji: '🍴' }
  ]
}

const categories = [
  { id: 'korean', name: '한식', emoji: '🇰🇷' },
  { id: 'chinese', name: '중식', emoji: '🇨🇳' },
  { id: 'japanese', name: '일식', emoji: '🇯🇵' },
  { id: 'western', name: '양식', emoji: '🍝' },
  { id: 'snack', name: '분식', emoji: '🌶️' },
  { id: 'special', name: '스페셜', emoji: '✨' }
]

export default function DinnerRandom() {
  const [page, setPage] = useState('landing')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentEmoji, setCurrentEmoji] = useState('🍽️')
  const [result, setResult] = useState(null)
  const { count } = useParticipants(CONTENT_ID)
  const { toast, showToast } = useToast()

  const handleSpin = async () => {
    const menuList = selectedCategory === 'all' 
      ? Object.values(menus).flat() 
      : menus[selectedCategory]
    
    setIsSpinning(true)
    let counter = 0
    const spinInterval = setInterval(() => {
      const randomMenu = menuList[Math.floor(Math.random() * menuList.length)]
      setCurrentEmoji(randomMenu.emoji)
      counter++
      if (counter > 20) {
        clearInterval(spinInterval)
        const finalMenu = menuList[Math.floor(Math.random() * menuList.length)]
        setCurrentEmoji(finalMenu.emoji)
        setResult(finalMenu)
        setIsSpinning(false)
        incrementParticipants(CONTENT_ID)
      }
    }, 100)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('✅ 링크가 복사되었습니다!')
  }

  const handleRestart = () => {
    setResult(null)
    setCurrentEmoji('🍽️')
  }

  return (
    <div className="test-page lunch-theme">
      <div className="container">
        <Link to="/" className="back-btn">← 홈으로</Link>
        <div className="landing-content">
          <div className="title-badge">저녁 추천</div>
          <h1 className="main-title">🌙 저녁<br/>메뉴 추천</h1>
          <p className="subtitle">오늘 저녁 뭐 먹지?</p>

          <div className="food-categories">
            <button 
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <span>🍴</span><span>전체</span>
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.emoji}</span><span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="roulette-container">
            <div className="roulette-pointer">▼</div>
            <div className={`roulette-wheel ${isSpinning ? 'spinning' : ''}`}>
              <span className="roulette-display">{currentEmoji}</span>
            </div>
          </div>

          {!result ? (
            <button className="spin-btn" onClick={handleSpin} disabled={isSpinning}>
              {isSpinning ? '돌리는 중...' : '🎰 돌리기!'}
            </button>
          ) : (
            <div className="lunch-result">
              <div className="result-card">
                <div className="result-emoji-big">{result.emoji}</div>
                <p className="result-label">오늘의 저녁 메뉴</p>
                <h2 className="result-menu">{result.name}</h2>
                <a 
                  href={`https://map.naver.com/v5/search/${result.name}`} 
                  target="_blank" 
                  className="search-btn"
                >
                  🗺️ 근처 맛집 찾기
                </a>
              </div>
            </div>
          )}

          <p className="participants">{formatNumber(count)}명이 추천받았어요!</p>

          {result && (
            <div className="result-actions" style={{ marginTop: '20px' }}>
              <button className="share-btn" onClick={handleCopyLink}>🔗 공유</button>
              <button className="restart-btn" onClick={handleRestart}>🔄 다시</button>
            </div>
          )}
        </div>
      </div>
      <Toast show={toast.show} message={toast.message} />
    </div>
  )
}
