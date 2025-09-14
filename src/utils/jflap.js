export function exportToJFF(spec) {
    if (spec.type !== 'DFA' && spec.type !== 'NFA') {
        throw new Error('exportToJFF: only DFA/NFA supported')
    }

    const states = spec.states || []
    const finals = new Set(spec.finals || [])
    const start = spec.start

    const stateXml = states.map((name, idx) => {
        const isStart = start === name
        const isFinal = finals.has(name)
        return `
      <state id="${idx}" name="${escapeXml(name)}">
        ${isStart ? '<initial/>' : ''}
        ${isFinal ? '<final/>' : ''}
      </state>`
    }).join('')


    const idOf = new Map(states.map((s, i) => [s, i]))

    const transXml = (spec.transitions || []).map(t => {
        const from = idOf.get(t.from)
        const to = idOf.get(t.to)
        const read = (t.symbol === 'ε' || t.symbol === '' || t.symbol == null) ? '' : escapeXml(t.symbol)
        if (from == null || to == null) return ''
        return `
      <transition>
        <from>${from}</from>
        <to>${to}</to>
        <read>${read}</read>
      </transition>`
    }).join('')

    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE structure PUBLIC "-//JFLAP//DTD JFLAP 2008 XML//EN" "http://www.jflap.org/jflap.dtd">
<structure>
  <type>fa</type>
  <automaton>
    ${stateXml}
    ${transXml}
  </automaton>
</structure>`
}

export function importFromJFF(xmlString) {
    const doc = new DOMParser().parseFromString(xmlString, 'application/xml')
    const type = doc.querySelector('structure > type')?.textContent
    if (type !== 'fa') throw new Error('Only FA (.jff) is supported')

    const stateEls = Array.from(doc.querySelectorAll('automaton > state'))
    const states = stateEls.map(s => s.getAttribute('name'))
    const idToName = new Map(stateEls.map(s => [s.getAttribute('id'), s.getAttribute('name')]))

    let start = null
    const finals = []
    for (const s of stateEls) {
        if (s.querySelector('initial')) start = s.getAttribute('name')
        if (s.querySelector('final')) finals.push(s.getAttribute('name'))
    }

    const transEls = Array.from(doc.querySelectorAll('automaton > transition'))
    const transitions = transEls.map(tr => {
        const fromId = tr.querySelector('from')?.textContent ?? ''
        const toId = tr.querySelector('to')?.textContent ?? ''
        const read = tr.querySelector('read')?.textContent ?? ''
        return {
            from: idToName.get(fromId),
            to: idToName.get(toId),
            symbol: read === '' ? 'ε' : read,
        }
    }).filter(t => t.from && t.to)

    const seen = new Set()
    let isNFA = false
    for (const t of transitions) {
        const k = `${t.from}|${t.symbol}`
        if (seen.has(k)) { isNFA = true; break }
        seen.add(k)
    }

    return {
        type: isNFA ? 'NFA' : 'DFA',
        alphabet: inferAlphabetFromTransitions(transitions),
        states,
        start,
        finals,
        rejects: [],
        transitions,
    }
}

function inferAlphabetFromTransitions(trans) {
    const a = new Set()
    for (const t of trans) {
        if (t.symbol && t.symbol !== 'ε') a.add(t.symbol)
    }
    const arr = Array.from(a)
    if (!arr.includes('ε')) arr.push('ε')
    return arr
}

function escapeXml(s) {
    return s
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;')
}