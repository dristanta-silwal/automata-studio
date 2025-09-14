import { useEffect, useMemo, useRef, useState } from 'react'

const R = 24

function autoGrid(states, w, h) {
    const n = Math.max(1, states.length)
    const cols = Math.ceil(Math.sqrt(n))
    const rows = Math.ceil(n / cols)
    const margin = 64
    const cellW = (w - 2 * margin) / cols
    const cellH = (h - 2 * margin) / rows
    const res = []
    let k = 0
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if (k >= states.length) break
        const id = states[k++]
        res.push({ id, x: margin + c * cellW + cellW / 2, y: margin + r * cellH + cellH / 2 })
    }
    return res
}

function Arrow({ x1, y1, x2, y2, label, startPad = R, endPad = R }) {
    const dx = x2 - x1, dy = y2 - y1
    const ang = Math.atan2(dy, dx)
    const head = 8

    const sx = x1 + Math.cos(ang) * startPad
    const sy = y1 + Math.sin(ang) * startPad
    const ex = x2 - Math.cos(ang) * endPad
    const ey = y2 - Math.sin(ang) * endPad

    const hx = ex - Math.cos(ang) * head
    const hy = ey - Math.sin(ang) * head
    const mx = (sx + ex) / 2
    const my = (sy + ey) / 2

    return (
        <g>
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#334155" strokeWidth={2} />
            <polygon
                points={`${ex},${ey} ${hx + Math.cos(ang + Math.PI / 2) * head},${hy + Math.sin(ang + Math.PI / 2) * head} ${hx + Math.cos(ang - Math.PI / 2) * head},${hy + Math.sin(ang - Math.PI / 2) * head}`}
                fill="#334155"
            />
            {label && (
                <text x={mx} y={my - 6} textAnchor="middle" className="fill-slate-700 text-xs select-none">
                    {label}
                </text>
            )}
        </g>
    )
}

function StartArrow({ toX, toY }) {
    const ax = toX - 110
    const ay = toY - 110
    return (
        <g>
            <Arrow x1={ax} y1={ay} x2={toX} y2={toY} label="start" startPad={8} endPad={R + 2} />
        </g>
    )
}

function SelfLoop({ x, y, label }) {
    const top = y - 30
    return (
        <g>
            <path
                d={`M ${x + R} ${top} C ${x + 52} ${top - 26}, ${x - 52} ${top - 26}, ${x - R} ${top}`}
                stroke="#334155"
                strokeWidth={2}
                fill="none"
            />
            {label && (
                <text x={x} y={top - 18} textAnchor="middle" className="fill-slate-700 text-xs select-none">
                    {label}
                </text>
            )}
        </g>
    )
}

export default function GraphCanvas({ spec, width = 700, height = 360 }) {
    const ref = useRef(null)
    const [positions, setPositions] = useState(() => autoGrid(spec.states, width, height))

    useEffect(() => {
        setPositions(autoGrid(spec.states, width, height))
    }, [spec.states.join('|'), width, height])

    const pos = useMemo(() => new Map(positions.map(p => [p.id, p])), [positions])

    const grouped = useMemo(() => {
        const map = new Map()
        for (const t of (spec.transitions || [])) {
            const key = `${t.from}->${t.to}`
            if (!map.has(key)) map.set(key, { from: t.from, to: t.to, symbols: [] })
            map.get(key).symbols.push(t.symbol ?? '')
        }
        for (const v of map.values()) {
            const uniq = Array.from(new Set(v.symbols))
            v.label = uniq.join(',')
        }
        return Array.from(map.values())
    }, [spec.transitions])

    useEffect(() => {
        const svg = ref.current; if (!svg) return
        let drag = null
        const down = (e) => {
            const id = e.target?.getAttribute?.('data-node-id')
            if (!id) return
            drag = positions.find(p => p.id === id) || null
        }
        const move = (e) => {
            if (!drag || !svg) return
            const r = svg.getBoundingClientRect()
            setPositions(s => s.map(p => p.id === drag.id ? { ...p, x: e.clientX - r.left, y: e.clientY - r.top } : p))
        }
        const up = () => { drag = null }
        svg.addEventListener('mousedown', down)
        window.addEventListener('mousemove', move)
        window.addEventListener('mouseup', up)
        return () => {
            svg.removeEventListener('mousedown', down)
            window.removeEventListener('mousemove', move)
            window.removeEventListener('mouseup', up)
        }
    }, [positions])

    return (
        <svg ref={ref} width={width} height={height} className="w-full rounded-xl bg-slate-50 border">
            {spec.start && pos.get(spec.start) && (
                <StartArrow toX={pos.get(spec.start).x} toY={pos.get(spec.start).y} />
            )}
            {grouped.map((g, i) => {
                const A = pos.get(g.from), B = pos.get(g.to); if (!A || !B) return null
                return A.id === B.id
                    ? <SelfLoop key={i} x={A.x} y={A.y} label={g.label} />
                    : <Arrow key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} label={g.label} />
            })}
            {positions.map(p => {
                const isFinal = (spec.finals || []).includes(p.id)
                return (
                    <g key={p.id}>
                        <circle
                            data-node-id={p.id}
                            cx={p.x}
                            cy={p.y}
                            r={R}
                            className={`fill-white stroke-2 ${isFinal ? 'stroke-emerald-600' : 'stroke-slate-600'}`}
                        />
                        {isFinal && <circle cx={p.x} cy={p.y} r={R - 5} className="fill-transparent stroke-emerald-600" />}
                        <text x={p.x} y={p.y + 4} textAnchor="middle" className="text-sm fill-slate-900 select-none">
                            {p.id}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}
