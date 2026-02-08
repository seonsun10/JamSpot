import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParticipants, incrementParticipants, formatNumber } from '../hooks/useCountAPI'
import { Toast, useToast } from '../components/Toast'
import './TestPage.css'

const CONTENT_ID = 'mbti-animal'

// E/I, S/N, T/F, J/P 축 질문
const questions = [
  { id: 1, text: '주말에 에너지를 충전하는 방법은?', optionA: '친구들과 신나게 놀기! 🎉', optionB: '집에서 혼자 푹 쉬기 🏠', axis: 'EI', aScore: 'E', bScore: 'I' },
  { id: 2, text: '파티에서 나는?', optionA: '새로운 사람들과 대화하기 💬', optionB: '아는 사람들이랑만 있기 👥', axis: 'EI', aScore: 'E', bScore: 'I' },
  { id: 3, text: '대화할 때 나는?', optionA: '말하면서 생각 정리해! 🗣️', optionB: '충분히 생각하고 말해 🤔', axis: 'EI', aScore: 'E', bScore: 'I' },
  { id: 4, text: '정보를 받아들일 때?', optionA: '구체적인 사실과 세부사항 📋', optionB: '큰 그림과 가능성 🎨', axis: 'SN', aScore: 'S', bScore: 'N' },
  { id: 5, text: '새로운 것을 배울 때?', optionA: '경험하면서 배우기 💪', optionB: '이론부터 이해하기 📚', axis: 'SN', aScore: 'S', bScore: 'N' },
  { id: 6, text: '문제를 해결할 때?', optionA: '검증된 방법대로 ✅', optionB: '새로운 방법 시도 🚀', axis: 'SN', aScore: 'S', bScore: 'N' },
  { id: 7, text: '결정을 내릴 때?', optionA: '논리와 객관적 기준 🧠', optionB: '사람과 감정 고려 💕', axis: 'TF', aScore: 'T', bScore: 'F' },
  { id: 8, text: '친구가 고민 상담을 하면?', optionA: '해결책을 제시해줘 💡', optionB: '공감하고 들어줘 🤗', axis: 'TF', aScore: 'T', bScore: 'F' },
  { id: 9, text: '비판을 받으면?', optionA: '객관적으로 받아들여 🎯', optionB: '감정적으로 상처받아 😢', axis: 'TF', aScore: 'T', bScore: 'F' },
  { id: 10, text: '여행 계획은?', optionA: '미리 세세하게! 📅', optionB: '그때그때 자유롭게! 🎒', axis: 'JP', aScore: 'J', bScore: 'P' },
  { id: 11, text: '마감이 있는 일은?', optionA: '미리미리 끝내기 ⏰', optionB: '마감 직전에 몰아서 🔥', axis: 'JP', aScore: 'J', bScore: 'P' },
  { id: 12, text: '일상생활에서?', optionA: '규칙적인 패턴 좋아 📋', optionB: '융통성 있게 살아 🌊', axis: 'JP', aScore: 'J', bScore: 'P' }
]

