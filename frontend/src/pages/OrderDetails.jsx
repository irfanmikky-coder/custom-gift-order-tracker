import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import StatusTimeline from '../components/StatusTimeline';
import { ArrowLeft, User, Package, Calendar, Clock, History, Printer, Phone, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const WORKFLOW_STATUSES = [
  'Design Received',
  'Client Approval',
  'Printing/Engraving',
  'Packaging',
  'Quality Check',
  'Dispatch',
  'Delivered'
];

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await api.getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    
    if (!window.confirm(`Are you sure you want to update the status to "${newStatus}"?`)) {
      return;
    }
    
    setUpdating(true);
    try {
      const res = await api.updateOrderStatus(id, newStatus);
      setOrder(res.data);
      toast.success('Status updated successfully!');
    } catch (err) {
      console.error('Failed to update status', err);
      toast.error('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}>{error}</div>;
  if (!order) return <div>Order not found</div>;

  // Calculate estimated delivery (14 days from creation)
  const createdDate = new Date(order.createdAt);
  const estimatedDelivery = new Date(createdDate.getTime() + 14 * 86400000);

  return (
    <div className="order-details-page">
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }} className="no-print">
        <Link to="/orders" className="nav-link" style={{ display: 'inline-flex', padding: '0.5rem' }}>
          <ArrowLeft size={18} />
          Back to Orders
        </Link>
        <button className="btn btn-secondary" onClick={handlePrint} style={{ display: 'inline-flex', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Printer size={18} />
          Print Order
        </button>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ marginBottom: 0 }}>Order {order.id}</h1>
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-glass)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <label style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Update Status:</label>
          <select 
            className="form-input" 
            style={{ width: '220px', padding: '0.5rem', margin: 0 }} 
            value={order.status} 
            onChange={handleStatusChange}
            disabled={updating}
          >
            {WORKFLOW_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Customer Info Card */}
        <div className="glass-card print-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            <User size={20} color="var(--accent-primary)" className="print-icon" />
            Customer Info
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Name</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>{order.customerName}</p>
            </div>
            {order.phoneNumber && (
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Phone</p>
                <p style={{ fontSize: '1.125rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} color="var(--text-secondary)" className="print-icon" />
                  {order.phoneNumber}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Card */}
        <div className="glass-card print-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            <Package size={20} color="var(--accent-secondary)" className="print-icon" />
            Product Details
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Product</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>{order.product}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Order Date</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="var(--text-secondary)" className="print-icon" />
                {createdDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Info Card */}
        <div className="glass-card print-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            <Truck size={20} color="var(--status-progress)" className="print-icon" />
            Delivery Info
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Est. Delivery Date</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--status-done)' }}>{estimatedDelivery.toLocaleDateString()}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Shipping Status</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                {['Delivered', 'Dispatch'].includes(order.status) ? 'In Transit / Delivered' : 'Processing'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Design Notes */}
      <div className="glass-card print-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Design & Personalization Notes</h2>
        <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          {order.designNotes ? (
            <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{order.designNotes}</p>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No design notes provided.</p>
          )}
        </div>
      </div>

      {/* Progress & History */}
      <div className="glass-card print-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Production Progress</h2>
        <StatusTimeline currentStatus={order.status} />
        
        <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            <History size={20} color="var(--accent-primary)" className="print-icon" />
            Order History
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.history && order.history.length > 0 ? (
              order.history.slice().reverse().map((entry, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ marginTop: '0.25rem', color: 'var(--accent-secondary)' }}>
                    <Clock size={18} className="print-icon" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{entry.message}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No history available for this order.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default OrderDetails;
