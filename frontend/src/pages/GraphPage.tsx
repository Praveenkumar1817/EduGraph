import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import axios from 'axios';
import dagre from 'dagre';
import { Link } from 'react-router-dom';
import CustomNode from '../components/CustomNode';
import { Layers, X, BookOpen, ExternalLink, Network, FileText, LayoutDashboard } from 'lucide-react';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - 200 / 2,
        y: nodeWithPosition.y - 80 / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

export default function GraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedConcept, setSelectedConcept] = useState<any>(null);
  const [filterDomain, setFilterDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [allConcepts, setAllConcepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const domains = ['All', 'OS', 'DBMS', 'Computer Networks', 'OOP', 'DSA'];

  useEffect(() => {
    fetchConcepts();
  }, [filterDomain, searchQuery]);

  const fetchConcepts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/concepts');
      let data = res.data;

      if (filterDomain !== 'All') {
        data = data.filter((c: any) => c.domain === filterDomain);
      }
      
      if (searchQuery) {
        data = data.filter((c: any) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      setAllConcepts(data);

      const initialNodes = data.map((c: any) => ({
        id: c.id,
        type: 'custom',
        data: { label: c.name, domain: c.domain, type: 'Concept' },
        position: { x: 0, y: 0 },
      }));

      const initialEdges: any[] = [];
      data.forEach((c: any) => {
        if (c.prerequisites) {
          c.prerequisites.forEach((p: any) => {
            if (data.find((x: any) => x.id === p.id)) {
              initialEdges.push({
                id: `e-${p.id}-${c.id}`,
                source: p.id,
                target: c.id,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#6366f1', strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
              });
            }
          });
        }
      });

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges
      );

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onNodeClick = async (event: React.MouseEvent, node: any) => {
    if (node.data.type === 'Concept') {
      try {
        const response = await axios.get(`/api/concepts/${node.id}/graph`);
        setSelectedConcept(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const clearSelection = () => setSelectedConcept(null);

  return (
    <div className="w-full h-full relative bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-950"
      >
        <Background color="#1e293b" gap={20} size={1.5} />
        <Controls className="bg-slate-900 border-slate-800 fill-slate-300" />
        <MiniMap 
          nodeColor={(n) => '#6366f1'} 
          maskColor="rgba(2, 6, 23, 0.8)" 
          className="bg-slate-900 border border-slate-800 rounded-lg" 
        />
        
        <Panel position="top-left" className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-xl m-4 w-80">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Graph Controls
          </h2>
          
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Search Concepts</label>
            <input
              type="text"
              placeholder="E.g., Deadlock, Mutex..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Filter by Domain</label>
            <div className="flex flex-wrap gap-2">
              {domains.map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDomain(d)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterDomain === d ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        {selectedConcept && (
          <Panel position="top-right" className="m-4 w-96 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Network className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white leading-tight">{selectedConcept.concept.name}</h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded-sm">{selectedConcept.concept.domain}</span>
                </div>
              </div>
              <button onClick={clearSelection} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto custom-scrollbar">
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</h3>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">{selectedConcept.concept.description}</p>
              </div>

              {selectedConcept.prerequisites && selectedConcept.prerequisites.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> Prerequisites</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedConcept.prerequisites.map((p: any) => (
                      <span key={p.id} className="bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-md text-xs font-medium hover:border-indigo-500 transition-colors cursor-pointer">{p.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedConcept?.resources && selectedConcept.resources.length > 0 && (
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Learning Resources</h3>
                  <ul className="space-y-3">
                    {selectedConcept.resources.map((r: any) => (
                      <li key={r.id}>
                        <Link to={`/resources/${r.id}`} className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3 hover:bg-slate-800 hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-indigo-500/10">
                          <div className="p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20 mt-0.5">
                            <FileText className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-slate-200 group-hover:text-indigo-400 transition-colors mb-0.5">{r.title}</div>
                            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500">{r.resourceType} • {r.difficulty}</div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
