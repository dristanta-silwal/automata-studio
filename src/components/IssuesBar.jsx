import { validate } from '../utils/validate'

export default function IssuesBar({ spec }) {
    const issues = validate(spec)
    if (!issues.length) return null
    return (
        <div className="flex flex-wrap gap-2 mb-3">
            {issues.map((msg, i) => (
                <span
                    key={i}
                    className="text-xs px-2 py-1 rounded bg-amber-50 border border-amber-300 text-amber-800"
                    title="Validation warning"
                >
                    ⚠ {msg}
                </span>
            ))}
        </div>
    )
}