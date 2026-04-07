import { DollarSign, Package, Users, Truck, Trucks} from "lucide-react";
import { MetricCard} from '../ui/MetricCard';
import { STATUS_CONFIG} from './constants';

export const DashboardTab = ({products, users, orders, orderRevenue}) => {
    const delivered = orders.filter(o => o.status === "delivered").length;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-4 gap-5">
                <MetricCard title="Order Revenue" value={`₱${orderRevenue.toLocaleString()}`} sub="+18.2% this month" icon={<DollarSign size={20} />} color="#10b981" glow="rgba(16,185,129,.15)" />
                <MetricCard title="Total Products" value={products.length} sub="+12% this month" icon={<Package size={20} />} color="#3b82f6" glow="rgba(59,130,246,.15)" />
                <MetricCard title="Total Users" value={users.length} sub="+8% this month" icon={<Users size={20} />} color="#8b5cf6" glow="rgba(139,92,246,.15)" />
                <MetricCard title="Delivered Orders" value={delivered} sub="+5% this month" icon={<Trucks size={20} />} color="#f59e0b" glow="rgba(245,158,11,.15)" />
            </div>

            <div className="grid grid-cold-3  gap-5">
                <div className="col-span-2 bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #e2e8f0"}}>
                    <div className="px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9"}}>
                        <h3 className="font-semibold text-slate-800 text-sm">Recent Orders</h3>
                    </div>
                     <div className="divide-y divide-slate-50">
                        {orders.slice(0,5).map(o => {
                            const cfg = STATUS_CONFIG[o.status];
                            return (
                                <div key={o.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg}}>
                                        <Truck size={16} className={cfg.color} />
                                    </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">{o.customer}</p>
                                            <p className="text-xs text-slate-500 truncate">{o.product}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">₱{o.amount.toLocaleString()}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full inline-block ${cfg.dot}`} /> {cfg.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                     </div>
                </div>
                <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #e2e8f0" }}>
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Order Status</h3>
          <div className="space-y-4">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const count = orders.filter(o => o.status === key).length;
              const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
              const fillMap = { amber: "#f59e0b", blue: "#3b82f6", violet: "#8b5cf6", emerald: "#10b981", rose: "#f43f5e" };
              const fillColor = fillMap[cfg.dot.split("-")[1]] || "#6366f1";
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} /><span className="text-xs font-medium text-slate-600">{cfg.label}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: fillColor }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ); 
};
           