import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GraphPage from './pages/GraphPage';
import ResourceManagement from './pages/ResourceManagement';
import ResourceDetails from './pages/ResourceDetails';
import { Network, FileText } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen flex-col bg-slate-900 text-slate-200">
        <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
          <div className="flex items-center gap-2 font-bold text-white">
            <Network className="h-5 w-5 text-indigo-400" />
            <span>Tech Knowledge Graph</span>
          </div>
          <nav className="flex gap-4">
            <Link to="/" className="flex items-center gap-1 hover:text-indigo-400">
              <Network className="h-4 w-4" /> Graph
            </Link>
            <Link to="/resources" className="flex items-center gap-1 hover:text-indigo-400">
              <FileText className="h-4 w-4" /> Resources
            </Link>
          </nav>
        </header>
        
        <main className="flex-1 overflow-hidden">
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
