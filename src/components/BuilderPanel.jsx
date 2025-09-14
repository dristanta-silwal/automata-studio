import { useEffect, useState } from 'react'

export default function BuilderPanel({ spec, setSpec }) {
    const specSafe = {
        rejects: [],
        ...spec,
    }

    const [alphaInput, setAlphaInput] = useState(specSafe.alphabet.join(','))
    useEffect(() => {
        setAlphaInput(specSafe.alphabet.join(','))
    }, [specSafe.alphabet.join('|')])

    const normalizeToken = (tok) => {
        const t = tok.trim()
        if (!t) return null
        if (t === 'e' || t.toLowerCase() === 'epsilon') return 'ε'
        return t
    }

    const saveAlphabet = () => {
        const list = alphaInput.split(',').map(normalizeToken).filter(Boolean)
        const unique = Array.from(new Set(list))
        setSpec({ ...specSafe, alphabet: unique })
    }

    const addState = (id) => {
        if (!id || specSafe.states.includes(id)) return
        setSpec({ ...specSafe, states: [...specSafe.states, id] })
    }

    const removeState = (id) => {
        setSpec({
            ...specSafe,
            states: specSafe.states.filter(s => s !== id),
            transitions: specSafe.transitions.filter(t => t.from !== id && t.to !== id),
            finals: specSafe.finals.filter(f => f !== id),
            rejects: specSafe.rejects.filter(r => r !== id),
            start: specSafe.start === id ? null : specSafe.start,
        })
    }

    const toggleAccept = (id) => {
        const isFinal = specSafe.finals.includes(id)
        setSpec({
            ...specSafe,
            finals: isFinal ? specSafe.finals.filter(f => f !== id) : [...specSafe.finals, id],
            rejects: specSafe.rejects.filter(r => r !== id),
        })
    }

    const toggleReject = (id) => {
        const isReject = specSafe.rejects.includes(id)
        setSpec({
            ...specSafe,
            rejects: isReject ? specSafe.rejects.filter(r => r !== id) : [...specSafe.rejects, id],
            finals: specSafe.finals.filter(f => f !== id),
        })
    }

    const addTransition = (from, symbol, to) => {
        if (!from || !to || symbol === '') return
        const sym = normalizeToken(symbol) ?? symbol
        setSpec({ ...specSafe, transitions: [...specSafe.transitions, { from, to, symbol: sym }] })
    }

    const removeTransitionAt = (idx) => {
        const next = specSafe.transitions.slice()
        next.splice(idx, 1)
        setSpec({ ...specSafe, transitions: next })
    }

    const insertEpsilonIntoAlphabet = () => {
        const tokens = alphaInput.split(',')
        const hasEps = tokens.some(t => normalizeToken(t) === 'ε')
        if (!hasEps) setAlphaInput(prev => (prev.trim() ? prev + ',ε' : 'ε'))
    }

    const insertEpsilonIntoSymbolField = () => {
        const symEl = document.getElementById('tSym')
        if (symEl) symEl.value = 'ε'
    }

    const onAlphaKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            saveAlphabet()
        }
    }

    const clearAll = () => {
        setSpec({
            ...specSafe,
            alphabet: [],
            states: [],
            start: null,
            finals: [],
            rejects: [],
            transitions: [],
        })
        setAlphaInput('')
            ;['newState', 'tFrom', 'tTo', 'tSym'].forEach(id => {
                const el = document.getElementById(id)
                if (!el) return
                if (el.tagName === 'SELECT') el.selectedIndex = 0
                else el.value = ''
            })
    }

    return (
        <div className="space-y-4">
            <button
                onClick={clearAll}
                className="text-xs px-2 py-1 rounded border bg-white hover:bg-slate-50"
                title="Clear alphabet, states, and transitions"
            >
                Clear all
            </button>

            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Type:</span>
                <select
                    value={specSafe.type}
                    onChange={(e) =>
                        setSpec({
                            ...specSafe,
                            type: e.target.value,
                            transitions: [],
                        })
                    }
                    className="px-2 py-1 border rounded text-sm"
                    title="Automaton type"
                >
                    <option value="DFA">DFA</option>
                    <option value="NFA">NFA</option>
                    <option value="PDA">PDA</option>
                    <option value="TM">TM</option>
                </select>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm text-slate-700">Alphabet (comma-separated)</label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        id="alphabetInput"
                        className="w-full px-2 py-1 border rounded"
                        value={alphaInput}
                        onChange={(e) => setAlphaInput(e.target.value)}
                        onBlur={saveAlphabet}
                        onKeyDown={onAlphaKeyDown}
                        placeholder="e.g., a,b,ε  (tip: type e for ε)"
                    />
                    <button
                        onClick={saveAlphabet}
                        className="px-3 py-1 rounded bg-slate-900 text-white"
                        title="Apply alphabet changes"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={insertEpsilonIntoAlphabet}
                        className="px-2 py-1 rounded border bg-white"
                        title="Insert ε into alphabet"
                    >
                        ε
                    </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                    Tip: Type <span className="font-mono">e</span> or <span className="font-mono">epsilon</span> to get <span className="font-mono">ε</span>.
                </p>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-2">
                    <input id="newState" className="px-2 py-1 border rounded" placeholder="state id (e.g., q3)" />
                    <button
                        onClick={() => {
                            const el = document.getElementById('newState')
                            addState(el.value); el.value = ''
                        }}
                        className="px-3 py-1 rounded bg-slate-900 text-white"
                    >
                        Add State
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {specSafe.states.map(s => {
                        const isStart = specSafe.start === s
                        const isFinal = specSafe.finals.includes(s)
                        const isReject = specSafe.rejects.includes(s)
                        return (
                            <div key={s} className="flex items-center gap-2 bg-slate-100 rounded px-2 py-1">
                                <span className="font-mono">{s}</span>

                                <button
                                    onClick={() => setSpec({ ...specSafe, start: s })}
                                    className={`text-xs px-1 rounded ${isStart ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
                                    title="Mark as start"
                                >
                                    start
                                </button>

                                <button
                                    onClick={() => toggleAccept(s)}
                                    className={`text-xs px-1 rounded ${isFinal ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
                                    title="Toggle accepting (double circle)"
                                >
                                    accept
                                </button>

                                <button
                                    onClick={() => toggleReject(s)}
                                    className={`text-xs px-1 rounded ${isReject ? 'bg-rose-600 text-white' : 'bg-white border'}`}
                                    title="Toggle rejecting (single circle)"
                                >
                                    reject
                                </button>

                                <button
                                    onClick={() => removeState(s)}
                                    className="text-xs px-1 rounded bg-white border"
                                    title="Remove state"
                                >
                                    ✕
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-2 mb-2">
                    <select id="tFrom" className="px-2 py-1 border rounded">
                        <option value="">from</option>
                        {specSafe.states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <div className="flex items-center gap-2">
                        <input id="tSym" className="px-2 py-1 border rounded w-full" placeholder="symbol (e.g., a or ε)" />
                        <button
                            type="button"
                            onClick={insertEpsilonIntoSymbolField}
                            className="px-2 py-1 rounded border bg-white"
                            title="Insert ε"
                        >
                            ε
                        </button>
                    </div>

                    <select id="tTo" className="px-2 py-1 border rounded">
                        <option value="">to</option>
                        {specSafe.states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <button
                        onClick={() => {
                            const f = document.getElementById('tFrom').value
                            const y = document.getElementById('tSym').value
                            const t = document.getElementById('tTo').value
                            addTransition(f, y, t)
                            document.getElementById('tSym').value = ''
                        }}
                        className="px-3 py-1 rounded bg-slate-900 text-white"
                    >
                        Add
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {specSafe.transitions.map((t, i) => (
                        <span key={i} className="inline-flex items-center gap-2 text-xs bg-slate-100 rounded px-2 py-1 border">
                            <span>({t.from} —{t.symbol}→ {t.to})</span>
                            <button
                                onClick={() => removeTransitionAt(i)}
                                className="w-4 h-4 grid place-items-center rounded-full border hover:bg-rose-50 hover:border-rose-400"
                                title="Remove transition"
                                aria-label={`Remove transition ${i}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}