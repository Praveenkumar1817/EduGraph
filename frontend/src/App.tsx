import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import GraphPage from './pages/GraphPage';
import ResourceManagement from './pages/ResourceManagement';
import ResourceDetails from './pages/ResourceDetails';
import { Network, FileText, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen flex-col bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800/60 bg-slate-950/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Network className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                EduGraph <Sparkles className="w-4 h-4 text-amber-400" />
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">AI-POWERED KNOWLEDGE</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <NavLink 
              to="/" 
              className={({isActive}) => "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 " + (isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200')}
            >
              <Network className="h-4 w-4" /> Graph View
            </NavLink>
            <NavLink 
              to="/resources" 
              className={({isActive}) => "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 " + (isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200')}
            >
              <FileText className="h-4 w-4" /> Resources
            </NavLink>
          </nav>
          <div className="flex items-center">
             <a href="https://github.com/Praveenkumar1817/EduGraph" target="_blank" className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700 hover:text-white">
                <span></span> GitHub
             </a>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<GraphPage />} />
            <Route path="/resources" element={<ResourceManagement />} />
            <Route path="/resources/:id" element={<ResourceDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

