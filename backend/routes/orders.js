const express = require('express');
const router = express.Router();
const mockData = require('../data/mockOrders');

// Get all orders
router.get('/', (req, res) => {
  const orders = mockData.getOrders();
  res.json({ success: true, data: orders });
});

// Get a single order by ID
router.get('/:id', (req, res) => {
  const order = mockData.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

// Create a new order
router.post('/', (req, res) => {
  const { customerName, product, designNotes } = req.body;
  
  if (!customerName || !product) {
    return res.status(400).json({ success: false, message: 'Customer name and product are required' });
  }

  const newOrder = mockData.createOrder({ customerName, product, designNotes });
  res.status(201).json({ success: true, data: newOrder });
});

// Update order status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = [
    'Design Received',
    'Client Approval',
    'Printing/Engraving',
    'Packaging',
    'Quality Check',
    'Dispatch',
    'Delivered'
  ];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const updatedOrder = mockData.updateOrderStatus(req.params.id, status);
  if (!updatedOrder) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: updatedOrder });
});

module.exports = router;
