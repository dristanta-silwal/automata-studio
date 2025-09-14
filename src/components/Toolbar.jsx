import { useRef } from 'react'
import { useAutomaton } from '../store/AutomatonContext'
import { exportToJFF, importFromJFF } from '../utils/jflap'

export default function Toolbar() {
    const { spec, setSpec, undo, redo, canUndo, canRedo, reset } = useAutomaton()
    const fileRef = useRef(null)
    const jffRef = useRef(null)

    const PRESETS = {
        dfa_aStarbStar: {
            type: 'DFA',
            alphabet: ['a', 'b'],
            states: ['q0', 'q1'],
            start: 'q0',
            finals: ['q0'],
            rejects: [],
            transitions: [
                { from: 'q0', symbol: 'a', to: 'q0' },
                { from: 'q0', symbol: 'b', to: 'q0' },
                { from: 'q1', symbol: 'a', to: 'q1' },
                { from: 'q1', symbol: 'b', to: 'q1' },
            ],
        },
        nfa_example: {
            type: 'NFA',
            alphabet: ['a', 'b', 'ε'],
            states: ['q0', 'q1', 'q2'],
            start: 'q0',
            finals: ['q2'],
            rejects: [],
            transitions: [
                { from: 'q0', symbol: 'a', to: 'q0' },
                { from: 'q0', symbol: 'b', to: 'q1' },
                { from: 'q1', symbol: 'ε', to: 'q2' },
            ],
        },
        pda_anbn: {
            type: 'PDA',
            alphabet: ['a', 'b', 'ε'],
            states: ['q0', 'qf'],
            start: 'q0',
            finals: ['qf'],
            rejects: [],
            stackBottom: 'Z',
            transitions: [
                { from: 'q0', read: 'a', pop: 'Z', push: 'AZ', to: 'q0' },
                { from: 'q0', read: 'a', pop: 'A', push: 'AA', to: 'q0' },
                { from: 'q0', read: 'b', pop: 'A', push: 'ε', to: 'q0' },
                { from: 'q0', read: 'ε', pop: 'Z', push: 'Z', to: 'qf' },
            ],
        },
    }

    const onTypeChange = (e) => {
        const nextType = e.target.value
        setSpec(s => ({ ...s, type: nextType, transitions: [] }))
    }

    const loadPreset = (key) => {
        setSpec(PRESETS[key])
    }

    const exportJSON = () => {
        const data = JSON.stringify(spec, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'automaton.json'; a.click()
        URL.revokeObjectURL(url)
    }

    const importJSON = async (file) => {
        const text = await file.text()
        const obj = JSON.parse(text)
        setSpec(obj)
    }

    const onPickJSON = () => fileRef.current?.click()
    const onFileJSON = (e) => {
        const f = e.target.files?.[0]
        if (f) importJSON(f)
        e.target.value = ''
    }

    const exportJFLAP = () => {
        if (spec.type !== 'DFA' && spec.type !== 'NFA') {
            alert('JFLAP export currently supports DFA/NFA only.')
            return
        }
        const xml = exportToJFF(spec)
        const blob = new Blob([xml], { type: 'application/xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'automaton.jff'; a.click()
        URL.revokeObjectURL(url)
    }

    const importJFLAP = async (file) => {
        const text = await file.text()
        try {
            const obj = importFromJFF(text)
            setSpec(obj)
        } catch (e) {
            console.error(e)
            alert('Failed to import .jff. Make sure it is an FA (DFA/NFA).')
        }
    }

    const onPickJFF = () => jffRef.current?.click()
    const onFileJFF = (e) => {
        const f = e.target.files?.[0]
        if (f) importJFLAP(f)
        e.target.value = ''
    }

    return (
        <div className="flex flex-wrap items-center gap-2 mb-3">
            <select
                value={spec.type || 'DFA'}
                onChange={onTypeChange}
                className="px-2 py-1 border rounded"
                title="Automaton type"
            >
                <option value="DFA">DFA</option>
                <option value="NFA">NFA</option>
                <option value="PDA">PDA</option>
                <option value="TM">TM</option>
            </select>

            <button onClick={() => loadPreset('dfa_aStarbStar')} className="px-2 py-1 border rounded bg-white">
                Preset: DFA a*b*
            </button>
            <button onClick={() => loadPreset('nfa_example')} className="px-2 py-1 border rounded bg-white">
                Preset: NFA
            </button>
            <button onClick={() => loadPreset('pda_anbn')} className="px-2 py-1 border rounded bg-white">
                Preset: PDA aⁿbⁿ
            </button>

            <span className="mx-1 text-slate-300">|</span>
            <button onClick={undo} disabled={!canUndo} className="px-2 py-1 border rounded bg-white disabled:opacity-50">Undo</button>
            <button onClick={redo} disabled={!canRedo} className="px-2 py-1 border rounded bg-white disabled:opacity-50">Redo</button>

            <span className="mx-1 text-slate-300">|</span>
            <button onClick={onPickJSON} className="px-2 py-1 border rounded bg-white">Import JSON</button>
            <button onClick={exportJSON} className="px-2 py-1 border rounded bg-white">Export JSON</button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onFileJSON} />
            
            <button onClick={onPickJFF} className="px-2 py-1 border rounded bg-white">Import JFLAP</button>
            <button onClick={exportJFLAP} className="px-2 py-1 border rounded bg-white">Export JFLAP</button>
            <input ref={jffRef} type="file" accept=".jff,application/xml,text/xml" className="hidden" onChange={onFileJFF} />

            <span className="mx-1 text-slate-300">|</span>
            <button onClick={reset} className="px-2 py-1 border rounded bg-white">Reset</button>
        </div>
    )
}