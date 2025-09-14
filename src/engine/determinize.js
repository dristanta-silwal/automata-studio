import { epsilonClosure } from './nfa'

function uniq(arr) { return Array.from(new Set(arr)) }
function setKey(s) { return [...s].sort().join('|') || '∅' }

export function determinize(nfa) {
    if (nfa.type !== 'NFA') throw new Error('determinize expects an NFA')
    if (!nfa.start) throw new Error('NFA must have a start state')

    const alpha = nfa.alphabet.filter(a => a !== 'ε')
    const startSet = epsilonClosure(nfa.transitions, new Set([nfa.start]))

    const queue = [startSet]
    const seen = new Map()
    const steps = []
    const setToName = new Map()
    const dfaStates = []
    const dfaTrans = []

    const nameOf = (S) => {
        const key = setKey(S)
        if (!setToName.has(key)) {
            const name = `{${[...S].sort().join(',')}}`
            setToName.set(key, name)
            dfaStates.push(name)
        }
        return setToName.get(key)
    }

    seen.set(setKey(startSet), startSet); nameOf(startSet)

    while (queue.length) {
        const S = queue.shift()
        for (const a of alpha) {
            const moved = new Set()
            for (const t of nfa.transitions) if (t.symbol === a && S.has(t.from)) moved.add(t.to)
            const T = epsilonClosure(nfa.transitions, moved)
            steps.push({ fromSet: new Set(S), symbol: a, toSet: new Set(T) })
            const keyT = setKey(T)
            if (!seen.has(keyT)) { seen.set(keyT, T); queue.push(T); nameOf(T) }
            dfaTrans.push({ from: nameOf(S), to: nameOf(T), symbol: a })
        }
    }

    const dfaFinals = []
    for (const [, S] of seen) if ([...S].some(s => nfa.finals.includes(s))) dfaFinals.push(nameOf(S))

    const dfa = {
        type: 'DFA',
        alphabet: alpha,
        states: uniq(dfaStates),
        start: nameOf(startSet),
        finals: uniq(dfaFinals),
        transitions: dfaTrans,
    }

    return { dfa, steps, setToName }
}