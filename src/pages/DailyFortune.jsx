import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
import './TestPage.css'

const CONTENT_ID = 'daily-fortune'

const fortunes = {
  love: [
    '오늘 운명의 만남이 기다리고 있어요! 💕',
    '솔로탈출 D-DAY? 오늘 적극적으로! 🌹',
    '연인과 달콤한 하루가 될 거예요 ☕',
    '마음 전할 좋은 타이밍이에요 💌',
    '오늘은 혼자만의 시간이 필요해요 🧘'
  ],
  money: [
    '뜻밖의 수입이 들어올 수 있어요! 💰',
    '충동구매 조심! 지갑 꽉 닫으세요 🔒',
    '투자보다 저축이 답인 날 🏦',
    '적극적인 재테크가 필요해요 📈',
    '작은 행운이 찾아올 수 있어요 🍀'
  ],
  work: [
    '오늘 집중하면 대박 성과! 💪',
    '동료와 협업하면 시너지 UP 🤝',
    '중요한 결정은 내일로 미뤄요 ⏰',
    '새로운 기회가 찾아올 수 있어요 🚀',
    '오늘은 적당히, 워라밸 챙기세요 🌴'
  ],
  health: [
    '가벼운 운동으로 활력 충전! 🏃',
    '충분한 수면이 필요한 날이에요 😴',
    '건강 검진 한번 받아보세요 🏥',
    '스트레칭으로 몸 풀어주세요 🧘‍♀️',
    '물 많이 마시면 좋은 날 💧'
  ]
}

const luckyColors = ['빨강 🔴', '주황 🟠', '노랑 🟡', '초록 🟢', '파랑 🔵', '보라 🟣', '분홍 🩷', '검정 ⚫', '흰색 ⚪']
const luckyNumbers = [1, 3, 7, 8, 12, 15, 21, 24, 28, 33, 42, 77]
const luckyItems = ['커피 ☕', '초콜릿 🍫', '꽃 🌸', '책 📚', '음악 🎵', '향수 🌺', '말풍선 💬', '하트 ❤️']

export default function DailyFortune() {
  const [page, setPage] = useState('landing')
  const [fortune, setFortune] = useState(null)
  const { count } = useParticipants(CONTENT_ID)
  const { toast, showToast } = useToast()

  const generateFortune = async () => {
    setPage('loading')
    setTimeout(async () => {
      const result = {
        love: fortunes.love[Math.floor(Math.random() * fortunes.love.length)],
        money: fortunes.money[Math.floor(Math.random() * fortunes.money.length)],
        work: fortunes.work[Math.floor(Math.random() * fortunes.work.length)],
        health: fortunes.health[Math.floor(Math.random() * fortunes.health.length)],
        luckyColor: luckyColors[Math.floor(Math.random() * luckyColors.length)],
        luckyNumber: luckyNumbers[Math.floor(Math.random() * luckyNumbers.length)],
        luckyItem: luckyItems[Math.floor(Math.random() * luckyItems.length)],
        overallScore: Math.floor(Math.random() * 41) + 60 // 60-100
      }
      setFortune(result)
      await incrementParticipants(CONTENT_ID)
      setPage('result')
    }, 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('✅ 링크가 복사되었습니다!')
  }

  if (page === 'landing') {
    return (
      <div className="test-page fortune-theme">
        <div className="container">
          <Link to="/" className="back-btn">← 홈으로</Link>
          <div className="landing-content">
            <div className="title-badge">오늘의 운세</div>
            <h1 className="main-title">🔮 오늘의<br/>운세</h1>
            <p className="subtitle">오늘 하루 운세를 확인해보세요!</p>
            <div className="animal-preview">
              <span>💕</span><span>💰</span><span>💼</span><span>💪</span>
            </div>
            <button className="start-btn" onClick={generateFortune}>운세 보기 →</button>
            <p className="participants">{formatNumber(count)}명이 확인했어요!</p>
          </div>
        </div>
      </div>
    )
  }

  if (page === 'loading') {
    return (
      <div className="test-page fortune-theme">
        <div className="container loading-content">
          <div className="loading-spinner">🔮</div>
          <p className="loading-text">오늘의 운세를 점치는 중...</p>
        </div>
      </div>
    )
  }

  if (page === 'result' && fortune) {
    return (
      <div className="test-page fortune-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">오늘의 운세</div>
            <div className="result-icon">🔮</div>
            <h1 className="result-title">전체 운세 {fortune.overallScore}점</h1>
            
            <div className="fortune-details">
              <div className="fortune-item"><span>💕 연애운</span><p>{fortune.love}</p></div>
              <div className="fortune-item"><span>💰 금전운</span><p>{fortune.money}</p></div>
              <div className="fortune-item"><span>💼 직장운</span><p>{fortune.work}</p></div>
              <div className="fortune-item"><span>💪 건강운</span><p>{fortune.health}</p></div>
            </div>
            
            <div className="lucky-items">
              <div className="lucky-row"><span>🎨 행운의 색</span><span>{fortune.luckyColor}</span></div>
              <div className="lucky-row"><span>🔢 행운의 숫자</span><span>{fortune.luckyNumber}</span></div>
              <div className="lucky-row"><span>🍀 행운의 아이템</span><span>{fortune.luckyItem}</span></div>
            </div>
            
            <div className="result-actions">
              <button className="share-btn" onClick={handleCopyLink}>🔗 링크 복사</button>
              <button className="restart-btn" onClick={generateFortune}>🔄 다시 보기</button>
              <Link to="/" className="home-btn">🏠 홈으로</Link>
            </div>
          </div>
        </div>
        <Toast show={toast.show} message={toast.message} />
      </div>
    )
  }

  return null
}
