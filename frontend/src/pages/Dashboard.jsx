import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Package, Pencil, Settings, Truck, CheckCircle, PackageX, Clock, History } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.getOrders();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}>{error}</div>;

  const totalOrders = orders.length;
  const designReceived = orders.filter(o => o.status === 'Design Received').length;
  const inProduction = orders.filter(o => ['Client Approval', 'Printing/Engraving', 'Packaging', 'Quality Check'].includes(o.status)).length;
  const dispatched = orders.filter(o => o.status === 'Dispatch').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  
  const statusChartData = Object.keys(statusCounts).map(key => ({
    name: key,
    count: statusCounts[key]
  }));

  const dateCounts = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dateChartData = Object.keys(dateCounts)
    .sort((a, b) => new Date(a) - new Date(b))
    .map(key => ({
      date: key,
      count: dateCounts[key]
    }));

  const recentActivity = orders
    .flatMap(order => (order.history || []).map(entry => ({ ...entry, orderId: order.id, customerName: order.customerName })))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  if (orders.length === 0) {
    return (
      <div>
        <h1 style={{ marginBottom: '2rem' }}>Dashboard Analytics</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: 'var(--text-secondary)' }}>
          <PackageX size={64} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Orders Yet</h2>
          <p>Create your first order to start seeing analytics!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard Analytics</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', color: '#3b82f6' }}>
            <Package size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Orders</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totalOrders}</h3>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: 'var(--radius-md)', color: '#a855f7' }}>
            <Pencil size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Design Received</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{designReceived}</h3>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: 'var(--radius-md)', color: '#eab308' }}>
            <Settings size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>In Production</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{inProduction}</h3>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(249, 115, 22, 0.1)', borderRadius: 'var(--radius-md)', color: '#f97316' }}>
            <Truck size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Dispatched</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{dispatched}</h3>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: 'var(--radius-md)', color: '#22c55e' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Delivered</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{delivered}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card chart-card">
          <h2 style={{ marginBottom: '1.5rem' }}>Orders by Status</h2>
          <div style={{ height: '300px', minHeight: 0, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" angle={-45} textAnchor="end" height={60} tick={{fontSize: 12, fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" allowDecimals={false} tick={{fill: 'var(--text-secondary)'}} />
                <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)'}} />
                <Bar dataKey="count" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card chart-card">
          <h2 style={{ marginBottom: '1.5rem' }}>Orders Created Per Day</h2>
          <div style={{ height: '300px', minHeight: 0, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dateChartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fontSize: 12, fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" allowDecimals={false} tick={{fill: 'var(--text-secondary)'}} />
                <RechartsTooltip contentStyle={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)'}} />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={4} activeDot={{ r: 8, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        <div>
          <h2>Recent Orders</h2>
          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: '500px' }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>
                      <span className={`status-badge ${order.status === 'Delivered' ? 'done' : order.status.includes('Design') ? 'pending' : 'progress'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} color="var(--accent-primary)" />
            Recent Activity
          </h2>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', borderBottom: idx !== recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: idx !== recentActivity.length - 1 ? '1rem' : '0' }}>
                  <div style={{ marginTop: '0.25rem', color: 'var(--accent-secondary)' }}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{activity.orderId}</span> ({activity.customerName})
                    </p>
                    <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{activity.message}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
