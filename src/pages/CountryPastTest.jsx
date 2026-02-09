import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
import './TestPage.css'

const CONTENT_ID = 'country-past'

const questions = [
  { id: 1, text: '주말 아침, 가장 하고 싶은 것은?', optionA: '늦잠 자기 😴', optionB: '일찍 일어나 활동하기 🌅', country: { A: ['JP', 'KR'], B: ['US', 'UK'] } },
  { id: 2, text: '음식을 먹을 때 선호하는 스타일은?', optionA: '여러 반찬을 조금씩 🍱', optionB: '한 가지를 든든하게 🍔', country: { A: ['JP', 'KR', 'CN'], B: ['US', 'DE'] } },
  { id: 3, text: '대화할 때 나는?', optionA: '돌려서 완곡하게 表 🎭', optionB: '직접적으로 솔직하게 💬', country: { A: ['JP', 'KR'], B: ['US', 'DE', 'UK'] } },
  { id: 4, text: '집을 꾸밀 때 선호하는 스타일은?', optionA: '미니멀, 심플 🪴', optionB: '화려하고 다채롭게 🎨', country: { A: ['JP', 'KR'], B: ['IT', 'FR', 'ES'] } },
  { id: 5, text: '시간 약속에 대해?', optionA: '5분 전 도착이 기본 ⏰', optionB: '조금 늦어도 괜찮아 😎', country: { A: ['JP', 'DE', 'KR'], B: ['IT', 'ES', 'BR'] } },
  { id: 6, text: '감정 표현 스타일은?', optionA: '속으로 삭히는 편 🤐', optionB: '바로바로 표현 😆', country: { A: ['JP', 'KR', 'UK'], B: ['IT', 'ES', 'US'] } },
  { id: 7, text: '여행 스타일은?', optionA: '계획대로 움직이기 📋', optionB: '즉흥적으로 돌아다니기 🎒', country: { A: ['JP', 'DE'], B: ['FR', 'IT', 'ES'] } },
  { id: 8, text: '좋아하는 날씨는?', optionA: '사계절이 뚜렷한 온대 🌸', optionB: '연중 따뜻한 열대 🌴', country: { A: ['JP', 'KR', 'UK'], B: ['BR', 'ES', 'IT'] } },
  { id: 9, text: '사회생활에서 중요한 것은?', optionA: '예의와 격식 🎩', optionB: '자유와 개성 🌈', country: { A: ['JP', 'KR', 'UK'], B: ['US', 'FR'] } },
  { id: 10, text: '이상적인 주거 환경은?', optionA: '도시의 편리함 🏙️', optionB: '자연 속 여유 🏡', country: { A: ['JP', 'KR'], B: ['FR', 'IT', 'NZ'] } }
]

