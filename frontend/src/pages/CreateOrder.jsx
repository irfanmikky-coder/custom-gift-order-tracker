import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

function CreateOrder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    product: '',
    designNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.createOrder(formData);
      toast.success('Order created successfully!');
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Create New Order</h1>
      
      <div className="glass-card">
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="customerName">Customer Name</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              className="form-input"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="product">Product Type</label>
            <input
              type="text"
              id="product"
              name="product"
              className="form-input"
              value={formData.product}
              onChange={handleChange}
              required
              placeholder="e.g. Engraved Necklace"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="designNotes">Design Notes & Instructions</label>
            <textarea
              id="designNotes"
              name="designNotes"
              className="form-input"
              style={{ minHeight: '150px', resize: 'vertical' }}
              value={formData.designNotes}
              onChange={handleChange}
              placeholder="Enter engraving details, design preferences, or special requests..."
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Save size={18} />
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;
