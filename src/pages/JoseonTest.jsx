import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import './TestPage.css'

const CONTENT_ID = 'joseon-test'

const questions = [
  { id: 1, text: '아침에 눈을 떴을 때 첫 생각은?', optionA: '"5분만 더..." 💤', optionB: '"오늘 할 일 체크!" ✅', scoring: { axis: 'W', aScore: 0, bScore: 1 } },
  { id: 2, text: '친구들 사이에서 나의 역할은?', optionA: '분위기 메이커 🎉', optionB: '조용한 참모 🤫', scoring: { axis: 'S', aScore: 1, bScore: 0 } },
  { id: 3, text: '갑자기 큰돈이 생겼다!', optionA: '일단 플렉스! 💸', optionB: '적금부터 넣자 🏦', scoring: { axis: 'W', aScore: 0, bScore: 1 } },
  { id: 4, text: '회사에서 갈등이 생겼을 때', optionA: '직접 나서서 해결한다 💪', optionB: '시간이 해결해주겠지... ⏳', scoring: { axis: 'P', aScore: 1, bScore: 0 } },
  { id: 5, text: '여행 스타일은?', optionA: '철저한 계획파 📋', optionB: '즉흥 모험파 🎒', scoring: { axis: 'W', aScore: 1, bScore: 0 } },
  { id: 6, text: '스트레스 해소법은?', optionA: '혼자만의 시간 🧘', optionB: '사람들과 어울리기 🍻', scoring: { axis: 'S', aScore: 0, bScore: 1 } },
  { id: 7, text: '윗사람에게 부당한 지시를 받으면?', optionA: '일단 따른다 😶', optionB: '내 의견을 말한다 🗣️', scoring: { axis: 'P', aScore: 0, bScore: 1 } },
  { id: 8, text: '새로운 일을 시작할 때?', optionA: '충분히 공부하고 시작 📚', optionB: '일단 부딪혀본다 🚀', scoring: { axis: 'W', aScore: 1, bScore: 0 } },
  { id: 9, text: '팀 프로젝트에서 선호하는 역할?', optionA: '리더 / 발표자 🎤', optionB: '자료조사 / 서포터 📊', scoring: { axis: 'P', aScore: 1, bScore: 0 } },
  { id: 10, text: '인생에서 더 중요한 것은?', optionA: '안정과 평화 🏠', optionB: '성취와 도전 🏆', scoring: { axis: 'W', aScore: 1, bScore: 0 } },
  { id: 11, text: '남들이 나를 어떻게 보길 원하나?', optionA: '능력있는 사람 💼', optionB: '착하고 따뜻한 사람 💕', scoring: { axis: 'P', aScore: 1, bScore: 0 } },
  { id: 12, text: '만약 타임머신이 있다면?', optionA: '과거를 바꾸고 싶다 ⏪', optionB: '미래를 보고 싶다 ⏩', scoring: { axis: 'S', aScore: 0, bScore: 1 } }
]

const results = {
  king: { icon: '👑', title: '임금', description: '리더십, 재력, 사교성을 모두 갖춘 당신! 전생에 분명 용포를 입고 계셨을 겁니다.' },
  prime: { icon: '🎓', title: '영의정', description: '실세 중의 실세! 겉으로는 조용하지만, 뒤에서 모든 일을 조율하는 프로 정치인입니다.' },
  merchant: { icon: '💰', title: '대상', description: '돈이 최고! 조선 팔도를 누비며 부를 쌓는 큰 상인이셨네요.' },
  warrior: { icon: '⚔️', title: '무관', description: '정의로운 액션파! 불의를 보면 참지 못하는 뜨거운 피가 흐릅니다.' },
  entertainer: { icon: '🎭', title: '광대', description: '조선의 인플루언서! 사람들을 웃기고 즐겁게 하는 재주가 타고났습니다.' },
  innkeeper: { icon: '🍶', title: '주막 이모', description: '만남의 광장, 정보의 허브! 막걸리 한 사발에 동네 소식부터 궁궐 뒷얘기까지!' },
  scholar: { icon: '📚', title: '선비', description: '청빈낙도! 돈, 권력, 명예보다 지식과 가치를 추구하는 고고한 영혼입니다.' },
  servant: { icon: '🥲', title: '노비', description: '인생 하드모드... 하지만 괜찮아요! 전생에 고생한 만큼 현생에서 대박 터질 운명입니다.' }
}

function getResultType(scores) {
  const { P, S, W } = scores
  if (P >= 3 && W >= 3 && S >= 2) return 'king'
  if (P >= 3 && W >= 2 && S < 2) return 'prime'
  if (W >= 4 && P < 2) return 'merchant'
  if (P >= 3 && W < 2) return 'warrior'
  if (S >= 3 && P < 2) return 'entertainer'
  if (S >= 2 && W >= 2 && P < 2) return 'innkeeper'
  if (W < 2 && S < 2 && P < 2) return 'scholar'
  return 'servant'
}

export default function JoseonTest() {
  const [page, setPage] = useState('landing') // landing, quiz, loading, result
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState({ P: 0, S: 0, W: 0 })
  const [resultType, setResultType] = useState(null)
  const { count } = useParticipants(CONTENT_ID)

  const handleStart = () => {
    setPage('quiz')
    setCurrentQ(0)
    setScores({ P: 0, S: 0, W: 0 })
  }

  const handleAnswer = (choice) => {
    const q = questions[currentQ]
    const newScores = { ...scores }
    newScores[q.scoring.axis] += choice === 'A' ? q.scoring.aScore : q.scoring.bScore
    setScores(newScores)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setPage('loading')
      setTimeout(async () => {
        const type = getResultType(newScores)
        setResultType(type)
        await incrementParticipants(CONTENT_ID)
        setPage('result')
      }, 2500)
    }
  }

  if (page === 'landing') {
    return (
      <div className="test-page joseon-theme">
        <div className="container">
          <Link to="/" className="back-btn">← 홈으로</Link>
          <div className="landing-content">
            <div className="title-badge">심리테스트</div>
            <h1 className="main-title">
              👑 조선시대<br />직업 테스트
            </h1>
            <p className="subtitle">나는 전생에 왕일까 노비일까?</p>
            <button className="start-btn" onClick={handleStart}>
              시작하기 →
            </button>
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
      <div className="test-page joseon-theme">
        <div className="container">
          <div className="quiz-header">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
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
      <div className="test-page joseon-theme">
        <div className="container loading-content">
          <div className="loading-spinner">🏯</div>
          <p className="loading-text">조선시대로 돌아가는 중...</p>
        </div>
      </div>
    )
  }

  if (page === 'result' && resultType) {
    const result = results[resultType]
    return (
      <div className="test-page joseon-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">당신의 전생은?</div>
            <div className="result-icon">{result.icon}</div>
            <h1 className="result-title">{result.title}</h1>
            <p className="result-description">{result.description}</p>
            <div className="result-actions">
              <button className="share-btn" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                🔗 링크 복사
              </button>
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