// MBTI 유형별 동물
const mbtiAnimals = {
  INTJ: { animal: '올빼미', emoji: '🦉', trait: '전략가', description: '밤의 지혜로운 사냥꾼! 혼자서 완벽한 계획을 세우고, 조용히 목표를 달성해요.' },
  INTP: { animal: '고양이', emoji: '🐱', trait: '논리술사', description: '호기심 가득한 탐험가! 자유로운 영혼으로 세상을 관찰하고 분석해요.' },
  ENTJ: { animal: '사자', emoji: '🦁', trait: '통솔자', description: '정글의 왕! 강력한 카리스마로 무리를 이끌고 목표를 향해 돌진해요.' },
  ENTP: { animal: '앵무새', emoji: '🦜', trait: '변론가', description: '수다쟁이 아이디어 뱅크! 끊임없이 새로운 것을 탐구하고 토론을 즐겨요.' },
  INFJ: { animal: '늑대', emoji: '🐺', trait: '옹호자', description: '신비로운 수호자! 깊은 직관력으로 무리를 보호하고 이끌어요.' },
  INFP: { animal: '판다', emoji: '🐼', trait: '중재자', description: '평화를 사랑하는 몽상가! 순수한 마음으로 세상을 따뜻하게 만들어요.' },
  ENFJ: { animal: '돌고래', emoji: '🐬', trait: '선도자', description: '사교적인 리더! 뛰어난 소통 능력으로 모두를 하나로 만들어요.' },
  ENFP: { animal: '골든 리트리버', emoji: '🐕', trait: '활동가', description: '열정 가득한 친구! 긍정 에너지로 주변을 밝게 비춰요.' },
  ISTJ: { animal: '비버', emoji: '🦫', trait: '현실주의자', description: '성실한 일꾼! 꾸준히 노력해서 든든한 보금자리를 만들어요.' },
  ISFJ: { animal: '코끼리', emoji: '🐘', trait: '수호자', description: '다정한 보호자! 가족을 위해 헌신하고 모든 것을 기억해요.' },
  ESTJ: { animal: '독수리', emoji: '🦅', trait: '경영자', description: '책임감 강한 리더! 높은 곳에서 전체를 보고 결단력 있게 이끌어요.' },
  ESFJ: { animal: '벌', emoji: '🐝', trait: '집정관', description: '부지런한 조화의 수호자! 모두가 행복한 공동체를 만들어요.' },
  ISTP: { animal: '표범', emoji: '🐆', trait: '장인', description: '침착한 탐험가! 민첩하게 상황에 적응하고 문제를 해결해요.' },
  ISFP: { animal: '사슴', emoji: '🦌', trait: '모험가', description: '온화한 예술가! 아름다움을 추구하며 자유롭게 살아요.' },
  ESTP: { animal: '치타', emoji: '🐆', trait: '사업가', description: '스릴을 즐기는 모험가! 빠른 판단력으로 기회를 잡아요.' },
  ESFP: { animal: '수달', emoji: '🦦', trait: '연예인', description: '파티의 주인공! 장난기 넘치고 모두를 즐겁게 해요.' }
}

export default function MbtiAnimalTest() {
  const [page, setPage] = useState('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 })
  const [mbtiResult, setMbtiResult] = useState(null)
  const { count } = useParticipants(CONTENT_ID)
  const { toast, showToast } = useToast()

  const handleStart = () => {
    setPage('quiz')
    setCurrentQ(0)
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 })
  }

  const handleAnswer = (choice) => {
    const q = questions[currentQ]
    const newScores = { ...scores }
    const score = choice === 'A' ? q.aScore : q.bScore
    newScores[score] += 1
    setScores(newScores)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setPage('loading')
      setTimeout(async () => {
        // MBTI 계산
        const mbti = 
          (newScores.E >= newScores.I ? 'E' : 'I') +
          (newScores.S >= newScores.N ? 'S' : 'N') +
          (newScores.T >= newScores.F ? 'T' : 'F') +
          (newScores.J >= newScores.P ? 'J' : 'P')
        
        setMbtiResult(mbti)
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
      <div className="test-page animal-theme">
        <div className="container">
          <Link to="/" className="back-btn">← 홈으로</Link>
          <div className="landing-content">
            <div className="title-badge">MBTI 테스트</div>
            <h1 className="main-title">
              🦊 MBTI<br />동물 테스트
            </h1>
            <p className="subtitle">나를 닮은 동물은 무엇일까?</p>
            <div className="animal-preview">
              <span>🦁</span><span>🐼</span><span>🦉</span><span>🐬</span>
            </div>
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
      <div className="test-page animal-theme">
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
      <div className="test-page animal-theme">
        <div className="container loading-content">
          <div className="loading-spinner">🔮</div>
          <p className="loading-text">당신의 동물을 찾는 중...</p>
        </div>
      </div>
    )
  }

  if (page === 'result' && mbtiResult) {
    const result = mbtiAnimals[mbtiResult]
    return (
      <div className="test-page animal-theme">
        <div className="container">
          <div className="result-content">
            <div className="result-badge">당신의 MBTI 동물은?</div>
            <div className="result-icon">{result.emoji}</div>
            <h1 className="result-title">{result.animal}</h1>
            <p className="result-mbti">{mbtiResult} - {result.trait}</p>
            <p className="result-description">{result.description}</p>
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
