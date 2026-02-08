import { useState, useEffect } from 'react'
import { CURRENT_CONFIG, debugLog } from '../config'

const COUNT_API_BASE = 'https://api.countapi.xyz'
const STORAGE_KEY = 'jamspot_stats'

// localStorage 함수들
function getLocalStats() {
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : {}
    } catch (e) {
        return {}
    }
}

function saveLocalStats(stats) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
    } catch (e) {
        console.error('localStorage save error:', e)
    }
}

// 참여자 수 조회 훅
export function useParticipants(contentId) {
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCount() {
            if (CURRENT_CONFIG.useCountAPI) {
                try {
                    const res = await fetch(`${COUNT_API_BASE}/get/${CURRENT_CONFIG.apiNamespace}/${contentId}`)
                    const data = await res.json()
                    debugLog(`CountAPI get: ${contentId} = ${data.value}`)
                    setCount(data.value || 0)
                } catch (error) {
                    console.error('CountAPI error:', error)
                    const stats = getLocalStats()
                    setCount(stats[contentId]?.participants || 0)
                }
            } else {
                const stats = getLocalStats()
                setCount(stats[contentId]?.participants || 0)
            }
            setLoading(false)
        }
        fetchCount()
    }, [contentId])

    return { count, loading }
}

// 총 참여자 수 조회 훅
export function useTotalParticipants() {
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTotal() {
            if (CURRENT_CONFIG.useCountAPI) {
                try {
                    const res = await fetch(`${COUNT_API_BASE}/get/${CURRENT_CONFIG.apiNamespace}/total`)
                    const data = await res.json()
                    setTotal(data.value || 0)
                } catch (error) {
                    const stats = getLocalStats()
                    const sum = Object.values(stats).reduce((s, item) => s + (item.participants || 0), 0)
                    setTotal(sum)
                }
            } else {
                const stats = getLocalStats()
                const sum = Object.values(stats).reduce((s, item) => s + (item.participants || 0), 0)
                setTotal(sum)
            }
            setLoading(false)
        }
        fetchTotal()
    }, [])

    return { total, loading }
}

// 참여자 수 증가 함수
export async function incrementParticipants(contentId) {
    if (CURRENT_CONFIG.useCountAPI) {
        try {
            // 개별 콘텐츠 증가
            await fetch(`${COUNT_API_BASE}/hit/${CURRENT_CONFIG.apiNamespace}/${contentId}`)
            // 총 참여자 수 증가
            await fetch(`${COUNT_API_BASE}/hit/${CURRENT_CONFIG.apiNamespace}/total`)
            debugLog(`CountAPI hit: ${contentId}`)
        } catch (error) {
            console.error('CountAPI error:', error)
            incrementLocalParticipants(contentId)
        }
    } else {
        incrementLocalParticipants(contentId)
    }
}

function incrementLocalParticipants(contentId) {
    const stats = getLocalStats()
    if (!stats[contentId]) {
        stats[contentId] = { participants: 0 }
    }
    stats[contentId].participants += 1
    saveLocalStats(stats)
}

// 숫자 포맷
export function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '만'
    }
    return num.toLocaleString('ko-KR')
}
