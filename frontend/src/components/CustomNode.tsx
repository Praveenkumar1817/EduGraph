import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Network, FileText, Database, Server, Cpu, Code2, Zap } from 'lucide-react';

export default function CustomNode({ data }: any) {
  const isResource = data.type === 'Resource';
  
  // Choose icon based on domain or type
  const getIcon = () => {
    if (isResource) return <FileText className="w-5 h-5 text-emerald-400" />;
    switch(data.domain) {
      case 'OS': return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'DBMS': return <Database className="w-5 h-5 text-sky-400" />;
      case 'Computer Networks': return <Server className="w-5 h-5 text-amber-400" />;
      case 'OOP': return <Code2 className="w-5 h-5 text-rose-400" />;
      case 'DSA': return <Zap className="w-5 h-5 text-purple-400" />;
      default: return <Network className="w-5 h-5 text-slate-400" />;
    }
  };

  const borderClass = isResource 
    ? "border-emerald-500/50 shadow-emerald-500/20" 
    : "border-indigo-500/50 shadow-indigo-500/20";

  return (
    <div className={`px-4 py-3 shadow-lg rounded-xl bg-slate-900 border-2 ${borderClass} min-w-[160px] relative transition-transform hover:scale-105`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400 border-2 border-slate-900" />
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-950 rounded-lg shadow-inner">
          {getIcon()}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-100">{data.label}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
            {isResource ? 'Resource' : data.domain}
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400 border-2 border-slate-900" />
    </div>
  );
}
