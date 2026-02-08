// ==================== 콘텐츠 데이터 ====================
export const CONTENTS = [
    // 심리테스트
    {
        id: 'joseon-test',
        category: 'test',
        categoryLabel: '심리테스트',
        title: '조선시대 직업 테스트',
        description: '나는 전생에 왕일까 노비일까?',
        emoji: '👑',
        path: '/test/joseon',
        gradient: 'linear-gradient(135deg, #8B4513, #D4A574)'
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
    },
    {
        id: 'country-past',
        category: 'test',
        categoryLabel: '심리테스트',
        title: '전생 국적 테스트',
        description: '당신의 전생은 어느 나라 사람?',
        emoji: '🌍',
        path: '/test/country',
        gradient: 'linear-gradient(135deg, #0077B6, #90E0EF)'
    },
    {
        id: 'love-type',
        category: 'test',
        categoryLabel: '심리테스트',
        title: '연애 유형 테스트',
        description: '나는 어떤 연애 스타일?',
        emoji: '💕',
        path: '/test/love',
        gradient: 'linear-gradient(135deg, #FF6B6B, #FFC0CB)'
    },
    {
        id: 'money-mind',
        category: 'test',
        categoryLabel: '심리테스트',
        title: '부자 마인드 테스트',
        description: '당신의 부자 될 확률은?',
        emoji: '💰',
        path: '/test/money',
        gradient: 'linear-gradient(135deg, #FFD700, #FFA500)'
    },
    {
        id: 'friend-type',
        category: 'test',
        categoryLabel: '심리테스트',
        title: '찐친 유형 테스트',
        description: '친구들 사이에서 나의 역할은?',
        emoji: '🤝',
        path: '/test/friend',
        gradient: 'linear-gradient(135deg, #9B59B6, #E74C3C)'
    },
    {
        id: 'office-survival',
        category: 'test',
        categoryLabel: '심리테스트',
        title: '직장인 생존 테스트',
        description: '당신의 회사 생존력 점수는?',
        emoji: '🏢',
        path: '/test/office',
        gradient: 'linear-gradient(135deg, #34495E, #7F8C8D)'
    },

    // 밸런스게임
    {
        id: 'balance-mz',
        category: 'balance',
        categoryLabel: '밸런스게임',
        title: 'MZ 밸런스게임',
        description: '나는 M세대? Z세대?',
        emoji: '⚖️',
        path: '/game/balance',
        gradient: 'linear-gradient(135deg, #3498DB, #9B59B6)'
    },
    {
        id: 'ideal-type-balance',
        category: 'balance',
        categoryLabel: '밸런스게임',
        title: '이상형 밸런스',
        description: '나의 이상형 조건을 확인해보자!',
        emoji: '💘',
        path: '/game/ideal',
        gradient: 'linear-gradient(135deg, #E91E63, #FF5722)'
    },
    {
        id: 'food-balance',
        category: 'balance',
        categoryLabel: '밸런스게임',
        title: '음식 밸런스',
        description: '치킨 vs 피자, 짜장 vs 짬뽕!',
        emoji: '🍕',
        path: '/game/food',
        gradient: 'linear-gradient(135deg, #FF9800, #F44336)'
    },
    {
        id: 'life-balance',
        category: 'balance',
        categoryLabel: '밸런스게임',
        title: '인생 밸런스',
        description: '극한의 선택! 당신의 가치관은?',
        emoji: '⚖️',
        path: '/game/life',
        gradient: 'linear-gradient(135deg, #673AB7, #3F51B5)'
    },

    // 랜덤추천
    {
        id: 'random-lunch',
        category: 'random',
        categoryLabel: '랜덤추천',
        title: '점심 뭐먹지?',
        description: '매일 고민되는 점심 메뉴!',
        emoji: '🍽️',
        path: '/random/lunch',
        gradient: 'linear-gradient(135deg, #27AE60, #2ECC71)'
    },
    {
        id: 'random-dinner',
        category: 'random',
        categoryLabel: '랜덤추천',
        title: '저녁 뭐먹지?',
        description: '오늘 저녁은 뭘로 할까?',
        emoji: '🌙',
        path: '/random/dinner',
        gradient: 'linear-gradient(135deg, #2C3E50, #4CA1AF)'
    },
    {
        id: 'daily-fortune',
        category: 'random',
        categoryLabel: '랜덤추천',
        title: '오늘의 운세',
        description: '오늘 하루 운세를 확인해보세요!',
        emoji: '🔮',
        path: '/random/fortune',
        gradient: 'linear-gradient(135deg, #8E44AD, #9B59B6)'
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
