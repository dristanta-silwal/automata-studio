export function simDFA(spec, input) {
    if (!spec.start) return { accepted: false, ids: [] }
    let cur = spec.start
    const ids = [{ state: cur, unread: input }]
    let unread = input
    while (unread.length) {
        const a = unread[0]
        const t = spec.transitions.find(tr => tr.from === cur && tr.symbol === a)
        if (!t) return { accepted: false, ids: [...ids, { state: '∅', unread }] }
        cur = t.to
        unread = unread.slice(1)
        ids.push({ state: cur, unread })
    }
    return { accepted: spec.finals.includes(cur), ids }
}