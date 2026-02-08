import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
import './TestPage.css'

const CONTENT_ID = 'friend-type'

const questions = [
  { id: 1, text: '친구들 모임에서 나는?', optionA: '분위기 띄우는 역할 🎉', optionB: '조용히 듣는 편 🤫', type: { A: 'mood', B: 'listener' } },
  { id: 2, text: '친구가 힘들어할 때?', optionA: '같이 울어줘 😢', optionB: '해결책을 찾아줘 💡', type: { A: 'empathy', B: 'solver' } },
  { id: 3, text: '약속 시간에?', optionA: '먼저 도착해서 기다려 ⏰', optionB: '적당히 맞춰가 🚶', type: { A: 'planner', B: 'chill' } },
  { id: 4, text: '친구 생일에?', optionA: '깜짝 파티 준비 🎂', optionB: '선물과 축하 메시지 💝', type: { A: 'mood', B: 'caring' } },
  { id: 5, text: '친구들 사이 갈등이 생기면?', optionA: '중간에서 화해시켜 🤝', optionB: '각자 알아서 하라고 😅', type: { A: 'mediator', B: 'chill' } },
  { id: 6, text: '비밀 얘기를 들으면?', optionA: '무덤까지 가져가 🤐', optionB: '가끔 힌트 흘려... 🫢', type: { A: 'loyal', B: 'chill' } },
  { id: 7, text: '단톡방에서 나는?', optionA: '리액션 담당 😆', optionB: '읽씹의 달인 👀', type: { A: 'mood', B: 'listener' } },
  { id: 8, text: '친구와 여행 가면?', optionA: '일정 다 짜 오는 스타일 📋', optionB: '그냥 따라가는 스타일 🎒', type: { A: 'planner', B: 'chill' } },
  { id: 9, text: '친구에게 솔직한 말을?', optionA: '필요하면 쓴소리도 해 💪', optionB: '상처받을까 봐 돌려서 🌸', type: { A: 'honest', B: 'caring' } },
  { id: 10, text: '오래된 친구와?', optionA: '자주 연락해 📱', optionB: '안 봐도 마음은 변함없어 💕', type: { A: 'active', B: 'loyal' } }
]

const friendTypes = {
  mood: { icon: '🎉', title: '분위기 메이커', description: '모임의 활력소! 너만 있으면 재미있어~' },
  listener: { icon: '👂', title: '경청의 달인', description: '말없이 들어주는 든든한 존재. 비밀 창고!' },
  empathy: { icon: '🤗', title: '공감 요정', description: '감정을 100% 이해해주는 따뜻한 친구' },
  solver: { icon: '💡', title: '문제 해결사', description: '고민이 있으면 나에게! 해결책 제조기' },
  planner: { icon: '📋', title: '계획 담당', description: '모임 일정? 내가 다 짜놨어!' },
  mediator: { icon: '🕊️', title: '평화의 사절단', description: '싸우면 내가 나서! 화해 전문가' },
  loyal: { icon: '🛡️', title: '충성의 아이콘', description: '한번 친구는 영원한 친구! 의리파' },
  caring: { icon: '🧸', title: '따뜻한 보호자', description: '챙겨주고 보살펴주는 엄마 같은 친구' }
}

export default function FriendTypeTest() {
  const [page, setPage] = useState('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [typeScores, setTypeScores] = useState({})
  const [result, setResult] = useState(null)
  const { count } = useParticipants(CONTENT_ID)
  const { toast, showToast } = useToast()

  const handleStart = () => {
    setPage('quiz')
    setCurrentQ(0)
    setTypeScores({})
  }

  const handleAnswer = (choice) => {
    const q = questions[currentQ]
    const type = q.type[choice]
    const newScores = { ...typeScores }
    newScores[type] = (newScores[type] || 0) + 1
    setTypeScores(newScores)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setPage('loading')
      setTimeout(async () => {
        const topType = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0]
        setResult(friendTypes[topType])
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
      <div className="test-page friend-theme">
        <div className="container">
          <Link to="/" className="back-btn">← 홈으로</Link>
          <div className="landing-content">
            <div className="title-badge">심리테스트</div>
            <h1 className="main-title">🤝 찐친 유형<br/>테스트</h1>
            <p className="subtitle">친구들 사이에서 나의 역할은?</p>
            <div className="animal-preview">
              <span>🎉</span><span>👂</span><span>💡</span><span>🛡️</span>
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
      <div className="test-page friend-theme">
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
      <div className="test-page friend-theme">
        <div className="container loading-content">
          <div className="loading-spinner">🤝</div>
          <p className="loading-text">친구 유형 분석 중...</p>
        </div>
      </div>
    )
  }

  if (page === 'result' && result) {
    return (
      <div className="test-page friend-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">친구들 사이 당신의 역할</div>
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
