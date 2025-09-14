import { useAutomaton } from '../store/AutomatonContext'
import BuilderPanel from '../components/BuilderPanel'
import GraphCanvas from '../components/GraphCanvas'
import Toolbar from '../components/Toolbar'
import IssuesBar from '../components/IssuesBar'

export default function Builder() {
  const { spec, setSpec } = useAutomaton()
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-4 border">
        <h2 className="font-semibold mb-3">Automaton Builder</h2>
        <Toolbar />
        <IssuesBar spec={spec} />
        <BuilderPanel spec={spec} setSpec={setSpec} />
      </div>
      <div className="bg-white rounded-2xl p-4 border">
        <h2 className="font-semibold mb-3">Graph Preview</h2>
        <GraphCanvas spec={spec} />
      </div>
    </div>
  )
}