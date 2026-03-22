import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingCart, User, Home as HomeIcon, 
  LayoutGrid, MessageCircle, Phone, ArrowLeft, 
  X, Plus, Minus, Send, Check
} from 'lucide-react';
import './App.css';

// --- Mock Data ---
const DATA = {
  categories: [
    { 
      id: 'drugs', 
      name: 'Drugs', 
      icon: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
      classes: [
        { id: 'antibiotics', name: 'Antibiotics', products: [
          { id: 101, name: 'Amoxicillin 500mg (1000 Caps)', price: 45000, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
          { id: 102, name: 'Ciprofloxacin 500mg', price: 12000, img: 'https://images.unsplash.com/photo-1471864190281-0f73587b9264?w=300&h=300&fit=crop' }
        ]},
        { id: 'analgesics', name: 'Analgesics', products: [
          { id: 103, name: 'Paracetamol 500mg', price: 5000, img: 'https://images.unsplash.com/photo-1550572017-ed200f545dec?w=300&h=300&fit=crop' },
          { id: 104, name: 'Ibuprofen 400mg', price: 8000, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' }
        ]},
        { id: 'antimalarials', name: 'Antimalarials', products: [
          { id: 105, name: 'Coartem 20/120', price: 15000, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' }
        ]},
        { id: 'antihypertensives', name: 'Antihypertensives', products: [
          { id: 106, name: 'Amlodipine 5mg', price: 18000, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' }
        ]},
        { id: 'antidiabetics', name: 'Antidiabetics', products: [
          { id: 107, name: 'Metformin 500mg', price: 20000, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' }
        ]},
        { id: 'antivirals', name: 'Antivirals', products: [] },
        { id: 'respiratory', name: 'Respiratory Drugs', products: [] },
        { id: 'gastrointestinal', name: 'Gastrointestinal', products: [] },
        { id: 'hormonal', name: 'Hormonal/Endocrine', products: [] },
        { id: 'fluids', name: 'IV Fluids', products: [] },
        { id: 'cardiovascular', name: 'Cardiovascular', products: [] },
        { id: 'cns', name: 'CNS Drugs', products: [] },
        { id: 'dermatology', name: 'Dermatology', products: [] },
        { id: 'ophtha', name: 'Ophtha & ENT', products: [] },
        { id: 'supplements', name: 'Supplements/Vitamins', products: [
          { id: 108, name: 'Vitamin C 500mg', price: 10000, img: 'https://images.unsplash.com/photo-1550572017-ed200f545dec?w=300&h=300&fit=crop' }
        ]}
      ]
    },
    { 
      id: 'consumables', 
      name: 'Consumables', 
      icon: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&h=200&fit=crop',
      classes: [
        { id: 'gloves', name: 'Gloves', products: [
          { id: 201, name: 'Latex Gloves Powder Free (100pcs)', price: 25000, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' }
        ]},
        { id: 'syringes', name: 'Syringes', products: [] }
      ]
    },
    { 
      id: 'diagnostics', 
      name: 'Diagnostics', 
      icon: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=200&h=200&fit=crop',
      classes: []
    },
    { 
      id: 'equipment', 
      name: 'Medical Equipments', 
      icon: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&h=200&fit=crop',
      classes: []
    },
    { 
      id: 'hygiene', 
      name: 'Infection Control', 
      icon: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop',
      classes: []
    },
    { 
      id: 'surgical', 
      name: 'Surgical Supplies', 
      icon: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&h=200&fit=crop',
      classes: []
    }
  ],
  trending: [
    { id: 101, name: 'Amoxicillin 500mg', price: 45000, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
    { id: 201, name: 'Latex Gloves (100pcs)', price: 25000, img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop' },
    { id: 301, name: 'Digital Thermometer', price: 15000, img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=300&h=300&fit=crop' },
    { id: 401, name: 'BP Monitor Digital', price: 120000, img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=300&h=300&fit=crop' }
  ]
};

const WHATSAPP_NUMBER = '256702370441';

// --- Components ---

const Navbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      navigate('/search');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-top">
        <Link to="/" className="logo">KIE<span>MED</span></Link>
        <div className="nav-icons desktop-only">
          <Link to="/account" className="nav-icon-btn"><User size={24} /><span>Account</span></Link>
        </div>
      </div>
      <form className="search-bar-container" onSubmit={handleSearchSubmit}>
        <Search size={18} color="#999" />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search for drugs, equipments..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
    </nav>
  );
};

const BottomNav = ({ cartCount, onChatPress }) => (
  <div className="bottom-nav">
    <Link to="/" className="nav-icon-btn"><HomeIcon size={24} /><span>Home</span></Link>
    <Link to="/categories" className="nav-icon-btn"><LayoutGrid size={24} /><span>Categories</span></Link>
    <button onClick={onChatPress} className="nav-icon-btn"><MessageCircle size={24} /><span>Chat</span></button>
    <Link to="/cart" className="nav-icon-btn">
      <ShoppingCart size={24} />
      {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      <span>Cart</span>
    </Link>
    <Link to="/account" className="nav-icon-btn"><User size={24} /><span>Account</span></Link>
  </div>
);

const HeroSlider = () => {
  const slides = [
    { title: "Direct to Clinics", sub: "Speedy delivery for healthcare centers", img: "https://i.pinimg.com/736x/2c/6c/07/2c6c077b3b4b92ade9fd9e8099af6f7f.jpg" },
    { title: "Quality Pharmacy Supplies", sub: "Only approved pharmaceuticals", img: "https://i.pinimg.com/736x/ac/6e/e6/ac6ee6b196afb06732df7037ec4bf146.jpg" },
    { title: "Reliable Diagnostics", sub: "Premium equipment at B2B prices", img: "https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg" },
    { title: "Premium Surgical Tools", sub: "Equipping hospitals with precision", img: "https://i.pinimg.com/1200x/4b/55/7d/4b557dffc0c323987fc7ce33ff66c83f.jpg" },
    { title: "Infection Control", sub: "Hygiene solutions for safety", img: "https://i.pinimg.com/1200x/ba/73/7c/ba737cff8f1e6297ed372f94b224f4f8.jpg" }
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slider">
      <AnimatePresence mode='wait'>
        <motion.div 
          key={current}
          className="hero-slide"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.8 }}
          style={{ backgroundImage: `url(${slides[current].img})` }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >{slides[current].title}</motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >{slides[current].sub}</motion.p>
            <motion.button 
              className="hero-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >Shop Now</motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ProductCard = ({ product, addToCart }) => (
  <motion.div className="product-card" whileHover={{ y: -5 }}>
    <div className="product-img-box">
      <img src={product.img} alt={product.name} className="product-img" />
    </div>
    <div className="product-info">
      <p className="product-name">{product.name}</p>
      <div className="product-price-row">
        <span className="price">UGX {product.price.toLocaleString()}</span>
      </div>
      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
        Add to cart
      </button>
    </div>
  </motion.div>
);

const HomeContent = ({ addToCart }) => (
  <div className="fade-in">
    <div className="category-grid">
      {DATA.categories.map(cat => (
        <Link to={`/category/${cat.id}`} key={cat.id} className="category-item">
          <div className="category-circle">
            <img src={cat.icon} alt={cat.name} />
          </div>
          <span className="category-label">{cat.name}</span>
        </Link>
      ))}
    </div>

    <div className="section-title">
      <h2>Essential Products</h2>
      <Link to="/all">View All</Link>
    </div>
    <div className="product-grid">
      {DATA.trending.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
    </div>

    <div className="section-title">
      <h2>All Products</h2>
    </div>
    <div className="product-grid">
      {DATA.categories.flatMap(c => c.classes).flatMap(cl => cl.products).map(p => (
        <ProductCard key={p.id} product={p} addToCart={addToCart} />
      ))}
    </div>
  </div>
);

const CategoriesPage = () => (
  <div className="fade-in p-4">
    <h2 className="mb-6 text-xl font-bold">Store Categories</h2>
    <div className="grid grid-cols-2 gap-4">
      {DATA.categories.map(cat => (
        <Link to={`/category/${cat.id}`} key={cat.id} className="p-4 bg-white rounded-xl shadow-sm flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border">
            <img src={cat.icon} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-sm text-center">{cat.name}</span>
        </Link>
      ))}
    </div>
  </div>
);

const CategoryPage = () => {
  const { id } = useLocation().pathname.split('/').slice(-1); // Simplification
  const categoryId = useLocation().pathname.split('/').pop();
  const category = DATA.categories.find(c => c.id === categoryId);

  if (!category) return <div className="p-4">Category not found</div>;

  return (
    <div className="fade-in">
      <div className="section-title">
        <Link to="/"><ArrowLeft size={20} className="mr-2" /></Link>
        <h2 style={{flex: 1}}>{category.name}</h2>
      </div>
      <div className="p-4 grid" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
        {category.classes.length > 0 ? (
          category.classes.map(cl => (
            <Link to={`/class/${categoryId}/${cl.id}`} key={cl.id} className="p-4 bg-white rounded-lg shadow-sm font-semibold flex items-center justify-between">
              {cl.name} <Plus size={16} />
            </Link>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-400 py-10">Coming Soon</div>
        )}
      </div>
    </div>
  );
};

const ClassPage = ({ addToCart }) => {
  const paths = useLocation().pathname.split('/');
  const catId = paths[2];
  const classId = paths[3];
  
  const category = DATA.categories.find(c => c.id === catId);
  const classObj = category?.classes.find(cl => cl.id === classId);

  if (!classObj) return <div className="p-4">Class not found</div>;

  return (
    <div className="fade-in">
      <div className="section-title">
        <Link to={`/category/${catId}`}><ArrowLeft size={20} /></Link>
        <h2 style={{flex: 1}}>{classObj.name}</h2>
      </div>
      <div className="product-grid">
        {classObj.products.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
      </div>
    </div>
  );
};

// Remove ChatPage as it's now a modal

const CartPage = ({ cart, updateQty, removeItem }) => {
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  const handleOrder = () => {
    let orderText = "New Order from KIEMED App:\n\n";
    cart.forEach(item => {
      orderText += `- ${item.name} x${item.qty} (UGX ${item.price * item.qty})\n`;
    });
    orderText += `\nTotal: UGX ${total.toLocaleString()}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`;
    window.open(url, '_blank');
  };

  if (cart.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 opacity-50">
      <ShoppingCart size={64} className="mb-4" />
      <p>Your cart is empty</p>
      <Link to="/" className="mt-4 text-primary font-bold">Start Shopping</Link>
    </div>
  );

  return (
    <div className="fade-in p-4">
      <h2 className="mb-4 text-xl font-bold">Your Cart</h2>
      {cart.map(item => (
        <div key={item.id} className="flex gap-4 bg-white p-3 rounded-lg mb-3 shadow-sm">
          <img src={item.img} className="w-20 h-20 object-contain" />
          <div className="flex-1">
            <h4 className="text-sm font-medium">{item.name}</h4>
            <p className="font-bold text-lg">UGX {item.price.toLocaleString()}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center border rounded">
                <button className="p-1" onClick={() => updateQty(item.id, -1)}><Minus size={14}/></button>
                <span className="px-3 text-sm">{item.qty}</span>
                <button className="p-1" onClick={() => updateQty(item.id, 1)}><Plus size={14}/></button>
              </div>
              <button className="text-red-500 text-xs" onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between mb-4 font-bold text-lg">
          <span>Total:</span>
          <span>UGX {total.toLocaleString()}</span>
        </div>
        <button 
          className="w-full bg-green-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2"
          onClick={handleOrder}
        >
          <Send size={18} /> Order via WhatsApp
        </button>
      </div>
    </div>
  );
};

// --- App Root ---

function App() {
  const [cart, setCart] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const handleSearch = (term) => {
    const allProducts = DATA.categories.flatMap(c => c.classes).flatMap(cl => cl.products);
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term.toLowerCase()));
    setSearchResults(filtered);
  };

  return (
    <div className="app-wrapper">
      <Navbar onSearch={handleSearch} />
      
      {/* Move Hero outside container for edge-to-edge width on mobile */}
      <Routes>
        <Route path="/" element={<HeroSlider />} />
      </Routes>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomeContent addToCart={addToCart} />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/class/:catId/:classId" element={<ClassPage addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} updateQty={updateQty} removeItem={removeItem} />} />
          <Route path="/search" element={
            <div className="fade-in">
              <div className="section-title"><h2>Search Results</h2></div>
              <div className="product-grid">
                {searchResults.length > 0 ? (
                  searchResults.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} />)
                ) : (
                  <div className="col-span-3 text-center py-20 text-gray-500">No products found</div>
                )}
              </div>
            </div>
          } />
          <Route path="/account" element={<div className="p-10 text-center">Account Profile Coming Soon</div>} />
        </Routes>
      </main>

      <BottomNav cartCount={cart.length} onChatPress={() => setShowChatModal(true)} />

      {/* Chat Modal */}
      <AnimatePresence>
        {showChatModal && (
          <div className="chat-modal-overlay" onClick={() => setShowChatModal(false)}>
            <motion.div 
              className="chat-modal"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Contact Support</h3>
                <button onClick={() => setShowChatModal(false)}><X size={24}/></button>
              </div>
              <div className="flex flex-col gap-4">
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                  className="flex items-center justify-center gap-3 p-5 bg-green-500 text-white rounded-2xl font-bold text-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={28} /> WhatsApp Support
                </a>
                <a 
                  href={`tel:+${WHATSAPP_NUMBER}`} 
                  className="flex items-center justify-center gap-3 p-5 bg-blue-600 text-white rounded-2xl font-bold text-lg"
                >
                  <Phone size={28} /> Call Support
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
