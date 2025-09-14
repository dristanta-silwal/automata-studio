import { useMemo, useRef, useState } from 'react'

export default function MemoryPanel({
    type,
    stack,
    onPush,
    onPop,
    tape,
    head,
    onMove,
    onWrite,
}) {
    if (type === 'PDA') {
        return <PDAStackPanel stack={stack} onPush={onPush} onPop={onPop} />
    }
    if (type === 'TM') {
        return <TMTapePanel tape={tape} head={head} onMove={onMove} onWrite={onWrite} />
    }
    return (
        <div className="bg-white rounded-2xl p-4 border">
            <h2 className="font-semibold mb-2">Memory Visualization</h2>
            <p className="text-sm text-slate-600">No auxiliary memory for {type}.</p>
        </div>
    )
}

function PDAStackPanel({ stack, onPush, onPop }) {
    const demo = stack === undefined
    const [demoStack, setDemoStack] = useState(['Z'])
    const [sym, setSym] = useState('a')

    const view = stack ?? demoStack
    const push = (s) => {
        if (!s) return
        if (onPush) return onPush(s)
        setDemoStack(prev => [...prev, s])
    }
    const pop = () => {
        if (onPop) return onPop()
        setDemoStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev))
    }

    return (
        <div className="bg-white rounded-2xl p-4 border">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">PDA Stack</h2>
                {demo && <span className="text-xs text-slate-500">demo mode</span>}
            </div>

            <div className="relative">
                <div className="flex items-end gap-1 overflow-x-auto p-2 rounded border bg-slate-50">
                    {view.map((cell, i) => (
                        <StackCell key={`${cell}-${i}`} value={cell} isTop={i === view.length - 1} />
                    ))}
                </div>
                <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
                    <span>bottom</span>
                    <span>top</span>
                </div>
            </div>

            {(demo || onPush || onPop) && (
                <div className="mt-3 flex items-center gap-2">
                    <input
                        value={sym}
                        onChange={(e) => setSym(e.target.value)}
                        maxLength={3}
                        className="px-2 py-1 border rounded w-24"
                        placeholder="symbol"
                        title="Symbol to push"
                    />
                    <button onClick={() => push(sym || 'ε')} className="px-3 py-1 rounded bg-slate-900 text-white">
                        Push
                    </button>
                    <button onClick={pop} className="px-3 py-1 rounded border bg-white">
                        Pop
                    </button>
                </div>
            )}

            <p className="mt-2 text-xs text-slate-600">
                Top is at the <b>right</b>. Typical PDA moves: <span className="font-mono">(q, a, X ⟶ p, γ)</span> push/write γ (possibly multi-symbol) after consuming input.
            </p>
        </div>
    )
}

function StackCell({ value, isTop }) {
    return (
        <div
            className={`min-w-10 px-2 py-2 rounded-lg border text-center bg-white transition-transform ${isTop ? 'ring-2 ring-indigo-500 scale-[1.02]' : ''
                }`}
            style={{ userSelect: 'none' }}
            title={isTop ? 'Top' : 'Stack cell'}
        >
            <span className="font-mono">{value}</span>
        </div>
    )
}


function TMTapePanel({ tape, head, onMove, onWrite }) {
    const demo = tape === undefined
    const [demoHead, setDemoHead] = useState(0)
    const [demoTape, setDemoTape] = useState(() => new Map([[0, '⊔']]))
    const [sym, setSym] = useState('1')

    const headPos = head ?? demoHead
    const sparseTape = useMemo(() => {
        if (tape instanceof Map) return tape
        if (tape && typeof tape === 'object') {
            const m = new Map()
            for (const k of Object.keys(tape)) m.set(Number(k), tape[k])
            return m
        }
        return demoTape
    }, [tape, demoTape])

    const get = (i) => sparseTape.get(i) ?? '⊔'
    const radius = 10
    const cells = []
    for (let i = headPos - radius; i <= headPos + radius; i++) {
        cells.push([i, get(i)])
    }

    const move = (dir) => {
        if (onMove) return onMove(dir)
        setDemoHead(h => h + dir)
        setDemoTape(prev => {
            const m = new Map(prev)
            if (!m.has(headPos + dir)) m.set(headPos + dir, '⊔')
            return m
        })
    }

    const write = (s) => {
        const symbol = (s || '⊔')
        if (onWrite) return onWrite(symbol)
        setDemoTape(prev => {
            const m = new Map(prev)
            m.set(headPos, symbol)
            return m
        })
    }

    const scrollRef = useRef(null)

    return (
        <div className="bg-white rounded-2xl p-4 border">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Turing Machine Tape</h2>
                {demo && <span className="text-xs text-slate-500">demo mode</span>}
            </div>

            <div
                ref={scrollRef}
                className="relative w-full overflow-x-auto border rounded bg-slate-50"
                style={{ scrollBehavior: 'smooth' }}
            >
                <div className="flex min-w-max gap-0.5 p-2">
                    {cells.map(([i, v]) => {
                        const isHead = i === headPos
                        return (
                            <div key={i} className="inline-flex flex-col items-center">
                                <div
                                    className={`w-12 h-12 grid place-items-center border rounded bg-white font-mono ${isHead ? 'ring-2 ring-indigo-500 scale-[1.02]' : ''
                                        }`}
                                    title={`cell ${i}`}
                                >
                                    {v}
                                </div>
                                <div className="h-5 text-xs">
                                    {isHead ? '▲' : <span className="opacity-0">▲</span>}
                                </div>
                                <div className="text-[10px] text-slate-500 select-none">{i}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {(demo || onMove || onWrite) && (
                <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => move(-1)} className="px-3 py-1 rounded border bg-white">◀︎ Left</button>
                    <button onClick={() => move(1)} className="px-3 py-1 rounded border bg-white">Right ▶︎</button>
                    <input
                        value={sym}
                        onChange={(e) => setSym(e.target.value)}
                        maxLength={3}
                        className="px-2 py-1 border rounded w-24"
                        placeholder="symbol"
                        title="Symbol to write at head"
                    />
                    <button onClick={() => write(sym)} className="px-3 py-1 rounded bg-slate-900 text-white">Write</button>
                    <button onClick={() => write('⊔')} className="px-3 py-1 rounded border bg-white" title="Write blank">
                        Blank
                    </button>
                </div>
            )}

            <p className="mt-2 text-xs text-slate-600">
                The head reads/writes the symbol under it and moves ⬅︎/➡︎ one cell per step. Blank is shown as <span className="font-mono">⊔</span>.
            </p>
        </div>
    )
}