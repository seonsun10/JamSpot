// ==================== 환경 설정 ====================
const ENV = 'production' // 'local' 또는 'production'

export const CONFIG = {
    local: {
        useCountAPI: false,
        apiNamespace: 'jamspot-dev',
        debug: true
    },
    production: {
        useCountAPI: true,
        apiNamespace: 'jamspot',
        debug: false
    }
}

export const CURRENT_CONFIG = CONFIG[ENV]

export function debugLog(...args) {
    if (CURRENT_CONFIG.debug) {
        console.log('[DEBUG]', ...args)
    }
}
