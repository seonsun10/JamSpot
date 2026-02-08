import { useState, useEffect, useCallback } from 'react'
import { CURRENT_CONFIG, debugLog } from '../config'

// API 엔드포인트 - Vercel 배포시 자동으로 /api/counter 사용
const API_BASE = '/api/counter'
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

// API 호출 함수
async function callCounterAPI(action, key) {
    try {
        const res = await fetch(`${API_BASE}?action=${action}&key=${key}`)
        if (res.ok) {
            const data = await res.json()
            return data.value
        }
        throw new Error('API call failed')
    } catch (error) {
        debugLog('API error:', error.message)
        throw error
    }
}

// 참여자 수 조회 훅
export function useParticipants(contentId) {
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)

    const fetchCount = useCallback(async () => {
        const key = `${CURRENT_CONFIG.apiNamespace}:${contentId}`

        if (CURRENT_CONFIG.useCountAPI) {
            try {
                const value = await callCounterAPI('get', key)
                debugLog(`API get: ${contentId} = ${value}`)
                setCount(value || 0)
            } catch (error) {
                // 폴백: localStorage
                const stats = getLocalStats()
                setCount(stats[contentId]?.participants || 0)
            }
        } else {
            const stats = getLocalStats()
            setCount(stats[contentId]?.participants || 0)
        }
        setLoading(false)
    }, [contentId])

    useEffect(() => {
        fetchCount()
    }, [fetchCount])

    return { count, loading, refetch: fetchCount }
}

// 총 참여자 수 조회 훅
export function useTotalParticipants() {
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTotal() {
            const key = `${CURRENT_CONFIG.apiNamespace}:total`

            if (CURRENT_CONFIG.useCountAPI) {
                try {
                    const value = await callCounterAPI('get', key)
                    setTotal(value || 0)
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
    // 항상 로컬에도 저장 (폴백용)
    incrementLocalParticipants(contentId)

    if (CURRENT_CONFIG.useCountAPI) {
        try {
            const key = `${CURRENT_CONFIG.apiNamespace}:${contentId}`
            const totalKey = `${CURRENT_CONFIG.apiNamespace}:total`

            // 개별 콘텐츠 증가
            await callCounterAPI('incr', key)
            // 총 참여자 수 증가
            await callCounterAPI('incr', totalKey)
            debugLog(`API incr: ${contentId}`)
        } catch (error) {
            console.warn('API increment failed:', error.message)
        }
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
