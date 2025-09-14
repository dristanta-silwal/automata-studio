function epsilon(x) { return x === 'ε' }

export function simPDA(spec, input) {
    if (!spec.start) return { accepted: false, ids: [] }
    const bottom = spec.stackBottom || 'Z'
    let state = spec.start
    let unread = input
    let stack = [bottom]

    const ids = [{ state, unread, stack: [...stack] }]
    const MAX_STEPS = 2000
    for (let step = 0; step < MAX_STEPS; step++) {
        const top = stack[stack.length - 1] || bottom
        let candidates = spec.transitions.filter(t =>
            t.from === state &&
            (epsilon(t.read) ? true : (unread[0] === t.read)) &&
            (epsilon(t.pop) ? true : (top === t.pop))
        )
        const hasReading = candidates.some(t => !epsilon(t.read))
        if (hasReading) candidates = candidates.filter(t => !epsilon(t.read))

        if (candidates.length === 0) break
        const t = candidates[0]
        if (!epsilon(t.read)) unread = unread.slice(1)
        if (!epsilon(t.pop)) {
            if (stack[stack.length - 1] !== t.pop) break
            stack = stack.slice(0, -1)
        }
        if (!epsilon(t.push)) {
            for (let k = 0; k < t.push.length; k++) {
                const sym = t.push[k]
                if (sym && sym !== 'ε') stack.push(sym)
            }
        }

        state = t.to
        ids.push({ state, unread, stack: [...stack] })
        if (unread.length === 0 && spec.finals.includes(state)) {
            return { accepted: true, ids }
        }
    }

    return { accepted: false, ids }
}