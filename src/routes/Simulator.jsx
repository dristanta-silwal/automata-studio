import { useMemo, useState } from 'react'
import { useAutomaton } from '../store/AutomatonContext'
import GraphCanvas from '../components/GraphCanvas'
import IDPanel from '../components/IDPanel'
import MemoryPanel from '../components/MemoryPanel'
import { simDFA } from '../engine/dfa'
import { simNFA } from '../engine/nfa'
import { simPDA } from '../engine/pda'
import { simTM } from '../engine/tm'

export default function Simulator() {
    const { spec } = useAutomaton()
    const [input, setInput] = useState('abba')
    const [accepted, setAccepted] = useState(false)
    const [ids, setIds] = useState([])
    const [i, setI] = useState(0)

    const run = () => {
        if (!spec.start) { setIds([]); setAccepted(false); setI(0); return }
        let result = { accepted: false, ids: [] }

        if (spec.type === 'DFA') {
            result = simDFA(spec, input)
        } else if (spec.type === 'NFA') {
            result = simNFA(spec, input)
        } else if (spec.type === 'PDA') {
            result = simPDA(spec, input)
        } else if (spec.type === 'TM') {
            result = simTM(spec, input)
        }

        setAccepted(result.accepted)
        setIds(result.ids || [])
        setI(0)
    }

    const curr = ids[i]
    const { memType, stack, tape, head } = useMemo(() => {
        if (!curr) return { memType: spec.type }
        if (spec.type === 'PDA') {
            return { memType: 'PDA', stack: curr.stack }
        }
        if (spec.type === 'TM') {
            return { memType: 'TM', tape: curr.tape, head: curr.head }
        }
        return { memType: spec.type }
    }, [curr, spec.type])

    return (
        <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 border">
                <h2 className="font-semibold mb-3">Simulate</h2>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {(spec.type === 'DFA' || spec.type === 'NFA' || spec.type === 'PDA') && (
                        <>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="px-2 py-1 border rounded"
                                placeholder="input string"
                            />
                        </>
                    )}
                    <button onClick={run} className="px-3 py-1 rounded bg-slate-900 text-white">Run</button>
                    <div className="ml-auto flex items-center gap-2 text-sm">
                        <button
                            onClick={() => setI(v => Math.max(0, v - 1))}
                            className="px-2 py-1 border rounded"
                            disabled={i <= 0}
                            title="Prev step"
                        >Prev</button>
                        <span>{ids.length ? i + 1 : 0} / {ids.length || 0}</span>
                        <button
                            onClick={() => setI(v => Math.min((ids.length - 1), v + 1))}
                            className="px-2 py-1 border rounded"
                            disabled={i >= (ids.length - 1)}
                            title="Next step"
                        >Next</button>
                    </div>
                </div>

                <GraphCanvas spec={spec} />
            </div>

            <div className="space-y-4">
                <IDPanel ids={ids} accepted={accepted} stepIndex={i} />
                <MemoryPanel
                    type={memType}
                    stack={stack}
                    tape={tape}
                    head={head}
                />
            </div>
        </div>
    )
}