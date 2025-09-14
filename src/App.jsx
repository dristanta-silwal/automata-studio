import { Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import Home from './routes/Home'
import Builder from './routes/Builder'
import Simulator from './routes/Simulator'
import Determinize from './routes/Determinize'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/determinize" element={<Determinize />} />
      </Route>
    </Routes>
  )
}