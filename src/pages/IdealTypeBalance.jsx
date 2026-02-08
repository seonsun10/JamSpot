import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
import './TestPage.css'

const CONTENT_ID = 'ideal-type-balance'

const questions = [
  { text: '외모 vs 성격', optionA: '잘생김/예쁨이 우선 👀', optionB: '마음이 예쁜 게 중요 💕' },
  { text: '키 vs 얼굴', optionA: '키가 커야지 📏', optionB: '얼굴이 예뻐야지 😍' },
  { text: '말 잘하는 vs 말 없는', optionA: '대화가 재밌는 사람 🗣️', optionB: '조용히 들어주는 사람 👂' },
  { text: '연상 vs 연하', optionA: '나를 이끌어주는 연상 👑', optionB: '귀여운 연하 🐥' },
  { text: '밀당 vs 직진', optionA: '밀당 좀 할 줄 아는 🎭', optionB: '솔직하게 좋다고 말하는 💘' },
  { text: '친구같은 vs 연인같은', optionA: '편하게 장난치는 친구 같은 🤝', optionB: '로맨틱하고 다정한 연인 같은 🌹' },
  { text: '집순이/집돌이 vs 나들이', optionA: '집에서 함께 힐링 🏠', optionB: '밖에서 함께 활동 🎢' },
  { text: '요리 잘하는 vs 돈 잘 버는', optionA: '집밥 해주는 사람 🍳', optionB: '맛집 데려가는 사람 💳' },
  { text: '질투 많은 vs 쿨한', optionA: '적당히 질투해주는 😤', optionB: '쿨하게 믿어주는 😎' },
  { text: '문자파 vs 통화파', optionA: '자주 연락하는 카톡 파 💬', optionB: '가끔 전화하는 통화 파 📞' }
]

export default function IdealTypeBalance() {
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
      <div className="test-page love-theme">
        <div className="container">
          <Link to="/" className="back-btn">← 홈으로</Link>
          <div className="landing-content">
            <div className="title-badge">밸런스게임</div>
            <h1 className="main-title">💘 이상형<br/>밸런스</h1>
            <p className="subtitle">나의 이상형 조건을 확인해보자!</p>
            <div className="generation-icons">
              <span>👀</span>
              <span className="vs">VS</span>
              <span>💕</span>
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
      <div className="test-page love-theme">
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
      <div className="test-page love-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">나의 이상형 조건</div>
            <div className="result-icon">💘</div>
            <h1 className="result-title">이상형 결과</h1>
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
