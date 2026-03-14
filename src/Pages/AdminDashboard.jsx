import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Edit, 
  Search,
  LogOut
} from "lucide-react";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Auth token
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api/products";

  // 1. Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete Product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistic update: filter out the deleted product from state
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete product. Check permissions.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-800 flex items-center gap-2">
          <ShoppingCart className="text-blue-400" /> AdminPro
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<Package size={20}/>} label="Products" />
          <NavItem icon={<Users size={20}/>} label="Customers" />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition w-full">
            <LogOut size={20}/> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* TOP BAR */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <Plus size={18} /> Add Product
          </button>
        </header>

        <div className="p-8">
          {/* STATS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard label="Total Products" value={products.length} color="bg-blue-500" />
            <StatCard label="Low Stock" value="4" color="bg-amber-500" />
            <StatCard label="Total Value" value={`₱ ${products.reduce((acc, curr) => acc + (curr.price || 0), 0).toLocaleString()}`} color="bg-emerald-500" />
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
              <span className="text-sm text-gray-500 font-medium">{filteredProducts.length} items shown</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4">Brand</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-400">Loading products...</td></tr>
                  ) : filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-400 font-mono italic">#{product.id}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium uppercase">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        ₱ {Number(product.price).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit">
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition" 
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <Package className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500 text-lg">No products found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Components for Cleaner Code
const NavItem = ({ icon, label, active = false }) => (
  <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
    active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-slate-800 hover:text-white"
  }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </a>
);

const StatCard = ({ label, value, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
      <Package size={24}/>
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;