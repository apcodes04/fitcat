import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc } from "firebase/firestore";

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
        // Format timestamp safely
        formattedTime: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleString() : new Date().toLocaleString(),
      }));
      callback(orders);
    });
  } catch (error) {
    console.error("Error subscribing to orders: ", error);
    callback([]);
  }
}

// Update Order Status in Firestore (Pending -> Confirmed -> Completed)
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
