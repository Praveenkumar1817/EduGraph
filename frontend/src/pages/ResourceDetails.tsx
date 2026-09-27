import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen, Layers, Link as LinkIcon, FileText } from 'lucide-react';

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

  if (loading) return <div className="p-8 text-center text-slate-400">Loading resource details...</div>;
  if (!data) return <div className="p-8 text-center text-red-400">Resource not found</div>;

  const r = data.resource;

  return (
    <div className="p-8 h-full overflow-y-auto">
      <Link to="/resources" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Resources
      </Link>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">{r.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
          <span className="flex items-center gap-1 bg-slate-700 px-3 py-1 rounded-full text-slate-200"><FileText className="w-4 h-4" /> {r.resourceType}</span>
          <span className="bg-slate-900 px-3 py-1 rounded-full">{r.difficulty}</span>
          <span className="bg-slate-900 px-3 py-1 rounded-full">Source: {r.source}</span>
          {r.author && <span className="bg-slate-900 px-3 py-1 rounded-full">Author: {r.author}</span>}
        </div>
        
        <p className="text-slate-300 text-lg mb-6">{r.description}</p>
        
        {r.url && (
          <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
            <LinkIcon className="w-4 h-4" /> Open Original Source
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Covered Concepts
            </h2>
            <ul className="space-y-3">
              {r.concepts?.map((c: any) => (
                <li key={c.id}>
                  <Link to="/" className="block p-3 bg-slate-900 rounded-md border border-slate-700 hover:border-indigo-500 transition-colors">
                    <div className="font-medium text-slate-200">{c.name}</div>
                  </Link>
                </li>
              ))}
              {(!r.concepts || r.concepts.length === 0) && (
                <li className="text-slate-500 italic">No concepts mapped yet</li>
              )}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-orange-400" /> Resource Structure
            </h2>
            
            <div className="space-y-6">
              {data.sections?.map((secData: any) => (
                <div key={secData.section.id} className="border border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-slate-900 px-4 py-3 flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-slate-200">
                      Section {secData.section.sectionNumber}: {secData.section.title}
                    </h3>
                    <span className="text-xs text-slate-500">Pages {secData.section.pageStart}-{secData.section.pageEnd}</span>
                  </div>
                  
                  {secData.chunks && secData.chunks.length > 0 ? (
                    <div className="p-4 space-y-4">
                      {secData.chunks.map((chunk: any) => (
                        <div key={chunk.id} className="bg-slate-950 p-4 rounded-md border border-slate-800">
                          <p className="text-slate-300 text-sm mb-3 font-mono">{chunk.content}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {chunk.concepts?.map((c: any) => (
                              <span key={c.id} className="text-xs bg-indigo-900 text-indigo-200 px-2 py-1 rounded-full">
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-slate-500 italic">No chunks mapped to this section yet.</div>
                  )}
                </div>
              ))}
              
              {(!data.sections || data.sections.length === 0) && (
                <div className="text-slate-500 italic">No structural breakdown available for this resource.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
