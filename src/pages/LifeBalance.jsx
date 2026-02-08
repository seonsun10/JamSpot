import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
import './TestPage.css'

const CONTENT_ID = 'life-balance'

const questions = [
  { text: '돈 많고 외로움 vs 가난하고 행복', optionA: '돈은 있어야지... 💰', optionB: '사랑이 더 중요해 💕' },
  { text: '기억 모두 삭제 vs 미래 못 봄', optionA: '과거는 잊고 새 출발 🆕', optionB: '추억은 소중하니까 📷' },
  { text: '모두에게 사랑받음 vs 단 한 명의 진짜 사랑', optionA: '인기 많은 게 좋아 ⭐', optionB: '진정한 사랑 하나면 돼 💑' },
  { text: '10년 후 확정 vs 불확실한 가능성', optionA: '안정적인 미래 📋', optionB: '무한한 가능성 🚀' },
  { text: '하고 싶은 일 월급 반토막 vs 싫은 일 연봉 두 배', optionA: '적게 벌어도 행복 🌸', optionB: '돈 많이 버는 게 현실 💼' },
  { text: '마음 읽기 vs 미래 보기', optionA: '사람 마음을 알고 싶어 🧠', optionB: '미래가 궁금해 🔮' },
  { text: '시간 멈추기 vs 순간이동', optionA: '시간을 멈출래 ⏱️', optionB: '텔레포트 할래 🌀' },
  { text: '죽기 전 24시간 vs 다시 태어남', optionA: '마지막 24시간 풀파워 ⚡', optionB: '새 인생 시작 🍼' },
  { text: '절친 1명 vs 친구 100명', optionA: '깊은 관계 한 명 🤝', optionB: '넓은 인맥 백 명 🌐' },
  { text: '젊음 유지 vs 지혜 획득', optionA: '영원한 청춘 🧒', optionB: '모든 걸 아는 지혜 🧓' }
]

export default function LifeBalance() {
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
      <div className="test-page mz-theme">
        <div className="container">
          <Link to="/" className="back-btn">← 홈으로</Link>
          <div className="landing-content">
            <div className="title-badge">밸런스게임</div>
            <h1 className="main-title">⚖️ 인생<br/>밸런스</h1>
            <p className="subtitle">극한의 선택! 당신의 가치관은?</p>
            <div className="generation-icons">
              <span>💰</span>
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
      <div className="test-page mz-theme">
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
      <div className="test-page mz-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">나의 인생 선택</div>
            <div className="result-icon">⚖️</div>
            <h1 className="result-title">인생 가치관 결과</h1>
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
