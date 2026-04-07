import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import {
  LayoutDashboard, Package, Users, ShoppingCart,
  Plus, Trash2, Edit, Search, LogOut, X,
  DollarSign, ChevronRight, ChevronDown, Settings, UserCog,
  Truck, Clock, CheckCircle2, XCircle, AlertCircle, MapPin,
  ArrowUpRight, RefreshCw, Hourglass, BarChart2, TrendingUp,
  Tag, Layers
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar, LabelList
} from "recharts";

// ─── Constants ────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:    { label:"Pending",    color:"text-amber-600",   bg:"bg-amber-50",   border:"border-amber-200",   dot:"bg-amber-400",   icon:Hourglass   },
  processing: { label:"Processing", color:"text-blue-600",    bg:"bg-blue-50",    border:"border-blue-200",    dot:"bg-blue-400",    icon:RefreshCw   },
  shipped:    { label:"Shipped",    color:"text-violet-600",  bg:"bg-violet-50",  border:"border-violet-200",  dot:"bg-violet-400",  icon:Truck       },
  delivered:  { label:"Delivered",  color:"text-emerald-600", bg:"bg-emerald-50", border:"border-emerald-200", dot:"bg-emerald-400", icon:CheckCircle2},
  cancelled:  { label:"Cancelled",  color:"text-rose-600",    bg:"bg-rose-50",    border:"border-rose-200",    dot:"bg-rose-400",    icon:XCircle     },
};

const MOCK_ORDERS = [
  { id:"ORD-2024-001", customer:"Maria Santos",    email:"maria@email.com",  product:"Sony WH-1000XM5",      amount:18990,  status:"delivered",  date:"2024-07-10", address:"Makati City, Metro Manila",   tracking:"PHL-TRK-88201" },
  { id:"ORD-2024-002", customer:"Juan dela Cruz",  email:"juan@email.com",   product:"Apple iPhone 15 Pro",  amount:74990,  status:"shipped",    date:"2024-07-12", address:"Quezon City, Metro Manila",   tracking:"PHL-TRK-88202" },
  { id:"ORD-2024-003", customer:"Ana Reyes",       email:"ana@email.com",    product:"Samsung Galaxy S24",   amount:54990,  status:"processing", date:"2024-07-13", address:"Cebu City, Cebu",             tracking:"PHL-TRK-88203" },
  { id:"ORD-2024-004", customer:"Pedro Bautista",  email:"pedro@email.com",  product:"Logitech MX Master 3", amount:5990,   status:"pending",    date:"2024-07-14", address:"Davao City, Davao del Sur",   tracking:"PHL-TRK-88204" },
  { id:"ORD-2024-005", customer:"Rosa Garcia",     email:"rosa@email.com",   product:"iPad Air M2",          amount:42990,  status:"cancelled",  date:"2024-07-08", address:"Pasig City, Metro Manila",    tracking:"PHL-TRK-88205" },
  { id:"ORD-2024-006", customer:"Carlo Mendoza",   email:"carlo@email.com",  product:"Dyson V15 Detect",     amount:37990,  status:"delivered",  date:"2024-07-09", address:"Taguig City, Metro Manila",   tracking:"PHL-TRK-88206" },
  { id:"ORD-2024-007", customer:"Liza Villanueva", email:"liza@email.com",   product:"MacBook Air M3",       amount:84990,  status:"shipped",    date:"2024-07-13", address:"Mandaluyong, Metro Manila",   tracking:"PHL-TRK-88207" },
  { id:"ORD-2024-008", customer:"Mark Aquino",     email:"mark@email.com",   product:"Razer Blade 16",       amount:139990, status:"processing", date:"2024-07-14", address:"Antipolo, Rizal",             tracking:"PHL-TRK-88208" },
];

const MOCK_PRODUCTS = [
  { id:1,  name:"Sony WH-1000XM5",      brand:"Sony",     category:"Audio",       subcategory:"Headphones", price:18990  },
  { id:2,  name:"Apple iPhone 15 Pro",  brand:"Apple",    category:"Mobile",      subcategory:"Smartphone", price:74990  },
  { id:3,  name:"Samsung Galaxy S24",   brand:"Samsung",  category:"Mobile",      subcategory:"Smartphone", price:54990  },
  { id:4,  name:"Logitech MX Master 3", brand:"Logitech", category:"Peripherals", subcategory:"Mouse",      price:5990   },
  { id:5,  name:"iPad Air M2",          brand:"Apple",    category:"Tablets",     subcategory:"iPad",       price:42990  },
  { id:6,  name:"Dyson V15 Detect",     brand:"Dyson",    category:"Appliances",  subcategory:"Vacuum",     price:37990  },
  { id:7,  name:"MacBook Air M3",       brand:"Apple",    category:"Laptops",     subcategory:"MacBook",    price:84990  },
  { id:8,  name:"Razer Blade 16",       brand:"Razer",    category:"Laptops",     subcategory:"Gaming",     price:139990 },
  { id:9,  name:"Samsung 4K Monitor",   brand:"Samsung",  category:"Monitors",    subcategory:"4K",         price:24990  },
  { id:10, name:"JBL Flip 6",           brand:"JBL",      category:"Audio",       subcategory:"Speaker",    price:4990   },
  { id:11, name:"Apple Watch S9",       brand:"Apple",    category:"Wearables",   subcategory:"Smartwatch", price:22990  },
  { id:12, name:"Keychron K8 Pro",      brand:"Keychron", category:"Peripherals", subcategory:"Keyboard",   price:7990   },
];

const TRACKING_STEPS = [
  { key:"pending",    label:"Order Placed",    desc:"Your order has been received" },
  { key:"processing", label:"Processing",       desc:"Preparing your items"         },
  { key:"shipped",    label:"Out for Delivery", desc:"Package is on its way"        },
  { key:"delivered",  label:"Delivered",        desc:"Package has been delivered"   },
];
const STATUS_ORDER    = ["pending","processing","shipped","delivered"];
const CHART_COLORS    = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#f43f5e","#ec4899","#84cc16"];

