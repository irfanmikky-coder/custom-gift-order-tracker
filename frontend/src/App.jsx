import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, PlusCircle, List, Settings } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CreateOrder from './pages/CreateOrder';
import OrdersList from './pages/OrdersList';
import OrderDetails from './pages/OrderDetails';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/orders/create', label: 'Create Order', icon: <PlusCircle size={20} /> },
    { path: '/orders', label: 'Orders List', icon: <List size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div>
        <h2 style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.75rem', marginBottom: '2rem' }}>
          GiftTrack
        </h2>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div style={{ marginTop: 'auto' }}>
        <Link to="#" className="nav-link">
          <Settings size={20} />
          Settings
        </Link>
      </div>
    </aside>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="animate-fade-in" style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders/create" element={<CreateOrder />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/orders" element={<OrdersList />} />
            </Routes>
          </div>
          <footer className="no-print" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <p>Custom Gift Order Fulfillment & Design Status Tracker - Paper Plane Internship Project</p>
          </footer>
        </main>
      </div>
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { 
            background: 'var(--bg-glass)', 
            backdropFilter: 'blur(10px)',
            color: 'var(--text-primary)', 
            border: '1px solid rgba(255,255,255,0.1)' 
          } 
        }} 
      />
    </Router>
  );
}

export default App;
