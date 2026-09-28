import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, Filter, Edit, Trash, FileText, Video, Book, FileCode, Library, ChevronRight, X, UploadCloud } from 'lucide-react';

export default function ResourceManagement() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    difficulty: 'Intermediate'
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get('/api/resources');
      setResources(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) {
        alert("Please select a file to upload.");
        return;
    }
    
    setUploading(true);
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('difficulty', uploadForm.difficulty);

    try {
        await axios.post('/api/resources/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setShowUploadModal(false);
        fetchResources(); // Refresh list
    } catch (err) {
        console.error(err);
        alert("Failed to upload PDF.");
    } finally {
        setUploading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
      case 'NPTEL_LECTURE': return <Video className="w-5 h-5 text-rose-400" />;
      case 'PDF':
      case 'DOCUMENTATION': return <FileText className="w-5 h-5 text-sky-400" />;
      case 'BOOK': return <Book className="w-5 h-5 text-amber-400" />;
      case 'GITHUB':
      case 'CODING_PROBLEM': return <FileCode className="w-5 h-5 text-emerald-400" />;
      default: return <Library className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Resource Library</h1>
            <p className="text-slate-400 text-sm">Manage learning materials, PDFs, and external links mapping to the Knowledge Graph.</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Upload PDF
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="w-5 h-5 absolute left-4 top-3 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search resources by title, concept, or author..." 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-slate-200 placeholder-slate-500 shadow-inner" 
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300 px-5 py-3 rounded-xl font-medium transition-all">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((r) => (
              <div key={r.id} className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 flex flex-col hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-slate-800 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 bg-slate-800 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"><Trash className="w-3.5 h-3.5" /></button>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
                    {getIcon(r.resourceType)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-950 px-2 py-1 rounded-md border border-slate-800/60">
                    {r.resourceType}
                  </span>
                </div>

                <Link to={/resources/ + r.id} className="text-lg font-bold text-slate-100 mb-2 leading-tight group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {r.title}
                </Link>
                
                <p className="text-sm text-slate-400 line-clamp-3 mb-5 flex-1 leading-relaxed">
                  {r.description}
                </p>

                <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-800/60">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-500">{r.difficulty}</span>
                    <span className="text-slate-500">{r.source}</span>
                  </div>
                  <Link to={/resources/ + r.id} className="flex items-center justify-between bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    View Structure
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button 
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
                <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <UploadCloud className="text-indigo-400" /> Upload PDF
            </h2>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">PDF File</label>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="application/pdf"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-400 hover:file:bg-indigo-500/30 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Title (Optional)</label>
                    <input 
                        type="text" 
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                        placeholder="Leave blank to use filename"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                    <textarea 
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 h-24"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Difficulty</label>
                    <select 
                        value={uploadForm.difficulty}
                        onChange={(e) => setUploadForm({...uploadForm, difficulty: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={uploading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-colors">
                        {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <UploadCloud className="w-4 h-4" />}
                        {uploading ? 'Processing...' : 'Upload & Process'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
