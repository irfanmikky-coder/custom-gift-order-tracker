import { db } from '../firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

const ordersCollection = collection(db, 'orders');

// Helper to map Firestore data to UI expected format while adhering to requested schema
const mapToUI = (docId, data) => {
  return {
    id: docId,
    orderId: data.orderId,
    customerName: data.customerName,
    phoneNumber: data.phoneNumber,
    customerEmail: data.email || data.customerEmail, // Fallback for safety
    product: data.productType || data.product,
    status: data.status,
    deliveryDate: data.estimatedDeliveryDate || data.deliveryDate,
    designNotes: data.designNotes || '',
    additionalNotes: data.additionalNotes || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    history: data.history || []
  };
};

export const api = {
  async getOrders() {
    try {
      const q = query(ordersCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => mapToUI(doc.id, doc.data()));
      return { success: true, data };
    } catch (err) {
      console.error("Error fetching orders:", err);
      throw new Error('Failed to fetch orders from Firebase', { cause: err });
    }
  },
  
  async getOrderById(id) {
    try {
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('Order not found');
      return { success: true, data: mapToUI(docSnap.id, docSnap.data()) };
    } catch (err) {
      console.error("Error fetching order:", err);
      throw new Error('Failed to fetch order', { cause: err });
    }
  },
  
  async createOrder(orderData) {
    try {
      // Generate a custom order ID
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();
      
      const newOrder = {
        orderId,
        customerName: orderData.customerName,
        phoneNumber: orderData.phoneNumber,
        email: orderData.customerEmail || '',
        productType: orderData.product,
        status: 'Design Received',
        estimatedDeliveryDate: orderData.deliveryDate,
        designNotes: orderData.designNotes || '',
        additionalNotes: orderData.additionalNotes || '',
        createdAt: now,
        updatedAt: now,
        history: [
          { status: 'Design Received', timestamp: now, message: 'Order created' }
        ]
      };

      const docRef = await addDoc(ordersCollection, newOrder);
      return { success: true, data: mapToUI(docRef.id, newOrder) };
    } catch (err) {
      console.error("Error creating order:", err);
      throw new Error('Failed to create order', { cause: err });
    }
  },
  
  async updateOrderStatus(id, status) {
    try {
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('Order not found');
      
      const currentData = docSnap.data();
      const oldStatus = currentData.status;
      const now = new Date().toISOString();
      
      const history = currentData.history || [];
      history.push({
        status,
        timestamp: now,
        message: `Status changed from ${oldStatus} to ${status}`
      });
      
      const updates = {
        status,
        history,
        updatedAt: now
      };
      
      await updateDoc(docRef, updates);
      
      // Merge updates for immediate UI return
      const updatedData = { ...currentData, ...updates };
      return { success: true, data: mapToUI(docSnap.id, updatedData) };
    } catch (err) {
      console.error("Error updating status:", err);
      throw new Error('Failed to update status', { cause: err });
    }
  },

  async deleteOrder(id) {
    try {
      const docRef = doc(db, 'orders', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (err) {
      console.error("Error deleting order:", err);
      throw new Error('Failed to delete order', { cause: err });
    }
  }
};
