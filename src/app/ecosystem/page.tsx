'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function EcosystemMap() {
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    label: string;
    x: number;
    y: number;
    color: string;
    description: string;
  } | null>(null);

  const nodes = [
    { id: 'fcri', label: 'FCRI', x: 400, y: 300, color: 'gold', description: 'Civilization Research Institute' },
    { id: 'voltexfinance', label: 'VoltexFinance', x: 200, y: 150, color: 'gold-light', description: 'Autonomous financial engine' },
    { id: 'fusionveritas', label: 'Fusion Veritas', x: 600, y: 150, color: 'gold-light', description: 'Global account system' },
    { id: 'voltexbazar', label: 'VoltexBazar', x: 200, y: 450, color: 'gold-light', description: 'AI agent marketplace' },
    { id: 'brokenshield', label: 'Broken Shield', x: 600, y: 450, color: 'gold-light', description: 'Decentralized justice system' },
    { id: 'soulforge', label: 'Soulforge', x: 400, y: 600, color: 'gold-light', description: 'Artist economy & cultural resistance' },
    { id: 'aika', label: 'AIKA', x: 300, y: 200, color: 'gold-light', description: 'Core intelligence system' },
    { id: 'aether', label: 'AETHER', x: 500, y: 200, color: 'gold-light', description: 'System orchestrator' },
  ];

  const connections = [
    { from: 'fcri', to: 'voltexfinance' },
    { from: 'fcri', to: 'fusionveritas' },
    { from: 'fcri', to: 'voltexbazar' },
    { from: 'fcri', to: 'brokenshield' },
    { from: 'fcri', to: 'soulforge' },
    { from: 'fcri', to: 'aika' },
    { from: 'fcri', to: 'aether' },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            Ecosystem Map
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            The FCRI Civilization Stack
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            An interactive map showing how FCRI research translates into deployed systems.
          </p>
        </div>

        {/* Node Details Panel */}
        {selectedNode && (
          <div className="mt-12 bg-black/50 rounded-lg p-6 border border-gold/20">
            <h3 className="text-2xl font-semibold text-white mb-4">{selectedNode!.label}</h3>
            <p className="text-silver mb-4">{selectedNode!.description}</p>
            <div className="space-y-2">
              <p className="text-silver"><strong>Problem Solved:</strong> Decentralizing financial systems</p>
              <p className="text-silver"><strong>Powered By Research:</strong> Synaptic Economics, Proof-of-Justice</p>
              <p className="text-silver"><strong>Connections:</strong> Linked to 3 other systems in the stack</p>
              <p className="text-silver"><strong>Status:</strong> Active Deployment</p>
            </div>
            <Link href={`/${selectedNode!.id.toLowerCase().replace(' ', '')}`}>
              <a className="mt-4 inline-block px-4 py-2 bg-gold text-black font-medium text-sm hover:bg-gold-light">
                View System Details
              </a>
            </Link>
          </div>
        )}

        {/* Map Visualization */}
        <div className="mt-16 relative h-[600px]">
          <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
            {/* Connections */}
            {connections.map((conn, index) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;
              return (
                <line
                  key={index}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="var(--gold)"
                  strokeWidth="2"
                  opacity="0.5"
                  className="transition-opacity hover:opacity-100"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                onMouseEnter={() => setSelectedNode(node)}
                onMouseLeave={() => setSelectedNode(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={selectedNode?.id === node.id ? 20 : 16}
                  fill={selectedNode?.id === node.id ? node.color : 'var(--black-soft)'}
                  stroke={selectedNode?.id === node.id ? 'var(--gold)' : 'var(--gold-light)'}
                  strokeWidth={selectedNode?.id === node.id ? 3 : 2}
                  className="transition-all duration-300"
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={selectedNode?.id === node.id ? 'var(--black)' : 'var(--white)'}
                  fontSize="12"
                  fontWeight="600"
                  pointerEvents="none"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}