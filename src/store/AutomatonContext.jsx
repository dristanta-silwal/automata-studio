import React, { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'automatonSpec:v1'

const DEFAULT_NFA = {
    type: 'NFA',
    alphabet: ['a', 'b', 'ε'],
    states: ['q0', 'q1', 'q2'],
    start: 'q0',
    finals: ['q2'],
    rejects: [],
    transitions: [
        { from: 'q0', to: 'q0', symbol: 'a' },
        { from: 'q0', to: 'q1', symbol: 'b' },
        { from: 'q1', to: 'q2', symbol: 'ε' },
        { from: 'q1', to: 'q2', symbol: 'a' },
    ],
}

const AutomatonCtx = createContext(null)

export function AutomatonProvider({ children }) {
    // load from localStorage if present
    const [spec, _setSpec] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) : DEFAULT_NFA
        } catch {
            return DEFAULT_NFA
        }
    })

    // undo/redo history
    const [hist, setHist] = useState([spec])
    const [pos, setPos] = useState(0)

    const setSpec = (next) => {
        const value = typeof next === 'function' ? next(spec) : next
        const newHist = [...hist.slice(0, pos + 1), value].slice(-100) // cap history
        setHist(newHist)
        setPos(newHist.length - 1)
        _setSpec(value)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch { }
    }

    const undo = () => {
        if (pos <= 0) return
        const newPos = pos - 1
        setPos(newPos)
        const value = hist[newPos]
        _setSpec(value)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch { }
    }

    const redo = () => {
        if (pos >= hist.length - 1) return
        const newPos = pos + 1
        setPos(newPos)
        const value = hist[newPos]
        _setSpec(value)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch { }
    }

    const reset = () => {
        setHist([DEFAULT_NFA])
        setPos(0)
        _setSpec(DEFAULT_NFA)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NFA))
        } catch { }
    }

    const canUndo = pos > 0
    const canRedo = pos < hist.length - 1

    return (
        <AutomatonCtx.Provider value={{ spec, setSpec, undo, redo, canUndo, canRedo, reset }}>
            {children}
        </AutomatonCtx.Provider>
    )
}

export function useAutomaton() {
    const ctx = useContext(AutomatonCtx)
    if (!ctx) throw new Error('useAutomaton must be used within AutomatonProvider')
    return ctx
}