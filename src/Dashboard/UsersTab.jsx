import React from 'react';
import { Users } from 'lucide-react';

export const UsersTab = ({ users, loading }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden fi" style={{ border: "1px solid #e2e8f0" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><div className="sh h-4 w-40 rounded"></div></td>
                  <td className="px-6 py-4"><div className="sh h-4 w-20 rounded"></div></td>
                  <td className="px-6 py-4"><div className="sh h-4 w-16 rounded"></div></td>
                  <td className="px-6 py-4"><div className="sh h-4 w-24 rounded"></div></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                  <Users size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="font-medium">No users found</p>
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{user.role || 'Customer'}</td>
                  <td className="px-6 py-4">
                    <span className="sp text-emerald-600 bg-emerald-50 border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{user.created_at || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};