import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Search, Eye, Download, Filter, ArrowDownUp, PackageX } from 'lucide-react';
import toast from 'react-hot-toast';

const WORKFLOW_STATUSES = [
  'All',
  'Design Received',
  'Client Approval',
  'Printing/Engraving',
  'Packaging',
  'Quality Check',
  'Dispatch',
  'Delivered'
];

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest'

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.getOrders();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    
    // Headers
    const headers = ['Order ID', 'Customer', 'Phone', 'Product', 'Status', 'Date'];
    
    // Rows
    const rows = filteredAndSortedOrders.map(o => [
      o.id,
      `"${o.customerName}"`,
      o.phoneNumber || 'N/A',
      `"${o.product}"`,
      o.status,
      new Date(o.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported to CSV!');
  };

  const getStatusBadgeClass = (status) => {
    if (['Delivered'].includes(status)) return 'done';
    if (['Design Received', 'Client Approval'].includes(status)) return 'pending';
    return 'progress';
  };

  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.phoneNumber && order.phoneNumber.includes(searchTerm));
        
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ marginBottom: 0 }}>All Orders</h1>
        
        <button className="btn btn-primary" onClick={handleExportCSV}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by name, product, ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--text-secondary)" />
          <select 
            className="form-input" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            {WORKFLOW_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowDownUp size={18} color="var(--text-secondary)" />
          <select 
            className="form-input" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div>Loading orders...</div>
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}>{error}</div>
        ) : (
          <table className="data-table" style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <PackageX size={48} style={{ opacity: 0.5 }} />
                      <p style={{ fontSize: '1.125rem' }}>No orders found.</p>
                      {searchTerm !== '' && <p style={{ fontSize: '0.875rem' }}>Try adjusting your search filters.</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{order.phoneNumber || 'N/A'}</td>
                    <td>{order.product}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/orders/${order.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OrdersList;
