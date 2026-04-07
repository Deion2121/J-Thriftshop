import {ArrowUpRight} from "lucide-react";

export const MetricCard = ({ title, value, sub, icon, color, glow }) => (
    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: glow, color }}>{icon}</div>
            <ArrowUpRight size={14} className="text-slate-300 mt-1"/>
        </div>
        <p className="text-slate-500 text-xs font-medium">{title}</p>
        <p className="font-bold text-2xl text-slate-800 mt-1">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
);