import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import axios from 'axios';
import dagre from 'dagre';

const domainColors: Record<string, string> = {
  'OS': '#4facfe',
  'DBMS': '#ff0844',
  'Networks': '#00f2fe',
  'OOP': '#f6d365',
  'DSA': '#84fab0',
};

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 150 });
  
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 50 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = direction === 'TB' ? 'top' : 'left';
    node.sourcePosition = direction === 'TB' ? 'bottom' : 'right';
    node.position = {
      x: nodeWithPosition.x - 100,
      y: nodeWithPosition.y - 25,
    };
  });

  return { nodes, edges };
};

export default function GraphVisualization() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedConcept, setSelectedConcept] = useState<any>(null);
  const [filterDomain, setFilterDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [allConcepts, setAllConcepts] = useState<any[]>([]);

  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
    try {
      const response = await axios.get('/api/concepts');
      const concepts = response.data;
      setAllConcepts(concepts);
      updateGraphView(concepts, filterDomain, searchQuery);
    } catch (error) {
      console.error('Failed to fetch graph data.', error);
    }
  };

  useEffect(() => {
    updateGraphView(allConcepts, filterDomain, searchQuery);
  }, [filterDomain, searchQuery, allConcepts]);

  const updateGraphView = (concepts: any[], domain: string, query: string) => {
    let filtered = concepts.filter(c => {
      const matchesDomain = domain === 'All' || c.domain === domain;
      const matchesSearch = c.name.toLowerCase().includes(query.toLowerCase());
      return matchesDomain && matchesSearch;
    });

    const newNodes = filtered.map((c: any) => ({
      id: c.id,
      position: { x: 0, y: 0 },
      data: { label: c.name, domain: c.domain },
      style: {
        backgroundColor: domainColors[c.domain] || '#eee',
        color: '#333',
        border: '1px solid #222',
        padding: '10px',
        borderRadius: '8px',
        fontWeight: 'bold',
        width: 180,
        textAlign: 'center'
      }
    }));
    
    const newEdges: any[] = [];
    filtered.forEach((c: any) => {
      if (c.prerequisites) {
        c.prerequisites.forEach((p: any) => {
          // Check if prerequisite is also in the filtered nodes
          if(filtered.find(f => f.id === p.id)) {
            newEdges.push({
              id: "e-" + p.id + "-" + c.id,
              source: p.id,
              target: c.id,
              label: 'PREREQUISITE_OF',
              animated: true,
              style: { stroke: '#ff0072', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#ff0072' },
            });
          }
        });
      }
      if (c.relatedConcepts) {
        c.relatedConcepts.forEach((r: any) => {
          if(filtered.find(f => f.id === r.id)) {
            newEdges.push({
              id: "e-" + c.id + "-" + r.id,
              source: c.id,
              target: r.id,
              label: 'RELATED_TO',
              style: { strokeDasharray: '5 5', stroke: '#555' },
            });
          }
        });
      }
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  };

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = async (_: any, node: any) => {
    try {
      const response = await axios.get('/api/concepts/' + node.id + '/graph');
      setSelectedConcept(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar for Selection */}
      <div style={{ width: '350px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #ccc', backgroundColor: 'white', zIndex: 10 }}>
        
        {/* Filters Area */}
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>Knowledge Graph</h2>
          <input 
            type="text" 
            placeholder="Search concepts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
          <select 
            value={filterDomain} 
            onChange={(e) => setFilterDomain(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
          >
            <option value="All">All Domains</option>
            <option value="OS">Operating Systems</option>
            <option value="DBMS">DBMS</option>
            <option value="Networks">Networks</option>
            <option value="OOP">OOP</option>
            <option value="DSA">DSA</option>
          </select>
        </div>

        {/* Selected Concept Area */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {selectedConcept ? (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedConcept.concept.name}</h3>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                <span style={{ fontWeight: 'bold', color: domainColors[selectedConcept.concept.domain] }}>{selectedConcept.concept.domain}</span> • {selectedConcept.concept.difficulty}
              </p>
              <p style={{ marginTop: '15px', fontSize: '14px', lineHeight: '1.5' }}>{selectedConcept.concept.description}</p>
              
              <div style={{ marginTop: '15px' }}>
                <strong>Tags:</strong> {selectedConcept.concept.tags?.join(', ')}
              </div>

              <h4 style={{ marginTop: '20px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Prerequisites:</h4>
              <ul style={{ fontSize: '14px', paddingLeft: '20px', marginTop: '10px', listStyleType: 'circle' }}>
                {selectedConcept.prerequisites?.length > 0 ? 
                  selectedConcept.prerequisites.map((p: any) => <li key={p.id} style={{marginBottom: '5px'}}>{p.name}</li>) : 
                  <li>None</li>}
              </ul>

              <h4 style={{ marginTop: '20px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Related Concepts:</h4>
              <ul style={{ fontSize: '14px', paddingLeft: '20px', marginTop: '10px', listStyleType: 'circle' }}>
                {selectedConcept.related?.length > 0 ? 
                  selectedConcept.related.map((r: any) => <li key={r.id} style={{marginBottom: '5px'}}>{r.name}</li>) : 
                  <li>None</li>}
              </ul>
            </div>
          ) : (
            <div style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Select a node in the graph to view details.</div>
          )}
          {selectedConcept?.resources && selectedConcept.resources.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-400">Learning Resources</h3>
              <ul className="space-y-2">
                {selectedConcept.resources.map((r: any) => (
                  <li key={r.id}>
                    <Link to={"/resources/" + r.id} className="flex items-start gap-2 rounded-lg border border-slate-700 bg-slate-800 p-2 text-sm hover:border-indigo-500 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium text-slate-200">{r.title}</div>
                        <div className="text-xs text-slate-400">{r.resourceType} • {r.difficulty}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-400">Research Papers</h3>
            <p className="text-sm text-slate-500 italic">None yet</p>
          </div>
          
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-400">Coding Problems</h3>
            <p className="text-sm text-slate-500 italic">None yet</p>
          </div>
        </div>
      </div>

      {/* React Flow Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-right"
        >
          <Controls />
          <MiniMap />
          <Background gap={16} size={1} color="#f1f1f1" />
        </ReactFlow>
      </div>
    </div>
  );
}





