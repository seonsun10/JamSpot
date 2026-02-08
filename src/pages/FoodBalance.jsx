import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
import './TestPage.css'

const CONTENT_ID = 'food-balance'

const questions = [
  { text: '짜장면 vs 짬뽕', optionA: '달콤한 짜장면 🍝', optionB: '얼큰한 짬뽕 🍜' },
  { text: '치킨 vs 피자', optionA: '바삭한 치킨 🍗', optionB: '치즈 피자 🍕' },
  { text: '떡볶이 vs 순대', optionA: '매콤달콤 떡볶이 🌶️', optionB: '쫄깃한 순대 🩸' },
  { text: '탕수육 소스', optionA: '부먹이 진리 🫗', optionB: '찍먹이 정석 ✋' },
  { text: '라면 마무리', optionA: '밥 말아 먹기 🍚', optionB: '국물까지 다 마시기 🥣' },
  { text: '고기 굽기', optionA: '바싹 익혀야 해 🥩', optionB: '레어로 먹어야 제맛 🩸' },
  { text: '아침식사', optionA: '밥 + 국 한식 🍚', optionB: '빵 + 커피 양식 🥐' },
  { text: '매운 거', optionA: '진짜 매운 거 OK 🔥', optionB: '적당히 맵게 🌶️' },
  { text: '민트초코', optionA: '민초단 (맛있어!) 🍦', optionB: '반민초 (치약이야) 🪥' },
  { text: '파 vs 고수', optionA: '파는 맛있어 🧅', optionB: '고수도 OK 🌿' }
]

export default function FoodBalance() {
  const [page, setPage] = useState('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const { count } = useParticipants(CONTENT_ID)
  const { toast, showToast } = useToast()

  const handleStart = () => {
    setPage('game')
    setCurrentQ(0)
    setAnswers([])
  }

  const handleAnswer = async (choice) => {
    const newAnswers = [...answers, { q: questions[currentQ].text, a: choice === 'A' ? questions[currentQ].optionA : questions[currentQ].optionB }]
    setAnswers(newAnswers)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      await incrementParticipants(CONTENT_ID)
      setPage('result')
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('✅ 링크가 복사되었습니다!')
  }

  if (page === 'landing') {
    return (
      <div className="test-page lunch-theme">
        <div className="container">
          <Link to="/" className="back-btn">← 홈으로</Link>
          <div className="landing-content">
            <div className="title-badge">밸런스게임</div>
            <h1 className="main-title">🍕 음식<br/>밸런스</h1>
            <p className="subtitle">당신의 음식 취향은?</p>
            <div className="generation-icons">
              <span>🍗</span>
              <span className="vs">VS</span>
              <span>🍕</span>
            </div>
            <button className="start-btn" onClick={handleStart}>시작하기 →</button>
            <p className="participants">{formatNumber(count)}명이 참여했어요!</p>
          </div>
        </div>
      </div>
    )
  }

  if (page === 'game') {
    const q = questions[currentQ]
    const progress = ((currentQ + 1) / questions.length) * 100
    return (
      <div className="test-page lunch-theme">
        <div className="container">
          <div className="quiz-header">
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
            <span className="progress-text">{currentQ + 1} / {questions.length}</span>
          </div>
          <div className="quiz-content balance-content">
            <h2 className="question-text">{q.text}</h2>
            <div className="balance-options">
              <button className="balance-option option-a" onClick={() => handleAnswer('A')}>{q.optionA}</button>
              <div className="vs-divider">VS</div>
              <button className="balance-option option-b" onClick={() => handleAnswer('B')}>{q.optionB}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (page === 'result') {
    return (
      <div className="test-page lunch-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">나의 음식 취향</div>
            <div className="result-icon">🍕</div>
            <h1 className="result-title">음식 취향 결과</h1>
            <div className="balance-result-list">
              {answers.map((item, idx) => (
                <div key={idx} className="balance-result-item">
                  <span className="balance-q">{item.q}</span>
                  <span className="balance-a">{item.a}</span>
                </div>
              ))}
            </div>
            <div className="result-actions">
              <button className="share-btn" onClick={handleCopyLink}>🔗 링크 복사</button>
              <button className="restart-btn" onClick={handleStart}>🔄 다시하기</button>
              <Link to="/" className="home-btn">🏠 다른 테스트</Link>
            </div>
          </div>
        </div>
        <Toast show={toast.show} message={toast.message} />
      </div>
    )
  }

  return null
}
