import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
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
  king: { 
    icon: '👑', 
    title: '임금', 
    description: '리더십, 재력, 사교성을 모두 갖춘 당신! 전생에 분명 용포를 입고 계셨을 겁니다.',
    features: ['압도적인 카리스마와 결단력', '사람들의 마음을 움직이는 천성적 리더', '백성을 사랑하는 따뜻한 성품'],
    advice: '결정이 서면 거침없이 나아가세요. 당신의 직관은 틀리지 않습니다!'
  },
  prime: { 
    icon: '🎓', 
    title: '영의정', 
    description: '실세 중의 실세! 겉으로는 조용하지만, 뒤에서 모든 일을 조율하는 프로 정치인입니다.',
    features: ['탁월한 전략과 위기 관리 능력', '냉철한 판단력과 이성적인 사고', '조직 내 신뢰를 받는 핵심 인물'],
    advice: '때로는 이성보다 감성에 귀 기울여보세요. 주변이 더 편안해질 거예요.'
  },
  merchant: { 
    icon: '💰', 
    title: '대상', 
    description: '돈이 최고! 조선 팔도를 누비며 부를 쌓는 큰 상인이셨네요.',
    features: ['번뜩이는 아이디어와 경제 관념', '기회를 놓치지 않는 빠른 실행력', '폭넓은 인맥 관리의 달인'],
    advice: '성공은 나눌수록 커집니다. 주변 동료들에게 따뜻한 응원을 건네보세요.'
  },
  warrior: { 
    icon: '⚔️', 
    title: '무관', 
    description: '정의로운 액션파! 불의를 보면 참지 못하는 뜨거운 피가 흐릅니다.',
    features: ['강인한 체력과 불굴의 의지', '단순명쾌하고 솔직한 성격', '약한 사람을 돕는 정의로운 마음'],
    advice: '가끔은 앞만 보고 달리기보다 멈춰서서 주변 풍경을 즐겨보세요.'
  },
  entertainer: { 
    icon: '🎭', 
    title: '광대', 
    description: '조선의 인플루언서! 사람들을 웃기고 즐겁게 하는 재주가 타고났습니다.',
    features: ['독보적인 끼와 예술적 감각', '지루함을 참지 못하는 자유로운 영혼', '어디서나 환영받는 분위기 메이커'],
    advice: '주변을 즐겁게 하는 당신은 이미 최고입니다. 당신의 행복도 챙기는 것 잊지 마세요!'
  },
  innkeeper: { 
    icon: '🍶', 
    title: '주막 이모', 
    description: '만남의 광장, 정보의 허브! 막걸리 한 사발에 동네 소식부터 궁궐 뒷얘기까지!',
    features: ['친근함으로 다가가는 친화력', '남의 고민을 잘 들어주는 공감 능력', '세상 돌아가는 이치에 밝은 정보력'],
    advice: '가끔은 남의 고민보다 당신의 마음속 이야기에 귀 기울여보세요.'
  },
  scholar: { 
    icon: '📚', 
    title: '선비', 
    description: '청빈낙도! 돈, 권력, 명예보다 지식과 가치를 추구하는 고고한 영혼입니다.',
    features: ['깊이 있는 사고와 철학적 세계관', '원칙을 지키는 올곧은 성격', '조용하지만 강인한 내면의 소유자'],
    advice: '책상 앞을 떠나 세상 밖의 즐거움도 가끔은 만끽해보세요!'
  },
  servant: { 
    icon: '🥲', 
    title: '노비', 
    description: '인생 하드모드... 하지만 괜찮아요! 전생에 고생한 만큼 현생에서 대박 터질 운명입니다.',
    features: ['어떤 상황에서도 살아남는 생활력', '성실함과 묵묵히 제 할 일을 하는 끈기', '남들에게 편안함을 주는 평범함의 미학'],
    advice: '당신은 생각보다 훨씬 대단한 사람입니다. 어깨를 펴고 자신감을 가지세요!'
  }
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
  const [page, setPage] = useState('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState({ P: 0, S: 0, W: 0 })
  const [resultType, setResultType] = useState(null)
  const { count } = useParticipants(CONTENT_ID)
  const { toast, showToast } = useToast()

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('✅ 링크가 복사되었습니다!')
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

            <div className="result-details">
              <div className="detail-card">
                <h3 className="detail-title">📜 주요 특징</h3>
                <ul className="feature-list">
                  {result.features.map((feature, index) => (
                    <li key={index} className="feature-item">{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="advice-box">
                💡 <strong>선비의 조언:</strong> {result.advice}
              </div>
            </div>
            <div className="result-actions">
              <button className="share-btn" onClick={handleCopyLink}>
                🔗 링크 복사
              </button>
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
