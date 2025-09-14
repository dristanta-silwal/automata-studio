function epsilonClosure(trans, seed) {
    const res = new Set(seed)
    let changed = true
    while (changed) {
        changed = false
        for (const t of trans) {
            if (t.symbol === 'ε' && res.has(t.from) && !res.has(t.to)) {
                res.add(t.to); changed = true
            }
        }
    }
    return res
}

function move(trans, from, a) {
    const dest = new Set()
    for (const t of trans) if (t.symbol === a && from.has(t.from)) dest.add(t.to)
    return dest
}

export function simNFA(spec, input) {
    if (!spec.start) return { accepted: false, ids: [] }
    let cur = epsilonClosure(spec.transitions, new Set([spec.start]))
    const ids = [{ states: new Set(cur), unread: input }]
    let unread = input
    while (unread.length) {
        const a = unread[0]
        const moved = move(spec.transitions, cur, a)
        cur = epsilonClosure(spec.transitions, moved)
        unread = unread.slice(1)
        ids.push({ states: new Set(cur), unread })
    }
    const accepted = [...cur].some(s => spec.finals.includes(s))
    return { accepted, ids }
}

export { epsilonClosure }