"use client";
import { useState } from "react";
import { BarChart3, Users, ArrowLeftRight, Shield, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Volume (30d)", value: "$2.4M", change: "+12.3%", icon: TrendingUp, positive: true },
  { label: "Active Users", value: "184", change: "+8", icon: Users, positive: true },
  { label: "Transactions", value: "1,247", change: "+34", icon: ArrowLeftRight, positive: true },
  { label: "Compliance Flags", value: "3", change: "-2", icon: AlertTriangle, positive: true },
];

const recentTransactions = [
  { id: "TXN001", org: "Apex Holdings", from: "USD", to: "AED", amount: "$45,000", status: "settled", compliance: "approved" },
  { id: "TXN002", org: "Nordic Ventures", from: "EUR", to: "USD", amount: "€120,000", status: "processing", compliance: "pending" },
  { id: "TXN003", org: "Gulf Partners", from: "USD", to: "EUR", amount: "$78,500", status: "pending", compliance: "approved" },
  { id: "TXN004", org: "Pacific Trust", from: "GBP", to: "USD", amount: "£33,000", status: "settled", compliance: "approved" },
  { id: "TXN005", org: "Atlas Capital", from: "USD", to: "GBP", amount: "$56,200", status: "failed", compliance: "flagged" },
];

const statusColors: Record<string, string> = {
  settled: "bg-emerald-500/20 text-emerald-400",
  processing: "bg-blue-500/20 text-blue-400",
  pending: "bg-gold/20 text-gold",
  failed: "bg-red-500/20 text-red-400",
};

const complianceColors: Record<string, string> = {
  approved: "text-emerald-400",
  pending: "text-gold",
  flagged: "text-red-400",
  rejected: "text-red-500",
};

export default function NRLinkAdmin() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/8 bg-black/60 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-gold/40 bg-gold/10 text-gold font-bold text-xs">NR</div>
            <div>
              <span className="text-sm font-semibold text-white">NRLink Admin</span>
              <span className="ml-3 text-xs text-silver/60">Operations Console</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              System Operational
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/8 bg-black/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-1">
            {["overview", "transactions", "compliance", "users", "treasury"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-gold text-gold"
                    : "border-transparent text-silver hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-white/3 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-silver/60">{s.label}</span>
                <s.icon className="h-4 w-4 text-gold/60" />
              </div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className={`mt-1 text-xs ${s.positive ? "text-emerald-400" : "text-red-400"}`}>
                {s.change} vs last period
              </div>
            </div>
          ))}
        </div>

        {/* Recent transactions */}
        <div className="rounded-xl border border-white/8 bg-white/3">
          <div className="flex items-center justify-between p-5 border-b border-white/8">
            <h2 className="font-semibold text-white">Recent Transactions</h2>
            <button className="text-xs text-gold hover:text-gold/80">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-silver/60 border-b border-white/8">
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Organization</th>
                  <th className="text-left p-4">Route</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="p-4 text-xs font-mono text-silver/60">{tx.id}</td>
                    <td className="p-4 text-sm text-white">{tx.org}</td>
                    <td className="p-4 text-sm text-silver">{tx.from} → {tx.to}</td>
                    <td className="p-4 text-sm font-medium text-white">{tx.amount}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`p-4 text-xs font-medium ${complianceColors[tx.compliance]}`}>
                      {tx.compliance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