// ─── Tooltip ─────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, prefix="₱", suffix="" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:12, padding:"10px 14px", boxShadow:"0 8px 24px rgba(0,0,0,.3)" }}>
      {label && <p style={{ color:"#94a3b8", fontSize:11, marginBottom:4, fontWeight:600 }}>{label}</p>}
      {payload.map((p,i)=>(
        <p key={i} style={{ color:p.color||"#a5b4fc", fontSize:13, fontWeight:700, margin:0 }}>
          {prefix}{typeof p.value==="number"?p.value.toLocaleString():p.value}{suffix}
        </p>
      ))}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [products,       setProducts      ] = useState([]);
  const [users,          setUsers         ] = useState([]);
  const [orders,         setOrders        ] = useState(MOCK_ORDERS);
  const [loading,        setLoading       ] = useState(true);
  const [searchTerm,     setSearchTerm    ] = useState("");
  const [activeTab,      setActiveTab     ] = useState("Dashboard");
  const [showModal,      setShowModal     ] = useState(false);
  const [isEditing,      setIsEditing     ] = useState(false);
  const [editId,         setEditId        ] = useState(null);
  const [isProfileOpen,  setIsProfileOpen ] = useState(false);
  const [selectedOrder,  setSelectedOrder ] = useState(null);
  const [orderFilter,    setOrderFilter   ] = useState("all");
  const [chartView,      setChartView     ] = useState("category");

  const [adminProfile] = useState({ username:"Admin User", role:"Store Manager", email:"admin@jtstore.com" });
  const [formData, setFormData] = useState({ name:"", brand:"", category:"", subcategory:"", price:"", image:"" });

  const dropdownRef = useRef(null);
  const API_URL      = "http://localhost:3000/api/products";
  const USER_API_URL = "http://localhost:3000/api/users";
  const token        = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodRes = await axios.get(API_URL);
      setProducts(prodRes.data);
      if (activeTab === "Users") {
        const userRes = await axios.get(USER_API_URL, { headers: { Authorization:`Bearer ${token}` } });
        setUsers(userRes.data);
      }
    } catch {
      setProducts(MOCK_PRODUCTS); // fallback for charts demo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeTab]);

  const handleLogout  = () => { localStorage.clear(); window.location.href = "/"; };
  const handleDelete  = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization:`Bearer ${token}` } });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch { alert("Delete failed"); }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cfg = { headers: { Authorization:`Bearer ${token}` } };
      if (isEditing) await axios.put(`${API_URL}/${editId}`, formData, cfg);
      else           await axios.post(API_URL, formData, cfg);
      fetchData(); setShowModal(false);
    } catch { alert("Save failed"); }
  };
  const openEditModal = (p) => { setIsEditing(true); setEditId(p.id); setFormData({...p}); setShowModal(true); };
  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id===id ? {...o,status} : o));
    if (selectedOrder?.id===id) setSelectedOrder(prev => ({...prev,status}));
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOrders = orders.filter(o =>
    (orderFilter==="all" || o.status===orderFilter) &&
    (o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     o.product.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const orderRevenue = orders.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+o.amount,0);
  const orderCounts  = {
    all:orders.length,
    pending:   orders.filter(o=>o.status==="pending").length,
    processing:orders.filter(o=>o.status==="processing").length,
    shipped:   orders.filter(o=>o.status==="shipped").length,
    delivered: orders.filter(o=>o.status==="delivered").length,
    cancelled: orders.filter(o=>o.status==="cancelled").length,
  };

  // ── Inventory chart data (derived once) ──────────────────────────
  const categoryData = useMemo(()=>{
    const map={};
    products.forEach(p=>{
      const c=p.category||"Other";
      if (!map[c]) map[c]={name:c,count:0,totalValue:0};
      map[c].count++; map[c].totalValue+=Number(p.price||0);
    });
    return Object.values(map).map(d=>({...d,avgPrice:Math.round(d.totalValue/d.count)})).sort((a,b)=>b.count-a.count);
  },[products]);

  const brandData = useMemo(()=>{
    const map={};
    products.forEach(p=>{
      const b=p.brand||"Unknown";
      if (!map[b]) map[b]={name:b,count:0,totalValue:0};
      map[b].count++; map[b].totalValue+=Number(p.price||0);
    });
    return Object.values(map).sort((a,b)=>b.count-a.count).slice(0,8);
  },[products]);

  const priceRangeData = useMemo(()=>{
    const ranges=[
      {name:"< ₱5K",   min:0,     max:5000,    count:0},
      {name:"₱5–15K",  min:5000,  max:15000,   count:0},
      {name:"₱15–30K", min:15000, max:30000,   count:0},
      {name:"₱30–60K", min:30000, max:60000,   count:0},
      {name:"₱60–100K",min:60000, max:100000,  count:0},
      {name:"> ₱100K", min:100000,max:Infinity,count:0},
    ];
    products.forEach(p=>{ const price=Number(p.price||0); const r=ranges.find(r=>price>=r.min&&price<r.max); if(r) r.count++; });
    return ranges;
  },[products]);

  const topValueProducts = useMemo(()=>
    [...products].sort((a,b)=>Number(b.price||0)-Number(a.price||0)).slice(0,8)
      .map(p=>({name:p.name.length>18?p.name.slice(0,18)+"…":p.name, price:Number(p.price||0), brand:p.brand}))
  ,[products]);

  const totalValue    = products.reduce((s,p)=>s+Number(p.price||0),0);
  const avgPrice      = products.length ? Math.round(totalValue/products.length) : 0;
  const maxPrice      = products.length ? Math.max(...products.map(p=>Number(p.price||0))) : 0;
  const minPrice      = products.length ? Math.min(...products.map(p=>Number(p.price||0))) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
        *{box-sizing:border-box}body{margin:0}
        .db{font-family:'DM Sans',sans-serif}
        .fd{font-family:'Syne',sans-serif}
        .ch{transition:transform .2s,box-shadow .2s}.ch:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.08)}
        .sp{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.04em;border-width:1px;border-style:solid}
        .fi{animation:fi .25s ease}@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .sh{background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);background-size:200% 100%;animation:sh 1.5s infinite}@keyframes sh{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .nai{position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:60%;background:#818cf8;border-radius:0 3px 3px 0}
        .sb::-webkit-scrollbar{width:4px}.sb::-webkit-scrollbar-track{background:transparent}.sb::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}
        .or{cursor:pointer;transition:background .15s}.or:hover{background:#f8fafc}.or.sel{background:#eef2ff}
        .pb{height:4px;background:#e2e8f0;border-radius:4px;overflow:hidden;margin-top:6px}.pf{height:100%;border-radius:4px;transition:width .6s ease}
        .ctb{padding:6px 14px;border-radius:10px;font-size:12px;font-weight:600;transition:all .15s;border:1.5px solid transparent;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
        .ctb.ac{background:#eef2ff;color:#6366f1;border-color:#c7d2fe}.ctb:not(.ac){background:transparent;color:#64748b;border-color:#e2e8f0}.ctb:not(.ac):hover{background:#f8fafc;border-color:#cbd5e1}
        .recharts-cartesian-grid line{stroke:#f1f5f9}
      `}</style>

      <div className="db flex min-h-screen bg-slate-50 text-slate-900">

        {/* ── SIDEBAR ─────────────────────── */}
        <aside className="w-64 flex-shrink-0 bg-slate-950 flex flex-col" style={{borderRight:"1px solid rgba(99,102,241,.12)"}}>
          <div className="p-6 pb-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
              <ShoppingCart size={18} className="text-white"/>
            </div>
            <div>
              <span className="fd text-white font-bold text-lg tracking-tight leading-none block">JT STORE</span>
              <span className="text-xs text-slate-500 font-medium">Admin Console</span>
            </div>
          </div>
          <div className="px-6 py-3">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Navigation</p>
          </div>
          <nav className="flex-1 px-3 space-y-0.5">
            {[
              {label:"Dashboard",        icon:<LayoutDashboard size={18}/>},
              {label:"Inventory",        icon:<Package size={18}/>},
              {label:"Inventory Charts", icon:<BarChart2 size={18}/>},
              {label:"Orders",           icon:<Truck size={18}/>, badge:orderCounts.pending+orderCounts.processing},
              {label:"Users",            icon:<Users size={18}/>},
            ].map(item=>(
              <SidebarItem key={item.label} {...item} active={activeTab===item.label}
                onClick={()=>{setActiveTab(item.label);setSelectedOrder(null);}}/>
            ))}
          </nav>
          <div className="p-4 m-3 rounded-xl" style={{background:"rgba(99,102,241,.06)",border:"1px solid rgba(99,102,241,.1)"}}>
            <p className="text-xs text-slate-500">Version 2.5.0</p>
            <p className="text-[10px] text-slate-600 mt-0.5">© 2024 JT Store</p>
          </div>
        </aside>

        {/* ── MAIN ───────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 bg-white flex items-center justify-between px-8 sticky top-0 z-20"
            style={{borderBottom:"1px solid #f1f5f9",boxShadow:"0 1px 8px rgba(0,0,0,.04)"}}>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
              <input type="text" placeholder="Search anything…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none"
                style={{background:"#f8fafc",border:"1.5px solid #e2e8f0",transition:"border-color .15s"}}
                onFocus={e=>e.target.style.borderColor="#6366f1"}
                onBlur={e=>e.target.style.borderColor="#e2e8f0"}
                onChange={e=>setSearchTerm(e.target.value)}/>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50">
                <AlertCircle size={18}/><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"/>
              </button>
              <div className="relative" ref={dropdownRef}>
                <button onClick={()=>setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-slate-50"
                  style={{border:"1.5px solid #f1f5f9"}}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
                    style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
                    {adminProfile.username.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800 leading-none">{adminProfile.username}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{adminProfile.role}</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen?"rotate-180":""}`}/>
                </button>
                {isProfileOpen && (
                  <div className="fi absolute right-0 top-full mt-2 bg-white rounded-2xl z-50 overflow-hidden"
                    style={{boxShadow:"0 20px 60px rgba(0,0,0,.12)",border:"1px solid #f1f5f9",width:260}}>
                    <div className="p-4" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                          {adminProfile.username.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{adminProfile.username}</p>
                          <p className="text-xs text-indigo-200">{adminProfile.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full">{adminProfile.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      {[{icon:<UserCog size={16}/>,label:"Edit Account"},{icon:<Settings size={16}/>,label:"Settings"}].map(item=>(
                        <button key={item.label} className="flex items-center gap-3 w-full p-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                          <span className="text-slate-400">{item.icon}</span>{item.label}
                        </button>
                      ))}
                    </div>
                    <div className="p-2 pt-0">
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full p-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50">
                        <LogOut size={16}/> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-8 overflow-auto sb">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="fd text-2xl font-bold text-slate-900 leading-none">{activeTab}</h1>
                <p className="text-sm text-slate-500 mt-1.5">
                  {activeTab==="Dashboard"        && "Overview of your store's performance."}
                  {activeTab==="Inventory"        && "Manage and track your product catalog."}
                  {activeTab==="Inventory Charts" && "Visual analytics of your product catalog."}
                  {activeTab==="Orders"           && "Track and manage customer orders."}
                  {activeTab==="Users"            && "View and manage registered accounts."}
                </p>
              </div>
              {activeTab==="Inventory" && (
                <button onClick={()=>{setIsEditing(false);setFormData({name:"",brand:"",category:"",subcategory:"",price:"",image:""});setShowModal(true);}}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",boxShadow:"0 4px 14px rgba(99,102,241,.35)"}}>
                  <Plus size={16}/> New Product
                </button>
              )}
            </div>

            {/* Tab routing */}
            {activeTab==="Dashboard"        && <DashboardTab products={products} users={users} orders={orders} orderRevenue={orderRevenue}/>}
            {activeTab==="Inventory"        && <InventoryTab loading={loading} filteredProducts={filteredProducts} openEditModal={openEditModal} handleDelete={handleDelete}/>}
            {activeTab==="Inventory Charts" && (
              <InventoryChartsTab
                products={products} chartView={chartView} setChartView={setChartView}
                categoryData={categoryData} brandData={brandData}
                priceRangeData={priceRangeData} topValueProducts={topValueProducts}
                totalValue={totalValue} avgPrice={avgPrice} maxPrice={maxPrice} minPrice={minPrice}
              />
            )}
            {activeTab==="Orders" && (
              <OrdersTab orders={filteredOrders} orderCounts={orderCounts}
                orderFilter={orderFilter} setOrderFilter={setOrderFilter}
                selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder}
                updateOrderStatus={updateOrderStatus}/>
            )}
            {activeTab==="Users" && <UsersTab users={users} loading={loading}/>}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 backdrop-blur-sm" style={{background:"rgba(15,23,42,.6)"}} onClick={()=>setShowModal(false)}/>
          <form onSubmit={handleSubmit} className="fi relative bg-white rounded-2xl w-full max-w-lg overflow-hidden"
            style={{boxShadow:"0 30px 80px rgba(0,0,0,.2)"}}>
            <div className="px-6 py-4 flex justify-between items-center" style={{borderBottom:"1px solid #f1f5f9"}}>
              <div>
                <h3 className="fd font-bold text-slate-900">{isEditing?"Edit Product":"New Product"}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{isEditing?"Update product details":"Add to your catalog"}</p>
              </div>
              <button type="button" onClick={()=>setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X size={16}/></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                {label:"Product Name",key:"name",       span:2,type:"text"},
                {label:"Brand",      key:"brand",       span:1,type:"text"},
                {label:"Price (PHP)",key:"price",       span:1,type:"number"},
                {label:"Category",   key:"category",    span:1,type:"text"},
                {label:"Subcategory",key:"subcategory", span:1,type:"text"},
                {label:"Image URL",  key:"image",       span:2,type:"text"},
              ].map(f=>(
                <div key={f.key} className={f.span===2?"col-span-2":""}>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input type={f.type} required={f.key==="name"}
                    className="w-full px-3 py-2.5 text-sm rounded-xl outline-none"
                    style={{border:"1.5px solid #e2e8f0",background:"#fafafa",transition:"all .15s"}}
                    onFocus={e=>{e.target.style.borderColor="#6366f1";e.target.style.background="#fff"}}
                    onBlur={e=>{e.target.style.borderColor="#e2e8f0";e.target.style.background="#fafafa"}}
                    value={formData[f.key]} onChange={e=>setFormData({...formData,[f.key]:e.target.value})}/>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 flex gap-3" style={{background:"#f8fafc",borderTop:"1px solid #f1f5f9"}}>
              <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-white" style={{border:"1.5px solid #e2e8f0"}}>Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",boxShadow:"0 4px 14px rgba(99,102,241,.35)"}}>
                {isEditing?"Update Product":"Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

// ─── Sidebar Item ─────────────────────────────────────────────────
const SidebarItem = ({ label, icon, active, onClick, badge }) => (
  <button onClick={onClick}
    className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-left"
    style={{background:active?"rgba(99,102,241,.12)":"transparent",color:active?"#a5b4fc":"#64748b"}}
    onMouseEnter={e=>{if(!active){e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.color="#94a3b8"}}}
    onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#64748b"}}}>
    {active && <span className="nai"/>}
    <span>{icon}</span>
    <span className="text-sm font-medium flex-1">{label}</span>
    {badge>0 && <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{background:"#f43f5e"}}>{badge>9?"9+":badge}</span>}
    {active && <ChevronRight size={14} className="opacity-60"/>}
  </button>
);

// ─── Dashboard Tab ─────────────────────────────────────────────────
const DashboardTab = ({ products, users, orders, orderRevenue }) => {
  const delivered = orders.filter(o=>o.status==="delivered").length;
  return (
    <div className="space-y-6 fi">
      <div className="grid grid-cols-4 gap-5">
        <MetricCard title="Order Revenue"  value={`₱${orderRevenue.toLocaleString()}`} sub="+18.2% this month" icon={<DollarSign size={20}/>} color="#10b981" glow="rgba(16,185,129,.15)"/>
        <MetricCard title="Total Products" value={products.length}                       sub="In catalog"        icon={<Package size={20}/>}   color="#6366f1" glow="rgba(99,102,241,.15)"/>
        <MetricCard title="Total Orders"   value={orders.length}                         sub={`${delivered} delivered`} icon={<ShoppingCart size={20}/>} color="#f59e0b" glow="rgba(245,158,11,.15)"/>
        <MetricCard title="Active Users"   value={users.length||0}                      sub="Registered"        icon={<Users size={20}/>}     color="#8b5cf6" glow="rgba(139,92,246,.15)"/>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-2xl overflow-hidden" style={{border:"1px solid #e2e8f0"}}>
          <div className="px-5 py-4" style={{borderBottom:"1px solid #f1f5f9"}}>
            <h3 className="font-semibold text-slate-800 text-sm">Recent Orders</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {orders.slice(0,5).map(o=>{
              const cfg=STATUS_CONFIG[o.status];
              return (
                <div key={o.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:cfg.bg}}>
                    <Truck size={16} className={cfg.color}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{o.customer}</p>
                    <p className="text-xs text-slate-500 truncate">{o.product}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-slate-800">₱{o.amount.toLocaleString()}</p>
                    <span className={`sp ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>{cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5" style={{border:"1px solid #e2e8f0"}}>
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Order Status</h3>
          <div className="space-y-4">
            {Object.entries(STATUS_CONFIG).map(([key,cfg])=>{
              const count=orders.filter(o=>o.status===key).length;
              const pct=orders.length?Math.round((count/orders.length)*100):0;
              const fillMap={amber:"#f59e0b",blue:"#3b82f6",violet:"#8b5cf6",emerald:"#10b981",rose:"#f43f5e"};
              const fillColor=fillMap[cfg.dot.split("-")[1]]||"#6366f1";
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`}/><span className="text-xs font-medium text-slate-600">{cfg.label}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="pb"><div className="pf" style={{width:`${pct}%`,background:fillColor}}/></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, sub, icon, color, glow }) => (
  <div className="bg-white rounded-2xl p-5 ch" style={{border:"1px solid #e2e8f0"}}>
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:glow,color}}>{icon}</div>
      <ArrowUpRight size={14} className="text-slate-300 mt-1"/>
    </div>
    <p className="text-slate-500 text-xs font-medium">{title}</p>
    <p className="fd font-bold text-2xl text-slate-900 mt-1">{value}</p>
    <p className="text-xs text-slate-400 mt-1">{sub}</p>
  </div>
);

// ─── Inventory Tab ─────────────────────────────────────────────────
const InventoryTab = ({ loading, filteredProducts, openEditModal, handleDelete }) => (
  <div className="bg-white rounded-2xl overflow-hidden fi" style={{border:"1px solid #e2e8f0"}}>
    <table className="w-full text-left">
      <thead style={{background:"#f8fafc",borderBottom:"1px solid #f1f5f9"}}>
        <tr>
          {["Product","Category","Price","Actions"].map((h,i)=>(
            <th key={h} className={`px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider${i===3?" text-right":""}`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {loading?[1,2,3].map(i=>(
          <tr key={i}>
            <td className="px-6 py-4"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl sh"/><div><div className="h-3 w-32 rounded sh mb-2"/><div className="h-2 w-20 rounded sh"/></div></div></td>
            <td className="px-6 py-4"><div className="h-6 w-20 rounded-full sh"/></td>
            <td className="px-6 py-4"><div className="h-3 w-16 rounded sh"/></td>
            <td className="px-6 py-4"><div className="h-8 w-20 rounded-lg sh ml-auto"/></td>
          </tr>
        )):filteredProducts.length===0?(
          <tr><td colSpan="4" className="p-16 text-center"><Package size={32} className="mx-auto text-slate-300 mb-3"/><p className="text-slate-500 text-sm font-medium">No products found</p></td></tr>
        ):filteredProducts.map(p=>(
          <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
            <td className="px-6 py-4">
              <div className="flex items-center gap-4">
                <img src={p.image||"/api/placeholder/48/48"} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-100"/>
                <div><p className="font-semibold text-sm text-slate-900">{p.name}</p><p className="text-xs text-slate-400 mt-0.5">{p.brand}</p></div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="sp text-slate-600 bg-slate-100 border-slate-200">{p.category}</span>
              {p.subcategory&&<p className="text-xs text-slate-400 mt-1">{p.subcategory}</p>}
            </td>
            <td className="px-6 py-4 font-semibold text-sm text-slate-800">₱{Number(p.price).toLocaleString()}</td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={()=>openEditModal(p)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"><Edit size={15}/></button>
                <button onClick={()=>handleDelete(p.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"><Trash2 size={15}/></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Inventory Charts Tab ─────────────────────────────────────────
const InventoryChartsTab = ({
  products, chartView, setChartView,
  categoryData, brandData, priceRangeData, topValueProducts,
  totalValue, avgPrice, maxPrice, minPrice
}) => {
  const views = [
    {key:"category", label:"By Category",  icon:<Layers size={14}/>},
    {key:"brand",    label:"By Brand",     icon:<Tag size={14}/>},
    {key:"price",    label:"Price Range",  icon:<DollarSign size={14}/>},
    {key:"trend",    label:"Top Products", icon:<TrendingUp size={14}/>},
  ];

  const pieData = categoryData.map((d,i)=>({...d,fill:CHART_COLORS[i%CHART_COLORS.length]}));

  return (
    <div className="fi space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-5 gap-4">
        {[
          {label:"Total SKUs",    value:products.length,                  color:"#6366f1",glow:"rgba(99,102,241,.12)"},
          {label:"Catalog Value", value:`₱${totalValue.toLocaleString()}`,color:"#10b981",glow:"rgba(16,185,129,.12)"},
          {label:"Avg. Price",    value:`₱${avgPrice.toLocaleString()}`,  color:"#f59e0b",glow:"rgba(245,158,11,.12)"},
          {label:"Categories",    value:categoryData.length,              color:"#8b5cf6",glow:"rgba(139,92,246,.12)"},
          {label:"Brands",        value:brandData.length,                 color:"#06b6d4",glow:"rgba(6,182,212,.12)" },
        ].map(k=>(
          <div key={k.label} className="bg-white rounded-2xl p-4 ch" style={{border:"1px solid #e2e8f0"}}>
            <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center" style={{background:k.glow}}>
              <div className="w-3 h-3 rounded-full" style={{background:k.color}}/>
            </div>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">{k.label}</p>
            <p className="fd font-bold text-xl text-slate-900 mt-1 leading-none">{k.value}</p>
          </div>
        ))}
      </div>

      {/* View tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-semibold mr-1">View:</span>
        {views.map(v=>(
          <button key={v.key} onClick={()=>setChartView(v.key)} className={`ctb${chartView===v.key?" ac":""}`}>
            {v.icon}{v.label}
          </button>
        ))}
      </div>

      {/* ── CATEGORY VIEW ── */}
      {chartView==="category" && (
        <div className="space-y-5">
          <div className="grid grid-cols-5 gap-5">
            {/* Donut */}
            <div className="col-span-2 bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
              <h3 className="font-semibold text-slate-800 text-sm">Category Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Product share by category</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="count">
                    {pieData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} strokeWidth={0}/>)}
                  </Pie>
                  <Tooltip content={<ChartTooltip prefix="" suffix=" items"/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {pieData.slice(0,5).map((d,i)=>(
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{background:d.fill}}/>
                      <span className="text-xs text-slate-600">{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Bar: count */}
            <div className="col-span-3 bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
              <h3 className="font-semibold text-slate-800 text-sm">Products per Category</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">SKU count by category</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categoryData} barCategoryGap="30%">
                  <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                  <XAxis dataKey="name" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <Tooltip content={<ChartTooltip prefix="" suffix=" SKUs"/>}/>
                  <Bar dataKey="count" radius={[6,6,0,0]}>
                    {categoryData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Avg price per category */}
          <div className="bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
            <h3 className="font-semibold text-slate-800 text-sm">Average Price by Category</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">Mean product price per category (PHP)</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} barCategoryGap="35%">
                <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                <XAxis dataKey="name" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`₱${(v/1000).toFixed(0)}K`}/>
                <Tooltip content={<ChartTooltip prefix="₱"/>}/>
                <Bar dataKey="avgPrice" fill="#6366f1" radius={[6,6,0,0]}>
                  <LabelList dataKey="avgPrice" position="top" formatter={v=>`₱${(v/1000).toFixed(0)}K`} style={{fontSize:10,fill:"#6366f1",fontWeight:700}}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── BRAND VIEW ── */}
      {chartView==="brand" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
              <h3 className="font-semibold text-slate-800 text-sm">Products per Brand</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Number of SKUs by brand</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={brandData} layout="vertical" barCategoryGap="25%">
                  <CartesianGrid horizontal={false} strokeDasharray="3 3"/>
                  <XAxis type="number" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <YAxis type="category" dataKey="name" width={72} tick={{fontSize:11,fill:"#64748b"}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip prefix="" suffix=" SKUs"/>}/>
                  <Bar dataKey="count" radius={[0,6,6,0]}>
                    {brandData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
              <h3 className="font-semibold text-slate-800 text-sm">Inventory Value by Brand</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Total catalog value per brand</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={brandData} layout="vertical" barCategoryGap="25%">
                  <CartesianGrid horizontal={false} strokeDasharray="3 3"/>
                  <XAxis type="number" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`₱${(v/1000).toFixed(0)}K`}/>
                  <YAxis type="category" dataKey="name" width={72} tick={{fontSize:11,fill:"#64748b"}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip prefix="₱"/>}/>
                  <Bar dataKey="totalValue" radius={[0,6,6,0]}>
                    {brandData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Brand share */}
          <div className="bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
            <h3 className="font-semibold text-slate-800 text-sm">Brand Market Share</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-5">SKU share per brand</p>
            <div className="flex items-center gap-10">
              <div style={{width:240,height:220,flexShrink:0}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={brandData} cx="50%" cy="50%" outerRadius={100} innerRadius={48} paddingAngle={2} dataKey="count">
                      {brandData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} strokeWidth={0}/>)}
                    </Pie>
                    <Tooltip content={<ChartTooltip prefix="" suffix=" SKUs"/>}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                {brandData.map((d,i)=>{
                  const pct=products.length?Math.round((d.count/products.length)*100):0;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{background:"#f8fafc",border:"1px solid #f1f5f9"}}>
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{background:CHART_COLORS[i%CHART_COLORS.length]}}/>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{d.name}</p>
                        <p className="text-[10px] text-slate-400">{d.count} SKUs · {pct}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PRICE VIEW ── */}
      {chartView==="price" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
              <h3 className="font-semibold text-slate-800 text-sm">Price Range Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Products per price bracket</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={priceRangeData} barCategoryGap="30%">
                  <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                  <XAxis dataKey="name" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <Tooltip content={<ChartTooltip prefix="" suffix=" products"/>}/>
                  <Bar dataKey="count" radius={[6,6,0,0]}>
                    {priceRangeData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
              <h3 className="font-semibold text-slate-800 text-sm">Cumulative Price Area</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Product count across brackets</p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={priceRangeData}>
                  <defs>
                    <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25}/>
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="name" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <Tooltip content={<ChartTooltip prefix="" suffix=" products"/>}/>
                  <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fill="url(#pg)"/>
                </AreaChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[{label:"Min",value:`₱${minPrice.toLocaleString()}`,color:"#10b981"},{label:"Avg",value:`₱${avgPrice.toLocaleString()}`,color:"#6366f1"},{label:"Max",value:`₱${maxPrice.toLocaleString()}`,color:"#f43f5e"}].map(s=>(
                  <div key={s.label} className="text-center p-3 rounded-xl" style={{background:"#f8fafc",border:"1px solid #f1f5f9"}}>
                    <p className="text-[10px] text-slate-500 font-medium">{s.label}</p>
                    <p className="fd font-bold text-sm mt-1" style={{color:s.color}}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Category value bar */}
          <div className="bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
            <h3 className="font-semibold text-slate-800 text-sm">Total Inventory Value by Category</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-5">Sum of all prices per category</p>
            <div className="space-y-3">
              {[...categoryData].sort((a,b)=>b.totalValue-a.totalValue).map((cat,i)=>{
                const maxVal=Math.max(...categoryData.map(c=>c.totalValue));
                const pct=maxVal?(cat.totalValue/maxVal)*100:0;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-xs font-medium text-slate-600 w-24 flex-shrink-0 truncate">{cat.name}</span>
                    <div className="flex-1 h-7 bg-slate-100 rounded-lg overflow-hidden relative">
                      <div className="h-full rounded-lg transition-all" style={{width:`${pct}%`,background:`linear-gradient(90deg,${CHART_COLORS[i%CHART_COLORS.length]},${CHART_COLORS[(i+2)%CHART_COLORS.length]})`}}/>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600">
                        ₱{(cat.totalValue/1000).toFixed(0)}K
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 w-10 text-right">{cat.count} SKU</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TREND VIEW ── */}
      {chartView==="trend" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
            <h3 className="font-semibold text-slate-800 text-sm">Top 8 Products by Price</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">Highest priced items in your catalog</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topValueProducts} barCategoryGap="30%">
                <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                <XAxis dataKey="name" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`₱${(v/1000).toFixed(0)}K`}/>
                <Tooltip content={<ChartTooltip prefix="₱"/>}/>
                <Bar dataKey="price" radius={[6,6,0,0]}>
                  {topValueProducts.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
              <h3 className="font-semibold text-slate-800 text-sm mb-4">Premium Product Ranking</h3>
              <div className="space-y-2.5">
                {topValueProducts.map((p,i)=>(
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{background:CHART_COLORS[i%CHART_COLORS.length]}}>
                      {i+1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.brand}</p>
                    </div>
                    <span className="fd font-bold text-sm text-slate-900">₱{p.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6" style={{border:"1px solid #e2e8f0"}}>
              <h3 className="font-semibold text-slate-800 text-sm">Radial Price Scale</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-2">Relative price of top products</p>
              <ResponsiveContainer width="100%" height={280}>
                <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={110} barSize={14}
                  data={topValueProducts.map((p,i)=>({...p,fill:CHART_COLORS[i%CHART_COLORS.length]}))}>
                  <RadialBar dataKey="price" background={{fill:"#f8fafc"}} cornerRadius={6}/>
                  <Tooltip content={<ChartTooltip prefix="₱"/>}/>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Orders Tab ────────────────────────────────────────────────────
const OrdersTab = ({ orders, orderCounts, orderFilter, setOrderFilter, selectedOrder, setSelectedOrder, updateOrderStatus }) => (
  <div className="fi flex gap-5" style={{minHeight:600}}>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {["all","pending","processing","shipped","delivered","cancelled"].map(f=>{
          const active=orderFilter===f; const cfg=STATUS_CONFIG[f];
          return (
            <button key={f} onClick={()=>setOrderFilter(f)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize"
              style={{background:active?(cfg?cfg.bg:"#eef2ff"):"#fff",color:active?"#6366f1":"#64748b",border:`1.5px solid ${active?"#c7d2fe":"#e2e8f0"}`}}>
              {f}
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{background:active?"rgba(0,0,0,.1)":"#f1f5f9"}}>
                {orderCounts[f]}
              </span>
            </button>
          );
        })}
      </div>
      <div className="bg-white rounded-2xl overflow-hidden" style={{border:"1px solid #e2e8f0"}}>
        <table className="w-full text-left">
          <thead style={{background:"#f8fafc",borderBottom:"1px solid #f1f5f9"}}>
            <tr>
              {["Order","Customer","Product","Amount","Status","Date"].map(h=>(
                <th key={h} className="px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.length===0?(
              <tr><td colSpan="6" className="p-16 text-center"><Truck size={32} className="mx-auto text-slate-300 mb-3"/><p className="text-slate-500 text-sm font-medium">No orders found</p></td></tr>
            ):orders.map(o=>{
              const cfg=STATUS_CONFIG[o.status]; const Icon=cfg.icon; const sel=selectedOrder?.id===o.id;
              return (
                <tr key={o.id} className={`or${sel?" sel":""}`} onClick={()=>setSelectedOrder(sel?null:o)}>
                  <td className="px-5 py-3.5"><p className="text-xs font-bold text-indigo-600 font-mono">{o.id}</p><p className="text-[10px] text-slate-400 mt-0.5">{o.tracking}</p></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{background:`hsl(${o.customer.charCodeAt(0)*7},55%,52%)`}}>
                        {o.customer.charAt(0)}
                      </div>
                      <div><p className="text-sm font-medium text-slate-800 leading-none">{o.customer}</p><p className="text-[10px] text-slate-400 mt-0.5">{o.email}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 max-w-[160px]"><p className="text-sm text-slate-700 font-medium truncate">{o.product}</p></td>
                  <td className="px-5 py-3.5"><p className="text-sm font-bold text-slate-800">₱{o.amount.toLocaleString()}</p></td>
                  <td className="px-5 py-3.5"><span className={`sp ${cfg.color} ${cfg.bg} ${cfg.border}`}><Icon size={10}/>{cfg.label}</span></td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{o.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    {selectedOrder && <OrderDetailPanel order={selectedOrder} onClose={()=>setSelectedOrder(null)} updateOrderStatus={updateOrderStatus}/>}
  </div>
);

// ─── Order Detail Panel ────────────────────────────────────────────
const OrderDetailPanel = ({ order, onClose, updateOrderStatus }) => {
  const cfg=STATUS_CONFIG[order.status];
  const stepIdx=STATUS_ORDER.indexOf(order.status);
  const isCancelled=order.status==="cancelled";
  return (
    <div className="fi w-80 flex-shrink-0 bg-white rounded-2xl flex flex-col overflow-hidden" style={{border:"1px solid #e2e8f0",maxHeight:720}}>
      <div className="px-5 py-4 flex items-center justify-between" style={{borderBottom:"1px solid #f1f5f9"}}>
        <div><h3 className="fd font-bold text-slate-900 text-sm">Order Details</h3><p className="text-xs text-indigo-600 font-mono mt-0.5">{order.id}</p></div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100"><X size={14}/></button>
      </div>
      <div className="flex-1 overflow-y-auto sb p-5 space-y-5">
        <div className={`flex items-center gap-3 p-3 rounded-xl ${cfg.bg}`} style={{border:"1px solid",borderColor:cfg.border.replace("border-","")}}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.color}`} style={{background:"rgba(255,255,255,.7)"}}>
            {React.createElement(cfg.icon,{size:16})}
          </div>
          <div><p className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</p><p className="text-[10px] text-slate-500">Last updated: {order.date}</p></div>
        </div>
        {!isCancelled && (
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Tracking Progress</p>
            <div className="space-y-3">
              {TRACKING_STEPS.map((step,i)=>{
                const done=i<=stepIdx; const current=i===stepIdx;
                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${done?"text-white":"text-slate-300"}`}
                        style={{background:done?(current?"#6366f1":"#a5b4fc"):"#f1f5f9",border:current?"2px solid #6366f1":"none",boxShadow:current?"0 0 0 4px rgba(99,102,241,.15)":"none"}}>
                        {done&&!current?<CheckCircle2 size={14}/>:<span className="text-[10px] font-bold">{i+1}</span>}
                      </div>
                      {i<TRACKING_STEPS.length-1&&<div className="w-0.5 h-6 mt-1" style={{background:i<stepIdx?"#a5b4fc":"#e2e8f0"}}/>}
                    </div>
                    <div className="pt-1">
                      <p className={`text-xs font-semibold ${done?"text-slate-800":"text-slate-400"}`}>{step.label}</p>
                      <p className={`text-[10px] mt-0.5 ${done?"text-slate-500":"text-slate-300"}`}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {isCancelled && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50" style={{border:"1px solid #fecaca"}}>
            <XCircle size={16} className="text-rose-500 flex-shrink-0"/>
            <p className="text-xs text-rose-600 font-medium">This order was cancelled and will not be fulfilled.</p>
          </div>
        )}
        <div className="space-y-4">
          <InfoSection title="Customer">
            <InfoRow icon={<Users size={12}/>}       label="Name"  value={order.customer}/>
            <InfoRow icon={<AlertCircle size={12}/>} label="Email" value={order.email}/>
          </InfoSection>
          <InfoSection title="Shipment">
            <InfoRow icon={<MapPin size={12}/>}  label="Address"  value={order.address}/>
            <InfoRow icon={<Package size={12}/>} label="Product"  value={order.product}/>
            <InfoRow icon={<Truck size={12}/>}   label="Tracking" value={order.tracking} mono/>
          </InfoSection>
          <InfoSection title="Payment">
            <InfoRow icon={<DollarSign size={12}/>} label="Amount" value={`₱${order.amount.toLocaleString()}`} bold/>
            <InfoRow icon={<Clock size={12}/>}      label="Date"   value={order.date}/>
          </InfoSection>
        </div>
      </div>
      {!isCancelled && (
        <div className="p-4 space-y-2" style={{borderTop:"1px solid #f1f5f9"}}>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Update Status</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(STATUS_CONFIG).filter(([k])=>k!==order.status&&k!=="cancelled").map(([key,c])=>(
              <button key={key} onClick={()=>updateOrderStatus(order.id,key)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold ${c.color} ${c.bg} hover:opacity-80`}
                style={{border:"1px solid",borderColor:c.border.replace("border-","")}}>
                {React.createElement(c.icon,{size:11})}{c.label}
              </button>
            ))}
          </div>
          <button onClick={()=>updateOrderStatus(order.id,"cancelled")}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50"
            style={{border:"1px solid #fecaca"}}>
            <XCircle size={11}/> Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Users Tab ─────────────────────────────────────────────────────
const UsersTab = ({ users, loading }) => (
  <div className="bg-white rounded-2xl overflow-hidden fi" style={{border:"1px solid #e2e8f0"}}>
    <div className="px-6 py-4" style={{borderBottom:"1px solid #f1f5f9"}}>
      <h3 className="font-semibold text-slate-800">Registered Users</h3>
      <p className="text-xs text-slate-500 mt-0.5">{users.length} accounts</p>
    </div>
    <table className="w-full text-left">
      <thead style={{background:"#f8fafc"}}>
        <tr>{["User","Email","Role","Status"].map(h=><th key={h} className="px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {loading?<tr><td colSpan="4" className="p-12 text-center text-slate-400 text-sm">Loading…</td></tr>
        :users.length===0?<tr><td colSpan="4" className="p-12 text-center text-slate-400 text-sm">No users found.</td></tr>
        :users.map((u,i)=>(
          <tr key={i} className="hover:bg-slate-50">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                  style={{background:`hsl(${(u.username||u.name||"U").charCodeAt(0)*5},60%,55%)`}}>
                  {(u.username||u.name||"U").charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-sm text-slate-800">{u.username||u.name}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
            <td className="px-6 py-4"><span className="sp text-blue-600 bg-blue-50 border-blue-200">User</span></td>
            <td className="px-6 py-4"><span className="sp text-emerald-600 bg-emerald-50 border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>Active</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────
const InfoSection = ({ title, children }) => (
  <div><p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</p><div className="space-y-2">{children}</div></div>
);
const InfoRow = ({ icon, label, value, mono, bold }) => (
  <div className="flex items-start gap-2">
    <span className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className={`text-xs break-words mt-0.5${bold?" font-bold text-slate-900":" text-slate-700"}${mono?" font-mono text-indigo-600":""}`}>{value}</p>
    </div>
  </div>
);

export default AdminDashboard;