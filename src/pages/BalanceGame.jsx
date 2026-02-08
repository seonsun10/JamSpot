import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import './TestPage.css'

const CONTENT_ID = 'balance-mz'

const questions = [
  { text: '문자 vs 전화', optionA: '중요한 일은 전화로 📞', optionB: '전화는 너무 부담... 문자가 편해 💬' },
  { text: '출근 복장', optionA: '단정한 정장이 기본이지 👔', optionB: '자유롭게 입을래요 (후드티 최고) 🧥' },
  { text: '퇴근 후 시간', optionA: '회식 or 자기계발 📚', optionB: '워라밸! 취미생활 ✨' },
  { text: 'SNS 활용법', optionA: '카카오스토리, 페이스북 📱', optionB: '인스타, 틱톡이 대세지 🎵' },
  { text: '쇼핑 방법', optionA: '직접 가서 입어보고 사야지 🏬', optionB: '온라인이 편해~ 리뷰 보고 결정 💻' },
  { text: '뉴스 소비', optionA: '포털 뉴스, TV 뉴스 📺', optionB: '유튜브, 틱톡으로 소식 접해 📲' },
  { text: '연봉 협상', optionA: '오래 일하면 올라가겠지... 🙏', optionB: '당당하게 요구해야지! 💪' },
  { text: '여행 스타일', optionA: '패키지 투어가 편해 🚌', optionB: '자유여행으로 나만의 일정! ✈️' },
  { text: '음악 감상', optionA: '앨범 전곡 들어야 제맛 🎵', optionB: '플레이리스트로 취향 저격 🎧' },
  { text: '자기 표현', optionA: '조용히 실력으로 증명 🎯', optionB: '적극적으로 어필해야지! 🌟' }
]

const resultTexts = {
  superM: { icon: '👨‍💼', title: '완전 M세대', description: '당신은 진정한 밀레니엄 세대! 성실함과 책임감이 몸에 배어있고, 조직 생활에 능숙합니다.' },
  moreM: { icon: '🧑‍💼', title: 'M세대 성향', description: 'M세대에 가깝지만 Z세대 감성도 이해해요! 밸런스형 인재입니다.' },
  balanced: { icon: '🤝', title: 'MZ 하이브리드', description: 'M과 Z의 완벽한 조화! 상황에 따라 유연하게 대처하는 능력자.' },
  moreZ: { icon: '🧑‍💻', title: 'Z세대 성향', description: 'Z세대에 가깝지만 M세대의 장점도 갖췄어요! 트렌디하면서도 성실한 조합.' },
  superZ: { icon: '🦸', title: '완전 Z세대', description: '진정한 디지털 네이티브! 새로운 트렌드를 만들어가고, 자기 표현에 적극적이에요.' }
}

export default function BalanceGame() {
  const [page, setPage] = useState('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [mScore, setMScore] = useState(0)
  const [result, setResult] = useState(null)
  const { count } = useParticipants(CONTENT_ID)

  const handleStart = () => {
    setPage('game')
    setCurrentQ(0)
    setMScore(0)
  }

  const handleAnswer = async (choice) => {
    const newMScore = mScore + (choice === 'A' ? 1 : 0)
    setMScore(newMScore)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      const mPercent = Math.round((newMScore / questions.length) * 100)
      let resultType
      if (mPercent >= 80) resultType = resultTexts.superM
      else if (mPercent >= 60) resultType = resultTexts.moreM
      else if (mPercent >= 40) resultType = resultTexts.balanced
      else if (mPercent >= 20) resultType = resultTexts.moreZ
      else resultType = resultTexts.superZ

      setResult({ ...resultType, mPercent })
      await incrementParticipants(CONTENT_ID)
      setPage('result')
    }
  }

  if (page === 'landing') {
    return (
      <div className="test-page mz-theme">
        <div className="container">
          <Link to="/" className="back-btn">← 홈으로</Link>
          <div className="landing-content">
            <div className="title-badge">밸런스게임</div>
            <h1 className="main-title">
              나는 <span className="highlight-m">M</span>세대?<br/>
              <span className="highlight-z">Z</span>세대?
            </h1>
            <p className="subtitle">10가지 질문으로 알아보는 세대 테스트!</p>
            <div className="generation-icons">
              <span>👨‍💼</span>
              <span className="vs">VS</span>
              <span>🧑‍💻</span>
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

  if (page === 'result' && result) {
    return (
      <div className="test-page mz-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">당신의 세대는?</div>
            <div className="result-meter">
              <div className="meter-label"><span>M세대</span><span>Z세대</span></div>
              <div className="meter-bar"><div className="meter-indicator" style={{ left: `${result.mPercent}%` }}>▼</div></div>
            </div>
            <div className="result-icon">{result.icon}</div>
            <h1 className="result-title">{result.title}</h1>
            <p className="result-percentage">{result.mPercent >= 50 ? `M세대 성향 ${result.mPercent}%` : `Z세대 성향 ${100 - result.mPercent}%`}</p>
            <p className="result-description">{result.description}</p>
            <div className="result-actions">
              <button className="share-btn" onClick={() => navigator.clipboard.writeText(window.location.href)}>🔗 링크 복사</button>
              <button className="restart-btn" onClick={handleStart}>🔄 다시하기</button>
              <Link to="/" className="home-btn">🏠 다른 테스트</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
