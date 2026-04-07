import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ChartTooltip } from '../ui/ChartTooltip';
import { CHART_COLORS } from '../../constants/dashboardConstants';
import { MetricCard } from '../ui/MetricCard';
import { DollarSign, Tag, Layers, TrendingUp } from 'lucide-react';

export const InventoryChartsTab = ({ 
  chartView, setChartView, categoryData, brandData, 
  priceRangeData, topValueProducts, totalValue, avgPrice, maxPrice, minPrice 
}) => {
  return (
    <div className="space-y-6 fi">
      <div className="grid grid-cols-4 gap-5">
        <MetricCard title="Total Inventory Value" value={`₱${totalValue.toLocaleString()}`} icon={<DollarSign size={20} />} color="#6366f1" glow="rgba(99,102,241,.15)" />
        <MetricCard title="Average Price" value={`₱${avgPrice.toLocaleString()}`} icon={<Tag size={20} />} color="#8b5cf6" glow="rgba(139,92,246,.15)" />
        <MetricCard title="Highest Priced Item" value={`₱${maxPrice.toLocaleString()}`} icon={<TrendingUp size={20} />} color="#10b981" glow="rgba(16,185,129,.15)" />
        <MetricCard title="Lowest Priced Item" value={`₱${minPrice.toLocaleString()}`} icon={<Layers size={20} />} color="#f59e0b" glow="rgba(245,158,11,.15)" />
      </div>

      <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Inventory Analytics</h3>
            <p className="text-xs text-slate-500 mt-0.5">Visualize your product catalog distribution</p>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'category', label: 'Categories' },
              { id: 'brand', label: 'Brands' },
              { id: 'price', label: 'Price Ranges' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setChartView(tab.id)} className={`ctb ${chartView === tab.id ? 'ac' : ''}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === 'category' ? (
              <BarChart data={categoryData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip content={<ChartTooltip prefix="" suffix=" products" />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]} />
              </BarChart>
            ) : chartView === 'brand' ? (
              <BarChart data={brandData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip content={<ChartTooltip prefix="" suffix=" products" />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill={CHART_COLORS[1]} radius={[8, 8, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={priceRangeData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip content={<ChartTooltip prefix="" suffix=" items" />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill={CHART_COLORS[2]} radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #e2e8f0" }}>
        <h3 className="font-semibold text-slate-800 text-sm mb-4">Top Value Products</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={topValueProducts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} fill="rgba(99,102,241,.1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};