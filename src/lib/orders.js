import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";

// Save a new WhatsApp Pre-Order to Firestore
export async function saveOrderToFirestore(orderData) {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: orderData.status || "Pending",
      createdAt: serverTimestamp(),
    });
    console.log("Order saved to Firestore with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding order to Firestore: ", error);
    return { success: false, error: error.message };
  }
}

// Subscribe to real-time order updates for Admin Dashboard
export function subscribeToOrders(callback) {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        formattedTime: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleString() : new Date().toLocaleString(),
      }));
      callback(orders);
    });
  } catch (error) {
    console.error("Error subscribing to orders: ", error);
    callback([]);
  }
}

// Update Order Status or Details in Firestore
export async function updateOrderStatusInFirestore(orderId, status) {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
    return { success: true };
  } catch (error) {
    console.error("Error updating order status: ", error);
    return { success: false, error: error.message };
  }
}

// Update Full Order in Firestore
export async function updateOrderInFirestore(orderId, updatedFields) {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      ...updatedFields,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating full order: ", error);
    return { success: false, error: error.message };
  }
}

// Delete Order permanently from Firestore (Admin only)
export async function deleteOrderFromFirestore(orderId) {
  try {
    await deleteDoc(doc(db, "orders", orderId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting order: ", error);
    return { success: false, error: error.message };
  }
}
