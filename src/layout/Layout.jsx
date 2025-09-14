import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
    const link = ({ isActive }) =>
        `px-3 py-1.5 rounded-md border transition ${isActive
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
        }`

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h1 className="text-xl md:text-2xl font-bold">Automata Studio</h1>
                <nav className="flex gap-2">
                    <NavLink to="/" className={link}>Home</NavLink>
                    <NavLink to="/builder" className={link}>Builder</NavLink>
                    <NavLink to="/simulator" className={link}>Simulator</NavLink>
                    <NavLink to="/determinize" className={link}>NFA→DFA</NavLink>
                </nav>
            </header>
            <Outlet />
        </div>
    )
}