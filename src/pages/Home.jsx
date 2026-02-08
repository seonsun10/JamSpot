import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTENTS, CATEGORIES, getContentsByCategory } from '../data'
import { useTotalParticipants, useParticipants, formatNumber } from '../hooks/useCountAPI'
import './Home.css'

function ContentCard({ content }) {
  const { count } = useParticipants(content.id)
  
  if (content.comingSoon) {
    return (
      <div className="content-card coming-soon">
        <div className="card-thumbnail" style={{ background: content.gradient }}>
          <span className="card-emoji">{content.emoji}</span>
          <span className="coming-soon-badge">COMING SOON</span>
        </div>
        <div className="card-body">
          <span className="card-category">{content.categoryLabel}</span>
          <h3 className="card-title">{content.title}</h3>
          <p className="card-description">{content.description}</p>
        </div>
      </div>
    )
  }

  return (
    <Link to={content.path} className="content-card">
      <div className="card-thumbnail" style={{ background: content.gradient }}>
        <span className="card-emoji">{content.emoji}</span>
      </div>
      <div className="card-body">
        <span className="card-category">{content.categoryLabel}</span>
        <h3 className="card-title">{content.title}</h3>
        <p className="card-description">{content.description}</p>
        <div className="card-meta">
          <span className="participants">👥 {formatNumber(count)}명 참여</span>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const [category, setCategory] = useState('all')
  const { total } = useTotalParticipants()
  const contents = getContentsByCategory(category)

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">🎮</span>
            <span className="logo-text"><span>Jam</span>Spot</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">🎯 오늘 뭐하고 놀까?</h1>
          <p className="hero-subtitle">심리테스트, 밸런스게임, 랜덤 추천기까지!</p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">{CONTENTS.length}</div>
              <div className="stat-label">콘텐츠</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{formatNumber(total)}</div>
              <div className="stat-label">총 참여</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Category Tabs */}
          <div className="category-tabs">
            {Object.entries(CATEGORIES).map(([key, value]) => (
              <button
                key={key}
                className={`tab-btn ${category === key ? 'active' : ''}`}
                onClick={() => setCategory(key)}
              >
                {value.emoji} {value.label}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="card-grid">
            {contents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 JamSpot. 재미있게 놀고 가세요! 🎉</p>
      </footer>
    </div>
  )
}
