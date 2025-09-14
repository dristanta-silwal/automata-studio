import { useMemo, useState } from 'react'
import { useAutomaton } from '../store/AutomatonContext'
import GraphCanvas from '../components/GraphCanvas'
import { determinize } from '../engine/determinize'

export default function Determinize() {
    const { spec } = useAutomaton()
    const [i, setI] = useState(0)

    const { dfa, steps, setToName } = useMemo(() => {
        if (spec.type !== 'NFA' || !spec.start)
            return { dfa: spec, steps: [], setToName: new Map() }
        return determinize(spec)
    }, [spec])

    const step = steps[i]
    const label = (set) => setToName.get([...set].sort().join('|')) || `{${[...set].join(',')}}`

    return (
        <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 border">
                <h2 className="font-semibold mb-3">NFA</h2>
                <GraphCanvas spec={spec} />
            </div>
            <div className="bg-white rounded-2xl p-4 border">
                <h2 className="font-semibold mb-3">DFA (subset construction)</h2>
                <GraphCanvas spec={dfa} />
            </div>
            <div className="bg-white rounded-2xl p-4 border lg:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => setI(v => Math.max(0, v - 1))} className="px-2 py-1 border rounded">Prev</button>
                    <span className="text-sm">{steps.length ? i + 1 : 0} / {steps.length || 0}</span>
                    <button onClick={() => setI(v => Math.min(steps.length - 1, v + 1))} className="px-2 py-1 border rounded">Next</button>
                </div>
                {step
                    ? <code className="text-sm">From {label(step.fromSet)} —{step.symbol}→ {label(step.toSet)}</code>
                    : <p className="text-sm text-slate-600">Provide an NFA (with ε allowed). This page shows the animated subset construction steps.</p>}
            </div>
        </div>
    )
}