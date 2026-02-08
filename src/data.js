// ==================== 콘텐츠 데이터 ====================
export const CONTENTS = [
    {
        id: 'joseon-test',
        category: 'test',
        categoryLabel: '심리테스트',
        title: '조선시대 직업 테스트',
        description: '나는 전생에 왕일까 노비일까? 당신의 조선시대 신분을 알아보세요!',
        emoji: '👑',
        path: '/test/joseon',
        gradient: 'linear-gradient(135deg, #8B4513, #D4A574)'
    },
    {
        id: 'balance-mz',
        category: 'balance',
        categoryLabel: '밸런스게임',
        title: 'MZ 밸런스게임',
        description: '나는 M세대? Z세대? 10가지 질문으로 알아보는 세대 테스트!',
        emoji: '⚖️',
        path: '/game/balance',
        gradient: 'linear-gradient(135deg, #3498DB, #9B59B6)'
    },
    {
        id: 'random-lunch',
        category: 'random',
        categoryLabel: '랜덤추천',
        title: '점심 뭐먹지?',
        description: '매일 고민되는 점심 메뉴! 룰렛 돌려서 정하자!',
        emoji: '🍽️',
        path: '/random/lunch',
        gradient: 'linear-gradient(135deg, #27AE60, #2ECC71)'
    },
    {
        id: 'mbti-animal',
        category: 'test',
        categoryLabel: '심리테스트',
        title: 'MBTI 동물 테스트',
        description: '당신의 MBTI를 동물로 표현하면?',
        emoji: '🦊',
        path: '/test/mbti-animal',
        gradient: 'linear-gradient(135deg, #FF6B35, #F7C59F)'
    }
]

export const CATEGORIES = {
    all: { label: '전체', emoji: '🎯' },
    test: { label: '테스트', emoji: '🧠' },
    balance: { label: '밸런스', emoji: '⚖️' },
    random: { label: '랜덤', emoji: '🎲' }
}

export function getContentsByCategory(category) {
    if (category === 'all') return CONTENTS
    return CONTENTS.filter(c => c.category === category)
}
