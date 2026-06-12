import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

function CreateOrder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    customerEmail: '',
    product: '',
    designNotes: '',
    additionalNotes: '',
    deliveryDate: ''
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="customerName">Customer Name *</label>
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
              <label className="form-label" htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="form-input"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="e.g. 555-0100"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="customerEmail">Customer Email</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                className="form-input"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="e.g. jane@example.com"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="product">Product Type *</label>
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
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="deliveryDate">Estimated Delivery Date *</label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                className="form-input"
                value={formData.deliveryDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="designNotes">Personalization Details</label>
            <textarea
              id="designNotes"
              name="designNotes"
              className="form-input"
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={formData.designNotes}
              onChange={handleChange}
              placeholder="Enter engraving details, design preferences, or special requests..."
            ></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="additionalNotes">Additional Notes</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              className="form-input"
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Any other instructions for fulfillment or shipping..."
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
