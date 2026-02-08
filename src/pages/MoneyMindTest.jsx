import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
import './TestPage.css'

const CONTENT_ID = 'money-mind'

const questions = [
  { id: 1, text: '월급이 들어오면?', optionA: '먼저 저축하고 남은 돈 쓰기 🏦', optionB: '쓰고 남은 돈 저축하기 💳', score: { A: 2, B: 0 } },
  { id: 2, text: '세일하는 물건을 봤을 때?', optionA: '지금 필요 없으면 패스 ✋', optionB: '나중에 쓸 수도 있으니 구매 🛒', score: { A: 2, B: 0 } },
  { id: 3, text: '점심값이 올랐다!', optionA: '도시락 싸 가는 걸로 🍱', optionB: '먹고 싶은 거 먹어야지 🍔', score: { A: 2, B: 0 } },
  { id: 4, text: '친구가 사업 투자를 권유하면?', optionA: '리스크 분석부터 📊', optionB: '친구니까 믿고 투자 🤝', score: { A: 2, B: 0 } },
  { id: 5, text: '복권에 당첨된다면?', optionA: '부동산/주식에 투자 📈', optionB: '인생 한번 럭셔리~ ✨', score: { A: 2, B: 0 } },
  { id: 6, text: '가계부를?', optionA: '꼼꼼히 쓴다 📝', optionB: '귀찮아... 안 쓴다 😅', score: { A: 2, B: 0 } },
  { id: 7, text: '돈을 빌려달라고 하면?', optionA: '안 되는 이유 100가지 🚫', optionB: '친한 사이면 OK 💸', score: { A: 2, B: 0 } },
  { id: 8, text: '자기계발에 돈 쓰는 건?', optionA: '투자 가치 있으면 OK 📚', optionB: '경험이 중요하니까 💡', score: { A: 2, B: 1 } },
  { id: 9, text: '은퇴 준비는?', optionA: '이미 시작했다 🏖️', optionB: '아직 멀었어~ ⏰', score: { A: 2, B: 0 } },
  { id: 10, text: '돈에 대한 나의 철학?', optionA: '돈은 모아야 힘 💪', optionB: '쓰라고 있는 거지 🎉', score: { A: 2, B: 0 } }
]

const moneyTypes = {
  billionaire: { icon: '💎', title: '미래의 부자', score: '90-100%', description: '철저한 재테크 마인드! 이 속도면 노후는 걱정 없어요. 부자까지 초읽기!' },
  saver: { icon: '🏦', title: '알뜰 저축왕', score: '70-89%', description: '아끼고 모으는 재주가 있어요! 계획적인 소비로 자산을 불려가는 중!' },
  balanced: { icon: '⚖️', title: '균형잡힌 소비자', score: '50-69%', description: '쓸 땐 쓰고 모을 땐 모으는 밸런스형! 적당히 즐기면서 저축도 해요.' },
  enjoyer: { icon: '🎉', title: '현재를 즐기는 자', score: '30-49%', description: 'YOLO 마인드! 돈은 쓰라고 있는 것. 인생은 즐겨야죠~' },
  spender: { icon: '🛍️', title: '통장 털이범', score: '0-29%', description: '월급 루팡... 들어오자마자 사라지는 중. 저축 습관이 필요해요!' }
}

export default function MoneyMindTest() {
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
        if (percent >= 90) type = moneyTypes.billionaire
        else if (percent >= 70) type = moneyTypes.saver
        else if (percent >= 50) type = moneyTypes.balanced
        else if (percent >= 30) type = moneyTypes.enjoyer
        else type = moneyTypes.spender
        
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
      <div className="test-page money-theme">
        <div className="container">
          <Link to="/" className="back-btn">← 홈으로</Link>
          <div className="landing-content">
            <div className="title-badge">심리테스트</div>
            <h1 className="main-title">💰 부자 마인드<br/>테스트</h1>
            <p className="subtitle">당신의 부자 될 확률은?</p>
            <div className="animal-preview">
              <span>💎</span><span>🏦</span><span>📈</span><span>💸</span>
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
      <div className="test-page money-theme">
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
      <div className="test-page money-theme">
        <div className="container loading-content">
          <div className="loading-spinner">💰</div>
          <p className="loading-text">자산 마인드 분석 중...</p>
        </div>
      </div>
    )
  }

  if (page === 'result' && result) {
    return (
      <div className="test-page money-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">당신의 부자 마인드</div>
            <div className="result-icon">{result.icon}</div>
            <h1 className="result-title">{result.title}</h1>
            <p className="result-percentage">부자 마인드 점수: {result.percent}%</p>
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
