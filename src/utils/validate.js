export function validate(spec) {
    if (!spec) return ['No spec loaded']

    const issues = []
    const type = spec.type || 'DFA'
    const states = new Set(spec.states || [])
    const alphabet = new Set(spec.alphabet || [])

    if (!spec.start) issues.push('No start state')
    if (!spec.finals || spec.finals.length === 0) issues.push('No accepting states')

    const transitions = spec.transitions || []
    for (const t of transitions) {
        if (!states.has(t.from) || !states.has(t.to)) {
            issues.push(`Transition uses unknown state: ${t.from}→${t.to}`)
        }
        if (type === 'DFA' || type === 'NFA') {
            const sym = t.symbol
            if (sym !== 'ε' && sym !== undefined && sym !== null && sym !== '' && !alphabet.has(sym)) {
                issues.push(`Symbol "${sym}" not in alphabet`)
            }
            if (type === 'DFA' && sym === 'ε') {
                issues.push('DFA cannot use ε-transitions')
            }
        }
    }

    if (type === 'DFA') {
        const seen = new Map()
        for (const t of transitions) {
            const k = `${t.from}|${t.symbol}`
            if (seen.has(k)) {
                issues.push(`Non-deterministic: multiple edges from ${t.from} on ${t.symbol}`)
            } else {
                seen.set(k, true)
            }
        }
    }

    if (type === 'DFA' || type === 'NFA') {
        const adj = new Map()
        for (const s of states) adj.set(s, [])
        for (const t of transitions) {
            if (states.has(t.from) && states.has(t.to)) {
                adj.get(t.from).push(t.to)
            }
        }
        const start = spec.start
        if (start && states.has(start)) {
            const seen = new Set([start])
            const stack = [start]
            while (stack.length) {
                const u = stack.pop()
                for (const v of adj.get(u) || []) {
                    if (!seen.has(v)) { seen.add(v); stack.push(v) }
                }
            }
            for (const s of states) {
                if (!seen.has(s)) issues.push(`Unreachable: ${s}`)
            }
        }
        const finals = new Set(spec.finals || [])
        if (finals.size) {
            const radj = new Map()
            for (const s of states) radj.set(s, [])
            for (const t of transitions) {
                if (states.has(t.from) && states.has(t.to)) {
                    radj.get(t.to).push(t.from)
                }
            }
            const canReachFinal = new Set()
            const stack = [...finals]
            while (stack.length) {
                const u = stack.pop()
                if (canReachFinal.has(u)) continue
                canReachFinal.add(u)
                for (const v of radj.get(u) || []) {
                    if (!canReachFinal.has(v)) stack.push(v)
                }
            }
            for (const s of states) {
                if (!canReachFinal.has(s)) issues.push(`Dead state: ${s}`)
            }
        }
    }

    return Array.from(new Set(issues))
}