import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="space-y-6">
            <p className="text-slate-700">
                Build DFAs/NFAs, simulate runs with explicit IDs, visualize memory (PDA stack / TM tape), and see NFA→DFA subset construction.
            </p>

            <div className="bg-white rounded-2xl p-4 border space-y-3">
                <h2 className="font-semibold text-lg">Documentation</h2>

                <details className="group border rounded-lg p-3">
                    <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                        <span>Overview</span>
                        <span className="transition-transform group-open:rotate-90">›</span>
                    </summary>
                    <div className="mt-2 text-sm text-slate-700 space-y-2">
                        <p>
                            Automata Studio lets you <b>build</b> machines, <b>simulate</b> inputs with
                            Instantaneous Descriptions (IDs), and <b>visualize</b> conversions like NFA→DFA.
                        </p>
                        <ul className="list-disc pl-5">
                            <li><b>Builder</b>: define alphabet, states (start/accept/reject), and transitions.</li>
                            <li><b>Simulator</b>: run an input string; see accept/reject and the ID trace.</li>
                            <li><b>NFA→DFA</b>: perform subset construction and preview the resulting DFA.</li>
                            <li><b>MemoryPanel</b>: shows the stack (PDA) or tape (TM). DFA/NFA have no extra memory.</li>
                        </ul>
                    </div>
                </details>

                <details className="group border rounded-lg p-3">
                    <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                        <span>Builder Page</span>
                        <span className="transition-transform group-open:rotate-90">›</span>
                    </summary>
                    <div className="mt-2 text-sm text-slate-700 space-y-2">
                        <ul className="list-disc pl-5 space-y-1">
                            <li><b>Alphabet</b>: comma-separated. Tip: type <span className="font-mono">e</span> or <span className="font-mono">epsilon</span> to insert <span className="font-mono">ε</span>. Click the <span className="font-mono">ε</span> button to add it quickly.</li>
                            <li><b>States</b>: add state IDs (e.g., <span className="font-mono">q0</span>, <span className="font-mono">q1</span>), toggle <i>start</i>, <i>accept</i> (double circle), or <i>reject</i> (single circle).</li>
                            <li><b>Transitions (DFA/NFA)</b>: choose <i>from</i>, enter <i>symbol</i> (or <span className="font-mono">ε</span> for NFA), choose <i>to</i>, then <i>Add</i>. Each transition chip has a ✕ to delete.</li>
                            <li><b>PDA/TM (if enabled)</b>: when type is PDA, transitions use <span className="font-mono">{'{ from, read, pop, push, to }'}</span>; for TM, use <span className="font-mono">{'{ from, read, write, move, to }'}</span>.</li>
                            <li><b>Clear all</b>: resets alphabet, states, start/finals/rejects, and transitions.</li>
                        </ul>
                    </div>
                </details>

                <details className="group border rounded-lg p-3">
                    <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                        <span>Simulator Page</span>
                        <span className="transition-transform group-open:rotate-90">›</span>
                    </summary>
                    <div className="mt-2 text-sm text-slate-700 space-y-2">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Enter the input string (for DFA/NFA/PDA) and click <b>Run</b>.</li>
                            <li><b>IDPanel</b> shows the run: DFA <span className="font-mono">⟨q, unread⟩</span>, NFA <span className="font-mono">⟨{`{...states}`}, unread⟩</span>, PDA <span className="font-mono">⟨q, unread, [stack]⟩</span>, TM <span className="font-mono">⟨q, head=i, tape=...⟩</span>.</li>
                            <li><b>MemoryPanel</b>: DFA/NFA show “no memory”; PDA shows <b>stack</b>; TM shows <b>tape + head</b>.</li>
                            <li>Use <b>Prev/Next</b> to step through IDs (if your Simulator includes stepper controls).</li>
                        </ul>
                    </div>
                </details>

                <details className="group border rounded-lg p-3">
                    <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                        <span>NFA→DFA Page (Subset Construction)</span>
                        <span className="transition-transform group-open:rotate-90">›</span>
                    </summary>
                    <div className="mt-2 text-sm text-slate-700 space-y-2">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Start from your NFA spec; include <span className="font-mono">ε</span>-transitions if needed.</li>
                            <li>Run conversion to generate DFA states as <b>sets of NFA states</b> (ε-closure + moves).</li>
                            <li>Preview the resulting DFA graph and (optionally) export or load it into Builder.</li>
                        </ul>
                    </div>
                </details>
            </div>

            <div className="bg-white rounded-2xl p-4 border space-y-4">
                <h2 className="font-semibold text-lg">Quick Start — Step by Step</h2>

                <div>
                    <h3 className="font-semibold mb-1">A) DFA (baseline)</h3>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                        <li>Go to <Link className="text-indigo-600 underline" to="/builder">Builder</Link>.</li>
                        <li>Enter alphabet (e.g., <span className="font-mono">a,b</span>). Tip: commas are allowed freely.</li>
                        <li>Add states (e.g., <span className="font-mono">q0,q1,qf</span>), mark <b>start</b> and <b>accept</b> as needed.</li>
                        <li>Add transitions: pick <i>from</i>, type <i>symbol</i>, pick <i>to</i>, click <b>Add</b>.</li>
                        <li>Open <Link className="text-indigo-600 underline" to="/simulator">Simulator</Link>, type an input (e.g., <span className="font-mono">abba</span>), click <b>Run</b>.</li>
                        <li>Read the <b>IDs</b> to follow the run; check the ACCEPT/REJECT badge.</li>
                    </ol>
                </div>

                <div>
                    <h3 className="font-semibold mb-1">B) NFA (with ε)</h3>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                        <li>In Builder, set type to <b>NFA</b> (if you have a type selector), and include <span className="font-mono">ε</span> in the alphabet if you need ε-moves (type <span className="font-mono">e</span> to insert <span className="font-mono">ε</span>).</li>
                        <li>Add transitions with possibly multiple edges per (state, symbol) pair; ε-transitions are allowed.</li>
                        <li>Simulate in <b>Simulator</b> to see <b>sets</b> of active states in the IDs.</li>
                        <li>Optionally open <Link className="text-indigo-600 underline" to="/determinize">NFA→DFA</Link> to convert via subset construction and preview the DFA.</li>
                    </ol>
                </div>

                <div>
                    <h3 className="font-semibold mb-1">C) PDA (stack) — optional</h3>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                        <li>Switch Builder to type <b>PDA</b>. Use transitions: <span className="font-mono">{'{ from, read, pop, push, to }'}</span>.</li>
                        <li>Simulate in <b>Simulator</b>. The <b>MemoryPanel</b> shows the stack (top on the right); IDs show <span className="font-mono">⟨q, unread, [stack]⟩</span>.</li>
                    </ol>
                </div>

                <div>
                    <h3 className="font-semibold mb-1">D) Turing Machine (tape) — optional</h3>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                        <li>Switch Builder to type <b>TM</b>. Use transitions: <span className="font-mono">{'{ from, read, write, move, to }'}</span> with blank = <span className="font-mono">⊔</span>.</li>
                        <li>Run in <b>Simulator</b>. Input is placed on tape at head 0; the <b>MemoryPanel</b> shows head movement and writes per step.</li>
                    </ol>
                </div>

                <div className="text-xs text-slate-600">
                    <p className="mb-1"><b>Tips:</b></p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Use the <span className="font-mono">ε</span> buttons to quickly insert epsilon in fields.</li>
                        <li>Each transition chip has a ✕ to remove it. “Clear all” resets the whole spec.</li>
                        <li>Accepting states render as <b>double circles</b>; rejecting states as single circles.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}