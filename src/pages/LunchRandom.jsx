import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import './TestPage.css'

const CONTENT_ID = 'random-lunch'

const menus = {
  all: [],
  korean: [
    { name: '김치찌개', emoji: '🍲' }, { name: '된장찌개', emoji: '🥘' }, { name: '불고기', emoji: '🥩' },
    { name: '비빔밥', emoji: '🍚' }, { name: '삼겹살', emoji: '🥓' }, { name: '제육볶음', emoji: '🍖' },
    { name: '순두부찌개', emoji: '🥣' }, { name: '닭갈비', emoji: '🐔' }, { name: '칼국수', emoji: '🍜' }
  ],
  chinese: [
    { name: '짜장면', emoji: '🍜' }, { name: '짬뽕', emoji: '🍜' }, { name: '탕수육', emoji: '🍖' },
    { name: '마라탕', emoji: '🌶️' }, { name: '양꼬치', emoji: '🍢' }, { name: '볶음밥', emoji: '🍳' }
  ],
  japanese: [
    { name: '초밥', emoji: '🍣' }, { name: '라멘', emoji: '🍜' }, { name: '우동', emoji: '🍲' },
    { name: '돈카츠', emoji: '🍖' }, { name: '카레', emoji: '🍛' }, { name: '규동', emoji: '🥩' }
  ],
  western: [
    { name: '파스타', emoji: '🍝' }, { name: '피자', emoji: '🍕' }, { name: '햄버거', emoji: '🍔' },
    { name: '스테이크', emoji: '🥩' }, { name: '샐러드', emoji: '🥗' }, { name: '치킨', emoji: '🍗' }
  ],
  snack: [
    { name: '떡볶이', emoji: '🍢' }, { name: '라면', emoji: '🍜' }, { name: '순대', emoji: '🌭' },
    { name: '튀김', emoji: '🍤' }, { name: '만두', emoji: '🥟' }, { name: '김밥', emoji: '🍙' }
  ]
}

menus.all = [...menus.korean, ...menus.chinese, ...menus.japanese, ...menus.western, ...menus.snack]

const categories = [
  { key: 'all', label: '전체', icon: '🍴' },
  { key: 'korean', label: '한식', icon: '🍚' },
  { key: 'chinese', label: '중식', icon: '🥟' },
  { key: 'japanese', label: '일식', icon: '🍣' },
  { key: 'western', label: '양식', icon: '🍝' },
  { key: 'snack', label: '분식', icon: '🍜' }
]

export default function LunchRandom() {
  const [category, setCategory] = useState('all')
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [displayEmoji, setDisplayEmoji] = useState('🍽️')
  const { count } = useParticipants(CONTENT_ID)

  const handleSpin = async () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)

    const menuList = menus[category]
    let spinCount = 0
    const maxSpins = 25

    const interval = setInterval(() => {
      const randomMenu = menuList[Math.floor(Math.random() * menuList.length)]
      setDisplayEmoji(randomMenu.emoji)
      spinCount++

      if (spinCount >= maxSpins) {
        clearInterval(interval)
        const finalMenu = menuList[Math.floor(Math.random() * menuList.length)]
        setDisplayEmoji(finalMenu.emoji)
        setResult(finalMenu)
        incrementParticipants(CONTENT_ID)
        setSpinning(false)
      }
    }, 100)
  }

  return (
    <div className="test-page lunch-theme">
      <div className="container">
        <Link to="/" className="back-btn">← 홈으로</Link>
        
        <div className="landing-content">
          <div className="title-badge">랜덤 추천</div>
          <h1 className="main-title">🍽️ 점심 뭐먹지?</h1>
          <p className="subtitle">고민은 그만! 룰렛이 정해드려요!</p>

          {/* Category Buttons */}
          <div className="food-categories">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`category-btn ${category === cat.key ? 'active' : ''}`}
                onClick={() => { setCategory(cat.key); setResult(null); setDisplayEmoji('🍽️') }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Roulette */}
          <div className="roulette-container">
            <div className={`roulette-wheel ${spinning ? 'spinning' : ''}`}>
              <span className="roulette-display">{displayEmoji}</span>
            </div>
            <div className="roulette-pointer">▼</div>
          </div>

          <button className="spin-btn" onClick={handleSpin} disabled={spinning}>
            🎰 {spinning ? '돌리는 중...' : '돌려돌려!'}
          </button>

          {/* Result */}
          {result && (
            <div className="lunch-result">
              <div className="result-card">
                <span className="result-label">오늘의 점심은</span>
                <div className="result-menu">{result.name}</div>
                <div className="result-emoji-big">{result.emoji}</div>
                <a
                  className="search-btn"
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(result.name + ' 맛집')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔍 근처 맛집 검색
                </a>
              </div>
            </div>
          )}

          <p className="participants">{formatNumber(count)}명이 사용했어요!</p>
        </div>
      </div>
    </div>
  )
}
