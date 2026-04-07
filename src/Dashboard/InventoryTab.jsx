import React from 'react';
import { Edit, Trash2, Package } from 'lucide-react';

export const InventoryTab = ({ loading, filteredProducts, openEditModal, handleDelete }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden fi" style={{ border: "1px solid #e2e8f0" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><div className="sh h-4 w-40 rounded"></div></td>
                  <td className="px-6 py-4"><div className="sh h-4 w-20 rounded"></div></td>
                  <td className="px-6 py-4"><div className="sh h-4 w-24 rounded"></div></td>
                  <td className="px-6 py-4"><div className="sh h-4 w-16 rounded"></div></td>
                  <td className="px-6 py-4 text-right"><div className="sh h-8 w-16 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  <Package size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="font-medium">No products found</p>
                  <p className="text-xs mt-0.5">Try searching for something else</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{product.name}</div>
                    <div className="text-xs text-slate-500">{product.subcategory}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{product.brand}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{product.category}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800 text-sm">₱{product.price?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(product)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};