import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
import './TestPage.css'

const CONTENT_ID = 'office-survival'

const questions = [
  { id: 1, text: '상사가 부당한 지시를 하면?', optionA: '일단 따르고 나중에 얘기 😶', optionB: '바로 내 의견을 말해 🗣️', score: { A: 2, B: 1 } },
  { id: 2, text: '야근 요청이 왔을 때?', optionA: '어쩔 수 없지... 😮‍💨', optionB: '미리 말해주셨어야죠 😤', score: { A: 2, B: 0 } },
  { id: 3, text: '회식 자리에서?', optionA: '술 따르고 분위기 맞춰 🍻', optionB: '적당히 있다가 먼저 빠져 🚶', score: { A: 2, B: 1 } },
  { id: 4, text: '성과를 가로채이면?', optionA: '참고 다음에 더 잘해 🥲', optionB: '증거 남기고 정당하게 항의 📝', score: { A: 1, B: 2 } },
  { id: 5, text: '동료가 뒷담화를 하면?', optionA: '모르는 척 넘어가 🙈', optionB: '직접 얘기해줘 🤨', score: { A: 2, B: 1 } },
  { id: 6, text: '업무 메신저 알림?', optionA: '퇴근 후에도 확인 👀', optionB: '퇴근하면 안 봐 📵', score: { A: 2, B: 0 } },
  { id: 7, text: '점심시간에?', optionA: '팀원들과 같이 🍽️', optionB: '혼밥하며 쉬기 🎧', score: { A: 2, B: 1 } },
  { id: 8, text: '승진보다 중요한 건?', optionA: '안정적인 고용 🏢', optionB: '워라밸과 행복 🌴', score: { A: 2, B: 0 } },
  { id: 9, text: '이직 생각은?', optionA: '여러 번 해봤지... 💭', optionB: '항상 기회 보는 중 🔍', score: { A: 1, B: 0 } },
  { id: 10, text: '월요일 아침 기분?', optionA: '그래도 가야지 뭐 😐', optionB: '출근 자체가 고통 😱', score: { A: 2, B: 0 } }
]

const survivalTypes = {
  master: { icon: '🏆', title: '회사 생존 마스터', score: '90-100%', description: '회사 밥 자체! 어디서든 살아남는 적응의 달인. CEO 후보?' },
  pro: { icon: '💼', title: '프로 직장인', score: '70-89%', description: '선 넘지 않으면서도 할 건 하는 스마트한 직장인' },
  normal: { icon: '🙂', title: '그냥저냥 버티는 중', score: '50-69%', description: '월급 받으러 출근 중... 그래도 나쁘지 않아요' },
  suffering: { icon: '😮‍💨', title: '퇴사 고민 중', score: '30-49%', description: '회사에 영혼을 팔순 없어! 새로운 시작을 고민 중' },
  dying: { icon: '💀', title: '정신적 사직서 제출 완료', score: '0-29%', description: '몸만 회사에... 새 출발을 진지하게 고려해보세요' }
}

export default function OfficeSurvivalTest() {
  const [page, setPage] = useState('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [result, setResult] = useState(null)
  const { count } = useParticipants(CONTENT_ID)
  const { toast, showToast } = useToast()

  const handleStart = () => {
    setPage('quiz')
    setCurrentQ(0)
    setScore(0)
  }

  const handleAnswer = (choice) => {
    const q = questions[currentQ]
    const newScore = score + q.score[choice]
    setScore(newScore)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setPage('loading')
      setTimeout(async () => {
        const percent = Math.round((newScore / 20) * 100)
        let type
        if (percent >= 90) type = survivalTypes.master
        else if (percent >= 70) type = survivalTypes.pro
        else if (percent >= 50) type = survivalTypes.normal
        else if (percent >= 30) type = survivalTypes.suffering
        else type = survivalTypes.dying
        
        setResult({ ...type, percent })
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
      <div className="test-page office-theme">
        <div className="container">
          <Link to="/" className="back-btn">← 홈으로</Link>
          <div className="landing-content">
            <div className="title-badge">심리테스트</div>
            <h1 className="main-title">🏢 직장인 생존<br/>테스트</h1>
            <p className="subtitle">당신의 회사 생존력 점수는?</p>
            <div className="animal-preview">
              <span>🏆</span><span>💼</span><span>😮‍💨</span><span>💀</span>
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
      <div className="test-page office-theme">
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
      <div className="test-page office-theme">
        <div className="container loading-content">
          <div className="loading-spinner">💼</div>
          <p className="loading-text">생존력 측정 중...</p>
        </div>
      </div>
    )
  }

  if (page === 'result' && result) {
    return (
      <div className="test-page office-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">당신의 직장 생존력</div>
            <div className="result-icon">{result.icon}</div>
            <h1 className="result-title">{result.title}</h1>
            <p className="result-percentage">생존력 점수: {result.percent}%</p>
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
