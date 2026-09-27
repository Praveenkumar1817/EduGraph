import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, Filter, Edit, Trash } from 'lucide-react';

export default function ResourceManagement() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Resource Management</h1>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md font-medium">
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input type="text" placeholder="Search resources..." className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-indigo-500" />
        </div>
        <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-md">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading resources...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r) => (
            <div key={r.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <Link to={/resources/ + r.id} className="text-lg font-semibold hover:text-indigo-400">
                  {r.title}
                </Link>
                <div className="flex gap-2">
                  <button className="text-slate-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                  <button className="text-slate-400 hover:text-red-400"><Trash className="w-4 h-4" /></button>
                </div>
              </div>
              
              <div className="text-sm text-slate-400 mb-4">{r.resourceType} • {r.difficulty} • {r.source}</div>
              
              <p className="text-sm text-slate-300 line-clamp-2 mb-4 flex-1">
                {r.description}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-700">
                <Link to={/resources/ + r.id} className="text-indigo-400 text-sm font-medium hover:text-indigo-300">
                  View Details & Structure ?
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
