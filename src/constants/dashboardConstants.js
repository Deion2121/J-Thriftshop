import { Hourglass, RefreshCw, Truck, CheckCircle2, XCircle } from "lucide-react";

export const STATUS_CONFIG = {
  pending:    { label:"Pending",    color:"text-amber-600",   bg:"bg-amber-50",   border:"border-amber-200",   dot:"bg-amber-400",   icon:Hourglass   },
  processing: { label:"Processing", color:"text-blue-600",    bg:"bg-blue-50",    border:"border-blue-200",    dot:"bg-blue-400",    icon:RefreshCw   },
  shipped:    { label:"Shipped",    color:"text-violet-600",  bg:"bg-violet-50",  border:"border-violet-200",  dot:"bg-violet-400",  icon:Truck       },
  delivered:  { label:"Delivered",  color:"text-emerald-600", bg:"bg-emerald-50", border:"border-emerald-200", dot:"bg-emerald-400", icon:CheckCircle2},
  cancelled:  { label:"Cancelled",  color:"text-rose-600",    bg:"bg-rose-50",    border:"border-rose-200",    dot:"bg-rose-400",    icon:XCircle     },
};

export const MOCK_ORDERS = [
  { id:"ORD-2024-001", customer:"Maria Santos",    email:"maria@email.com",   product:"Sony WH-1000XM5",      amount:18990,  status:"delivered",  date:"2024-07-10", address:"Makati City, Metro Manila",    tracking:"PHL-TRK-88201" },
  { id:"ORD-2024-002", customer:"Juan dela Cruz",  email:"juan@email.com",    product:"Apple iPhone 15 Pro",  amount:74990,  status:"shipped",    date:"2024-07-12", address:"Quezon City, Metro Manila",   tracking:"PHL-TRK-88202" },
  { id:"ORD-2024-003", customer:"Ana Reyes",       email:"ana@email.com",     product:"Samsung Galaxy S24",   amount:54990,  status:"processing", date:"2024-07-13", address:"Cebu City, Cebu",              tracking:"PHL-TRK-88203" },
  { id:"ORD-2024-004", customer:"Pedro Bautista",  email:"pedro@email.com",   product:"Logitech MX Master 3", amount:5990,   status:"pending",    date:"2024-07-14", address:"Davao City, Davao del Sur",   tracking:"PHL-TRK-88204" },
  { id:"ORD-2024-005", customer:"Rosa Garcia",     email:"rosa@email.com",    product:"iPad Air M2",          amount:42990,  status:"cancelled",  date:"2024-07-08", address:"Pasig City, Metro Manila",    tracking:"PHL-TRK-88205" },
  { id:"ORD-2024-006", customer:"Carlo Mendoza",   email:"carlo@email.com",   product:"Dyson V15 Detect",     amount:37990,  status:"delivered",  date:"2024-07-09", address:"Taguig City, Metro Manila",   tracking:"PHL-TRK-88206" },
  { id:"ORD-2024-007", customer:"Liza Villanueva", email:"liza@email.com",    product:"MacBook Air M3",        amount:84990,  status:"shipped",    date:"2024-07-13", address:"Mandaluyong, Metro Manila",   tracking:"PHL-TRK-88207" },
  { id:"ORD-2024-008", customer:"Mark Aquino",     email:"mark@email.com",    product:"Razer Blade 16",        amount:139990, status:"processing", date:"2024-07-14", address:"Antipolo, Rizal",              tracking:"PHL-TRK-88208" },
];

export const MOCK_PRODUCTS = [
  { id:1,  name:"Sony WH-1000XM5",      brand:"Sony",      category:"Audio",       subcategory:"Headphones", price:18990  },
  { id:2,  name:"Apple iPhone 15 Pro",  brand:"Apple",     category:"Mobile",      subcategory:"Smartphone", price:74990  },
  { id:3,  name:"Samsung Galaxy S24",   brand:"Samsung",   category:"Mobile",      subcategory:"Smartphone", price:54990  },
  { id:4,  name:"Logitech MX Master 3", brand:"Logitech", category:"Peripherals", subcategory:"Mouse",       price:5990   },
  { id:5,  name:"iPad Air M2",          brand:"Apple",     category:"Tablets",     subcategory:"iPad",        price:42990  },
  { id:6,  name:"Dyson V15 Detect",     brand:"Dyson",     category:"Appliances",  subcategory:"Vacuum",      price:37990  },
  { id:7,  name:"MacBook Air M3",        brand:"Apple",     category:"Laptops",     subcategory:"MacBook",     price:84990  },
  { id:8,  name:"Razer Blade 16",        brand:"Razer",     category:"Laptops",     subcategory:"Gaming",      price:139990 },
  { id:9,  name:"Samsung 4K Monitor",   brand:"Samsung",   category:"Monitors",    subcategory:"4K",          price:24990  },
  { id:10, name:"JBL Flip 6",            brand:"JBL",       category:"Audio",       subcategory:"Speaker",     price:4990   },
  { id:11, name:"Apple Watch S9",        brand:"Apple",     category:"Wearables",   subcategory:"Smartwatch", price:22990  },
  { id:12, name:"Keychron K8 Pro",      brand:"Keychron", category:"Peripherals", subcategory:"Keyboard",   price:7990   },
];

export const TRACKING_STEPS = [
  { key:"pending",    label:"Order Placed",    desc:"Your order has been received" },
  { key:"processing", label:"Processing",       desc:"Preparing your items"         },
  { key:"shipped",    label:"Out for Delivery", desc:"Package is on its way"        },
  { key:"delivered",  label:"Delivered",        desc:"Package has been delivered"   },
];
export const STATUS_ORDER    = ["pending","processing","shipped","delivered"];
export const CHART_COLORS    = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#f43f5e","#ec4899","#84cc16"];