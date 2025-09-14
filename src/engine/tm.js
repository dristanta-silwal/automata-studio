const BLANK = '⊔'

export function simTM(spec, input) {
    if (!spec.start) return { accepted: false, ids: [] }
    const delta = new Map()
    for (const t of (spec.transitions || [])) {
        delta.set(key(t.from, t.read), t)
    }

    let tape = new Map()
    for (let i = 0; i < input.length; i++) tape.set(i, input[i])
    let head = 0
    let state = spec.start
    const ids = [{ state, head, tape: new Map(tape) }]

    const MAX_STEPS = spec.maxSteps || 2000
    for (let step = 0; step < MAX_STEPS; step++) {
        if (spec.finals.includes(state)) {
            return { accepted: true, ids }
        }

        const r = readTape(tape, head)
        const tr = delta.get(key(state, r))
        if (!tr) {
            return { accepted: spec.finals.includes(state), ids }
        }
        writeTape(tape, head, tr.write ?? r)
        head = tr.move === 'L' ? head - 1 : head + 1
        state = tr.to

        ids.push({ state, head, tape: new Map(tape) })
    }
    return { accepted: spec.finals.includes(state), ids }
}

function key(q, a) { return `${q}|${a}` }
function readTape(t, i) { return t.get(i) ?? BLANK }
function writeTape(t, i, s) {
    if (s === BLANK) {
        t.set(i, BLANK)
    } else {
        t.set(i, s)
    }
}