import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  LayoutDashboard, Package, Users, ShoppingCart, 
  Plus, Trash2, Edit, Search, LogOut, X, AlertCircle,
  TrendingUp, DollarSign
} from "lucide-react";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Inventory"); 
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", brand: "", category: "", subcategory: "", price: "", image: ""
  });

  const API_URL = "http://localhost:3000/api/products";
  const USER_API_URL = "http://localhost:3000/api/users";
  const token = localStorage.getItem("token");

  // --- LOGOUT ---
  const handleLogout = () => {
    if (window.confirm("Confirm sign out?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  // --- DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "Inventory") {
        const res = await axios.get(API_URL);
        setProducts(res.data);
      } else if (activeTab === "Users") {
        try {
          const res = await axios.get(USER_API_URL, { headers: { Authorization: `Bearer ${token}` } });
          setUsers(res.data);
        } catch {
          setUsers([{ id: 1, name: "Admin User", email: "joseph@gmail.com", role: "Superadmin" }]);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  // --- ACTIONS ---
  const handleDelete = async (id) => {
    if (!window.confirm("This will permanently delete this item.")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(products.filter(p => (p._id || p.id) !== id));
    } catch (err) {
      alert("Session expired or Server error.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${editId}`, formData, config);
      } else {
        await axios.post(API_URL, formData, config);
      }
      fetchData(); 
      closeModal();
    } catch (err) {
      alert("Error saving. Ensure all fields are valid.");
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: "", brand: "", category: "", subCategory: "", price: "", image: "" });
    setShowModal(true);
  };

  const openEditModal = (p) => {
  setIsEditing(true);
  setEditId(p._id || p.id);
  setFormData({ 
    name: p.name || "", 
    brand: p.brand || "", 
    category: p.category || "", 
    subcategory: p.subcategory || p.subCategory || "", // Check both to be safe
    price: p.price || "", 
    image: p.image || "" 
  });
  setShowModal(true);
};

  const closeModal = () => setShowModal(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDER CONTENT ENGINE ---
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <StatCard title="Total Revenue" value="₱128,430" icon={<DollarSign/>} color="bg-green-500" />
            <StatCard title="Total Products" value={products.length} icon={<Package/>} color="bg-blue-500" />
            <StatCard title="Active Users" value={users.length} icon={<Users/>} color="bg-purple-500" />
            <div className="md:col-span-3 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18}/> System Overview</h3>
              <div className="h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                Analytics Chart Placeholder
              </div>
            </div>
          </div>
        );

      case "Users":
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{u.name}</td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-bold">{u.role}</span></td>
                    <td className="px-6 py-4 text-right"><button className="text-blue-600 font-semibold hover:underline">Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category & Sub</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="4" className="py-20 text-center text-gray-400 animate-pulse">Loading data...</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan="4" className="py-20 text-center text-gray-400">No matches found.</td></tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p._id || p.id} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-400 font-medium">{p.brand}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="bg-blue-50 text-blue-600 w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border border-blue-100">{p.category}</span>
                            <span className="text-slate-400 text-[11px] font-medium ml-1">{p.subcategory || "No Subcategory"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-700 text-base">₱{Number(p.price).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => openEditModal(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={16}/></button>
                          <button onClick={() => handleDelete(p._id || p.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] text-white hidden lg:flex flex-col border-r border-slate-800">
        <div className="p-8 text-2xl font-black tracking-tighter flex items-center gap-3 italic">
          <div className="bg-blue-600 p-2 rounded-xl not-italic shadow-lg shadow-blue-500/20"><ShoppingCart size={24} /></div>
          JT <span className="text-blue-500">ADMIN</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={19}/>} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
          <NavItem icon={<Package size={19}/>} label="Inventory" active={activeTab === "Inventory"} onClick={() => setActiveTab("Inventory")} />
          <NavItem icon={<Users size={19}/>} label="Users" active={activeTab === "Users"} onClick={() => setActiveTab("Users")} />
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold">
            <LogOut size={19} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b h-20 flex items-center justify-between px-8 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{activeTab}</h1>
            <p className="text-xs text-slate-400 font-medium italic">Store Management Portal</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === "Inventory" && (
              <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 uppercase tracking-wider">
                <Plus size={18} /> New Product
              </button>
            )}
          </div>
        </header>

        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      {/* MODAL - FIXED INPUT MAPPING */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-xl text-slate-800 tracking-tight uppercase">{isEditing ? "Edit Item" : "Create Item"}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Title</label>
                <input required className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (PHP)</label>
                  <input type="number" required className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand</label>
                  <input className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                  <input className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subcategory</label>
                  {/* FIXED: This input was likely pointing to 'price' before */}
                  <input className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white" value={formData.subCategory} onChange={(e) => setFormData({...formData, subCategory: e.target.value})}/>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 text-sm font-black bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 uppercase">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- REUSABLE COMPONENTS ---
const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm w-full transition-all duration-300 font-bold ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40" : "text-slate-500 hover:bg-slate-800/50 hover:text-white"}`}>
    {icon} {label}
  </button>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
    <div className={`${color} p-3.5 rounded-2xl text-white shadow-xl shadow-inherit/20`}>{icon}</div>
  </div>
);

export default AdminDashboard;