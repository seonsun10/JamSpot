import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
import './TestPage.css'

const CONTENT_ID = 'love-type'

const questions = [
  { id: 1, text: '썸 탈 때 나는?', optionA: '먼저 연락하는 편 📱', optionB: '기다리는 편 ⏳', axis: 'pursue' },
  { id: 2, text: '연인과 갈등이 생기면?', optionA: '바로 대화로 해결 💬', optionB: '시간을 두고 생각 🤔', axis: 'direct' },
  { id: 3, text: '애정 표현 방식은?', optionA: '말보다 행동으로 🎁', optionB: '스킨십과 말로 💕', axis: 'express' },
  { id: 4, text: '연인의 SNS를?', optionA: '자주 확인해 👀', optionB: '별로 신경 안 써 😌', axis: 'jealous' },
  { id: 5, text: '이상형은?', optionA: '나를 리드해주는 사람 👑', optionB: '나를 따라와주는 사람 🐕', axis: 'lead' },
  { id: 6, text: '데이트 장소는?', optionA: '집에서 편하게 🏠', optionB: '밖에서 활동적으로 🎢', axis: 'active' },
  { id: 7, text: '연락 빈도는?', optionA: '수시로 카톡 해야 해 💬', optionB: '하루 한두 번이면 충분 ✅', axis: 'contact' },
  { id: 8, text: '결혼 생각은?', optionA: '연애는 결혼 전제 💒', optionB: '지금 행복하면 됐지 🌸', axis: 'future' },
  { id: 9, text: '전 애인 얘기가 나오면?', optionA: '별로 듣고 싶지 않아 😤', optionB: '과거는 과거일 뿐 😊', axis: 'jealous' },
  { id: 10, text: '연인에게 바라는 것은?', optionA: '안정감과 신뢰 🏠', optionB: '설렘과 재미 🎉', axis: 'stable' }
]

const loveTypes = {
  passionate: { icon: '🔥', title: '불꽃 연애형', description: '뜨거운 감정에 충실! 밀당보다 직진, 사랑할 땐 올인하는 열정파!' },
  caring: { icon: '🧸', title: '헌신 연애형', description: '연인을 위해서라면 뭐든! 보살핌의 달인, 따뜻한 사랑꾼!' },
  independent: { icon: '🌿', title: '독립 연애형', description: '사랑해도 내 시간은 필요해! 서로를 존중하는 성숙한 연애 스타일.' },
  romantic: { icon: '💐', title: '로맨틱 연애형', description: '영화 같은 사랑을 꿈꿔! 기념일, 서프라이즈, 감동 담당!' },
  stable: { icon: '🏡', title: '안정 연애형', description: '연애도 미래도 계획적으로! 결혼을 향해 차근차근 나아가는 스타일.' },
  playful: { icon: '🎠', title: '유쾌 연애형', description: '사랑은 즐거워야지! 웃음이 넘치는 재미있는 연애가 최고!' }
}

function getLoveType(answers) {
  const scores = { pursue: 0, direct: 0, express: 0, jealous: 0, active: 0, contact: 0, stable: 0 }
  answers.forEach((a, i) => { if (a === 'A') scores[questions[i].axis] += 1 })
  
  if (scores.pursue >= 1 && scores.contact >= 1 && scores.jealous >= 1) return 'passionate'
  if (scores.express >= 1 && scores.pursue >= 1) return 'caring'
  if (scores.contact === 0 && scores.jealous === 0) return 'independent'
  if (scores.active >= 1 && scores.stable === 0) return 'romantic'
  if (scores.stable >= 1) return 'stable'
  return 'playful'
}

export default function LoveTypeTest() {
  const [page, setPage] = useState('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const { count } = useParticipants(CONTENT_ID)
  const { toast, showToast } = useToast()

  const handleStart = () => {
    setPage('quiz')
    setCurrentQ(0)
    setAnswers([])
  }

  const handleAnswer = (choice) => {
    const newAnswers = [...answers, choice]
    setAnswers(newAnswers)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setPage('loading')
      setTimeout(async () => {
        const type = getLoveType(newAnswers)
        setResult(loveTypes[type])
        await incrementParticipants(CONTENT_ID)
        setPage('result')
      }, 2500)
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
            <div className="title-badge">심리테스트</div>
            <h1 className="main-title">💕 연애 유형<br/>테스트</h1>
            <p className="subtitle">나는 어떤 연애 스타일?</p>
            <div className="animal-preview">
              <span>🔥</span><span>🧸</span><span>💐</span><span>🏡</span>
            </div>
            <button className="start-btn" onClick={handleStart}>시작하기 →</button>
            <p className="participants">{formatNumber(count)}명이 참여했어요!</p>
          </div>
        </div>
      </div>
    )
  }

  if (page === 'quiz') {
    const q = questions[currentQ]
    const progress = ((currentQ + 1) / questions.length) * 100
    return (
      <div className="test-page love-theme">
        <div className="container">
          <div className="quiz-header">
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
            <span className="progress-text">{currentQ + 1} / {questions.length}</span>
          </div>
          <div className="quiz-content">
            <span className="question-number">Q{currentQ + 1}</span>
            <h2 className="question-text">{q.text}</h2>
            <div className="options">
              <button className="option-btn" onClick={() => handleAnswer('A')}>{q.optionA}</button>
              <button className="option-btn" onClick={() => handleAnswer('B')}>{q.optionB}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (page === 'loading') {
    return (
      <div className="test-page love-theme">
        <div className="container loading-content">
          <div className="loading-spinner">💘</div>
          <p className="loading-text">연애 유형 분석 중...</p>
        </div>
      </div>
    )
  }

  if (page === 'result' && result) {
    return (
      <div className="test-page love-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">당신의 연애 유형은?</div>
            <div className="result-icon">{result.icon}</div>
            <h1 className="result-title">{result.title}</h1>
            <p className="result-description">{result.description}</p>
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
