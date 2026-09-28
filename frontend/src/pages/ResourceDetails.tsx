import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen, Layers, Link as LinkIcon, FileText, Calendar, User, ExternalLink, Network, ChevronRight } from 'lucide-react';

export default function ResourceDetails() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const res = await axios.get('/api/resources/' + id + '/structure');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStructure();
  }, [id]);

  if (loading) return (
    <div className="flex h-full items-center justify-center bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );
  
  if (!data) return <div className="p-8 text-center text-rose-400 font-medium">Resource not found</div>;

  const r = data.resource;

  return (
    <div className="h-full overflow-y-auto bg-slate-950">
      {/* Hero Banner */}
      <div className="relative border-b border-slate-800/60 bg-gradient-to-b from-slate-900 to-slate-950 px-8 py-12">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-8 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <ArrowLeft className="w-4 h-4" /> Back to Library
          </Link>

          <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
                  {r.resourceType}
                </span>
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 rounded-lg">
                  {r.difficulty}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">{r.title}</h1>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">{r.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400">
                {r.author && <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-500" /> {r.author}</div>}
                <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-slate-500" /> Source: <span className="text-slate-200">{r.source}</span></div>
                {r.publicationDate && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-500" /> {r.publicationDate}</div>}
              </div>
            </div>
            
            {r.url && (
              <a href={r.url} target="_blank" rel="noreferrer" className="shrink-0 flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-900 px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105">
                Open Resource <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content (Structure) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <Layers className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Document Structure</h2>
            </div>
            
            <div className="space-y-6">
              {data.sections?.map((secData: any) => (
                <div key={secData.section.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm">
                  <div className="bg-slate-800/50 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-100 flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-sm">SEC {secData.section.sectionNumber}</span> 
                      {secData.section.title}
                    </h3>
                    <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-md text-xs font-medium text-slate-400">
                      Pages {secData.section.pageStart}-{secData.section.pageEnd}
                    </span>
                  </div>
                  
                  {secData.chunks && secData.chunks.length > 0 ? (
                    <div className="p-6 space-y-5">
                      {secData.chunks.map((chunk: any) => (
                        <div key={chunk.id} className="relative bg-slate-950 p-5 rounded-xl border border-slate-800/80 shadow-inner group">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <p className="text-slate-300 text-sm leading-relaxed mb-4 pl-2 font-mono">
                            "{chunk.content}"
                          </p>
                          <div className="flex flex-wrap gap-2 pl-2">
                            {chunk.concepts?.map((c: any) => (
                              <Link to="/" key={c.id} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-colors">
                                <Network className="w-3 h-3" /> {c.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm text-slate-500 font-medium">No extracted text chunks mapped to this section yet.</div>
                  )}
                </div>
              ))}
              
              {(!data.sections || data.sections.length === 0) && (
                <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">No structural breakdown available.</p>
                  <p className="text-sm text-slate-500 mt-1">Run the PDF extractor to chunk this resource.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Concepts) */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
                  <BookOpen className="w-5 h-5 text-sky-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Covered Concepts</h2>
              </div>
              
              <ul className="space-y-3">
                {r.concepts?.map((c: any) => (
                  <li key={c.id}>
                    <Link to="/" className="group flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500 transition-all shadow-sm hover:shadow-indigo-500/10">
                      <div>
                        <div className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors mb-1">{c.name}</div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{c.domain}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
                {(!r.concepts || r.concepts.length === 0) && (
                  <li className="text-slate-500 italic text-sm text-center py-4 bg-slate-950 rounded-xl border border-slate-800/50">No concepts mapped yet</li>
                )}
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
