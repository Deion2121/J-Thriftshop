import React from 'react';
import { STATUS_CONFIG } from '../../constants/dashboardConstants';
import { MapPin, Clock, Tag, Box } from 'lucide-react';

export const OrdersTab = ({ orders, orderCounts, orderFilter, setOrderFilter, selectedOrder, setSelectedOrder, updateOrderStatus }) => {
  return (
    <div className="grid grid-cols-12 gap-6 fi">
      <div className="col-span-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 space-y-1" style={{ border: "1px solid #e2e8f0" }}>
          {Object.entries({ all: 'All Orders', pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }).map(([key, label]) => (
            <button key={key} onClick={() => setOrderFilter(key)} className={`w-full text-left px-4 py-2 text-sm font-medium rounded-xl flex justify-between items-center transition-colors ${orderFilter === key ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span>{label}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${orderFilter === key ? 'bg-indigo-100' : 'bg-slate-100 text-slate-500'}`}>{orderCounts[key]}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl overflow-hidden max-h-[500px] overflow-y-auto sb" style={{ border: "1px solid #e2e8f0" }}>
          {orders.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">No orders found</div>
          ) : (
            orders.map(order => {
              const cfg = STATUS_CONFIG[order.status];
              return (
                <div key={order.id} onClick={() => setSelectedOrder(order)} className={`or p-4 border-b border-slate-100 last:border-0 ${selectedOrder?.id === order.id ? 'sel' : ''}`}>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-sm text-slate-800">{order.id}</span>
                    <span className="text-xs text-slate-500">{order.date}</span>
                  </div>
                  <div className="text-sm text-slate-600">{order.customer}</div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-sm text-slate-800">₱{order.amount.toLocaleString()}</span>
                    <span className={`sp ${cfg.color} ${cfg.bg} ${cfg.border}`}><span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="col-span-8">
        {selectedOrder ? (
          <div className="bg-white rounded-2xl p-6 space-y-6 fi" style={{ border: "1px solid #e2e8f0" }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{selectedOrder.id}</h3>
                <p className="text-sm text-slate-500">Placed on {selectedOrder.date}</p>
              </div>
              <div className="flex gap-2">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(statusKey => {
                  const cfg = STATUS_CONFIG[statusKey];
                  const Icon = cfg.icon;
                  return (
                    <button key={statusKey} onClick={() => updateOrderStatus(selectedOrder.id, statusKey)} className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${selectedOrder.status === statusKey ? `${cfg.bg} ${cfg.color} ${cfg.border}` : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`} title={`Mark as ${cfg.label}`}>
                      <Icon size={16} />
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0"><Clock size={16} /></div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Status</div>
                    <div className="text-sm font-medium text-slate-800">{STATUS_CONFIG[selectedOrder.status].label}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0"><MapPin size={16} /></div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Shipping Address</div>
                    <div className="text-sm font-medium text-slate-800">{selectedOrder.address}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0"><Tag size={16} /></div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Customer</div>
                    <div className="text-sm font-medium text-slate-800">{selectedOrder.customer}</div>
                    <div className="text-xs text-slate-500">{selectedOrder.email}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0"><Box size={16} /></div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Tracking Number</div>
                    <div className="text-sm font-medium text-slate-800">{selectedOrder.tracking}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Product</p>
                <p className="text-sm font-medium text-slate-800">{selectedOrder.product}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-semibold">Total Amount</p>
                <p className="font-bold text-lg text-slate-900">₱{selectedOrder.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center text-slate-500 h-full flex flex-col justify-center items-center" style={{ border: "1px solid #e2e8f0" }}>
            <Box size={40} className="text-slate-300 mb-3" />
            <p className="font-medium">No order selected</p>
            <p className="text-xs mt-0.5">Select an order from the list to view its details.</p>
          </div>
        )}
      </div>
    </div>
  );
};