const countryResults = {
  JP: { 
    name: '일본', 
    emoji: '🇯🇵', 
    description: '섬세하고 질서를 중시하는 당신! 정돈된 공간과 조용한 분위기를 사랑하는 일본인이셨네요.',
    features: ['타인을 배려하는 예의 바른 태도', '작은 디테일도 놓치지 않는 섬세함', '평화와 조화를 중시하는 평화주의자'],
    advice: '가끔은 자신의 속마음을 시원하게 털어놓아도 괜찮아요!'
  },
  KR: { 
    name: '한국', 
    emoji: '🇰🇷', 
    description: '정이 넘치고 빨리빨리 문화에 익숙한 당신! 열정적인 한국인이셨습니다.',
    features: ['끈끈한 동료애와 정이 많은 성격', '목표를 향해 거침없이 달리는 열정', '빠른 적응력과 위기 극복 능력'],
    advice: '조금 천천히 가도 괜찮아요. 가끔은 주변 풍경을 즐겨보세요.'
  },
  US: { 
    name: '미국', 
    emoji: '🇺🇸', 
    description: '자유롭고 도전적인 영혼! 새로운 것을 두려워하지 않는 아메리칸 스피릿!',
    features: ['개성과 자유를 존중하는 태도', '자신감 넘치는 자기표현', '새로운 기회를 찾는 도전 정신'],
    advice: '자유로움 속에 때로는 질서가 더 큰 자유를 가져다주기도 합니다.'
  },
  UK: { 
    name: '영국', 
    emoji: '🇬🇧', 
    description: '우아하고 예의 바른 신사/숙녀! 전통을 사랑하는 영국인이셨어요.',
    features: ['전통과 격식을 소중히 여김', '차분하고 이성적인 대화 스타일', '드라이한 유머를 즐기는 지적인 태도'],
    advice: '격식도 좋지만 가끔은 격의 없이 어울리는 즐거움도 느껴보세요.'
  },
  FR: { 
    name: '프랑스', 
    emoji: '🇫🇷', 
    description: '낭만을 사랑하는 예술가 영혼! 삶의 여유를 아는 프랑스인이셨네요.',
    features: ['삶을 예술처럼 즐기는 낭만주의', '토론을 즐기고 주관이 뚜렷함', '자유로운 상상력과 창의성'],
    advice: '현실적인 계획도 한 스푼 더한다면 꿈이 더 빨리 이루어질 거예요.'
  },
  IT: { 
    name: '이탈리아', 
    emoji: '🇮🇹', 
    description: '열정과 감성의 아이콘! 맛있는 음식과 예술을 사랑하는 이탈리아인!',
    features: ['풍부한 감정과 솔직한 표현력', '가족과 친구를 아끼는 뜨거운 마음', '아름다움을 알아보는 뛰어난 감각'],
    advice: '넘치는 감정만큼 이성적인 판단이 필요한 순간도 잊지 마세요.'
  },
  DE: { 
    name: '독일', 
    emoji: '🇩🇪', 
    description: '체계적이고 논리적인 천재! 장인 정신이 깃든 독일인이셨습니다.',
    features: ['철저한 시간 엄수와 원칙주의', '논리적이고 객관적인 문제 해결', '한 분야를 깊게 파고드는 전문성'],
    advice: '완벽함도 좋지만 조금은 허당미 있는 모습이 매력적일 때가 있어요.'
  },
  ES: { 
    name: '스페인', 
    emoji: '🇪🇸', 
    description: '열정적이고 파티를 사랑하는 당신! 시에스타를 즐기던 스페인인!',
    features: ['긍정적이고 즐거움을 추구하는 성격', '낯선 사람과도 금방 친해지는 친화력', '현재의 행복을 가장 소중히 함'],
    advice: '오늘의 즐거움만큼 내일의 준비도 조금만 더 챙겨보세요.'
  },
  BR: { 
    name: '브라질', 
    emoji: '🇧🇷', 
    description: '삼바 리듬이 흐르는 축제의 민족! 밝고 긍정적인 브라질인!',
    features: ['낙천적이고 에너지가 넘침', '어려운 상황도 웃으며 넘기는 회복력', '축제와 함께하는 정열적인 삶'],
    advice: '당신의 밝은 미소는 가장 큰 무기입니다. 어떤 순간에도 잃지 마세요!'
  },
  CN: { 
    name: '중국', 
    emoji: '🇨🇳', 
    description: '유구한 역사의 지혜! 가족을 중시하는 중국인이셨습니다.',
    features: ['오랜 전통과 지혜를 존중함', '인내심이 강하고 대범한 성격', '가족과 공동체의 안녕을 우선시함'],
    advice: '큰 물줄기가 바다로 가듯, 서두르지 말고 천천히 목표를 향해 가세요.'
  },
  NZ: { 
    name: '뉴질랜드', 
    emoji: '🇳🇿', 
    description: '자연을 사랑하는 평화로운 영혼! 키위 라이프를 즐기던 뉴질랜드인!',
    features: ['자연과 동물을 사랑하는 마음', '여유 있고 느긋한 삶의 방식', '모두와 조화롭게 어울리는 포용력'],
    advice: '도심의 소음 속에서도 당신만의 마음의 숲을 가꾸는 시간을 가지세요.'
  }
}

export default function CountryPastTest() {
  const [page, setPage] = useState('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [countryScores, setCountryScores] = useState({})
  const [result, setResult] = useState(null)
  const { count } = useParticipants(CONTENT_ID)
  const { toast, showToast } = useToast()

  const handleStart = () => {
    setPage('quiz')
    setCurrentQ(0)
    setCountryScores({})
  }

  const handleAnswer = (choice) => {
    const q = questions[currentQ]
    const countries = q.country[choice]
    const newScores = { ...countryScores }
    countries.forEach(c => { newScores[c] = (newScores[c] || 0) + 1 })
    setCountryScores(newScores)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setPage('loading')
      setTimeout(async () => {
        const topCountry = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0]
        setResult(countryResults[topCountry])
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
      <div className="test-page country-theme">
        <div className="container">
          <Link to="/" className="back-btn">← 홈으로</Link>
          <div className="landing-content">
            <div className="title-badge">심리테스트</div>
            <h1 className="main-title">🌍 전생 국적<br/>테스트</h1>
            <p className="subtitle">당신의 전생은 어느 나라 사람?</p>
            <div className="animal-preview">
              <span>🇯🇵</span><span>🇺🇸</span><span>🇫🇷</span><span>🇮🇹</span>
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
      <div className="test-page country-theme">
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
      <div className="test-page country-theme">
        <div className="container loading-content">
          <div className="loading-spinner">🌏</div>
          <p className="loading-text">전생의 기억을 되찾는 중...</p>
        </div>
      </div>
    )
  }

  if (page === 'result' && result) {
    return (
      <div className="test-page country-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">당신의 전생 국적은?</div>
            <div className="result-icon">{result.emoji}</div>
            <h1 className="result-title">{result.name}</h1>
            <p className="result-description">{result.description}</p>

            <div className="result-details">
              <div className="detail-card">
                <h3 className="detail-title">🌍 주요 특징</h3>
                <ul className="feature-list">
                  {(result.features || []).map((feature, index) => (
                    <li key={index} className="feature-item">{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="advice-box">
                🗺️ <strong>가이드의 조언:</strong> {result.advice || '당신의 개성 넘치는 삶을 응원합니다!'}
              </div>
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
