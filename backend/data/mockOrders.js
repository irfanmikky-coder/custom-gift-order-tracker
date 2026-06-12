// In-memory mock data for custom gift orders
let mockOrders = [
  {
    id: 'ORD-1001',
    customerName: 'Alice Johnson',
    phoneNumber: '555-0101',
    product: 'Engraved Wooden Watch',
    designNotes: 'Please engrave "To the moon and back" on the back.',
    status: 'Design Received',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    history: [
      { status: 'Design Received', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), message: 'Order created and Design Received' }
    ]
  },
  {
    id: 'ORD-1002',
    customerName: 'Bob Smith',
    phoneNumber: '555-0202',
    product: 'Custom Photo Mug',
    designNotes: 'Use the uploaded family photo. Add text "Best Dad".',
    status: 'Printing/Engraving',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    history: [
      { status: 'Design Received', timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), message: 'Order created and Design Received' },
      { status: 'Printing/Engraving', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), message: 'Status changed from Design Received to Printing/Engraving' }
    ]
  },
  {
    id: 'ORD-1003',
    customerName: 'Charlie Davis',
    phoneNumber: '555-0303',
    product: 'Personalized Leather Wallet',
    designNotes: 'Initials "C.D." in gold foil.',
    status: 'Delivered',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    history: [
      { status: 'Design Received', timestamp: new Date(Date.now() - 86400000 * 10).toISOString(), message: 'Order created and Design Received' },
      { status: 'Delivered', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), message: 'Status changed from Design Received to Delivered' }
    ]
  },
];

module.exports = {
  getOrders: () => mockOrders,
  getOrderById: (id) => mockOrders.find((o) => o.id === id),
  createOrder: (order) => {
    const newOrder = {
      id: `ORD-${1000 + mockOrders.length + 1}`,
      ...order,
      status: 'Design Received',
      createdAt: new Date().toISOString(),
      history: [
        { status: 'Design Received', timestamp: new Date().toISOString(), message: 'Order created and Design Received' }
      ]
    };
    mockOrders.unshift(newOrder);
    return newOrder;
  },
  updateOrderStatus: (id, newStatus) => {
    const orderIndex = mockOrders.findIndex((o) => o.id === id);
    if (orderIndex === -1) return null;
    
    const oldStatus = mockOrders[orderIndex].status;
    mockOrders[orderIndex].status = newStatus;
    
    if (!mockOrders[orderIndex].history) {
      mockOrders[orderIndex].history = [];
    }
    
    mockOrders[orderIndex].history.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      message: `Status changed from ${oldStatus} to ${newStatus}`
    });
    
    return mockOrders[orderIndex];
  },
};
