import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
    // CORS 허용
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    const { action, key } = req.query

    try {
        if (action === 'get') {
            // 카운터 조회
            const value = await redis.get(key) || 0
            return res.status(200).json({ value: Number(value) })
        }

        if (action === 'incr') {
            // 카운터 증가
            const value = await redis.incr(key)
            return res.status(200).json({ value })
        }

        return res.status(400).json({ error: 'Invalid action. Use "get" or "incr"' })
    } catch (error) {
        console.error('Redis error:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
