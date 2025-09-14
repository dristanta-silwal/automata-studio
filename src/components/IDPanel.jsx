export default function IDPanel({ ids, accepted, stepIndex = null }) {
    return (
        <div className="bg-white rounded-2xl p-4 border">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Instantaneous Descriptions (IDs)</h2>
                <span className={`px-2 py-0.5 rounded text-xs ${accepted ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                    {accepted ? 'ACCEPT' : 'REJECT'}
                </span>
            </div>

            <div className="max-h-56 overflow-auto font-mono text-sm space-y-1">
                {(!ids || ids.length === 0) && <div className="text-slate-500">Run a simulation to see IDs here.</div>}
                {ids && ids.map((id, i) => (
                    <div key={i} className={stepIndex === i ? 'bg-indigo-50 rounded px-1' : ''}>
                        <span className="text-slate-400">{i}.</span> {renderID(id)}
                    </div>
                ))}
            </div>
        </div>
    )
}

function renderID(id) {
    if (id.state !== undefined && id.unread !== undefined && id.stack === undefined && id.head === undefined) {
        return <>⟨{id.state}, {id.unread || 'ε'}⟩</>
    }
    if (id.states instanceof Set) {
        const setStr = `{${[...id.states].join(',')}}`
        return <>⟨{setStr}, {id.unread || 'ε'}⟩</>
    }
    if (id.state !== undefined && Array.isArray(id.stack)) {
        const stackStr = id.stack.length ? `[${id.stack.join(' ')}]` : '[]'
        const unread = id.unread === undefined ? 'ε' : (id.unread || 'ε')
        return <>⟨{id.state}, {unread}, {stackStr}⟩</>
    }
    if (id.state !== undefined && id.head !== undefined && id.tape instanceof Map) {
        const radius = 5
        const cells = []
        for (let k = id.head - radius; k <= id.head + radius; k++) {
            const v = id.tape.get(k) ?? '⊔'
            cells.push(`${k === id.head ? '▮' : ''}${v}`)
        }
        return <>⟨{id.state}, head={id.head}, tape={cells.join('|')}⟩</>
    }
    return JSON.stringify(id)
}
