import { db } from "./firebase";
import { collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

// Format dates to DD Month YYYY text format (e.g. 8th Sept, 2026)
export function formatBookingDateText(dateStr) {
  if (!dateStr) return "";

  if (typeof dateStr === "string" && (dateStr.includes("st") || dateStr.includes("nd") || dateStr.includes("rd") || dateStr.includes("th"))) {
    return dateStr;
  }

  let dateObj;
  if (typeof dateStr === "string" && dateStr.includes("-")) {
    const parts = dateStr.split("-").map(Number);
    if (parts.length === 3) {
      dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      dateObj = new Date(dateStr);
    }
  } else {
    dateObj = new Date(dateStr);
  }

  if (isNaN(dateObj.getTime())) return dateStr;

  const dayNum = dateObj.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const monthName = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${getOrdinalSuffix(dayNum)} ${monthName}, ${year}`;
}

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

// Subscribe to real-time order updates for Admin Dashboard with fallback for index building
export function subscribeToOrders(callback) {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          formattedTime: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleString() : new Date().toLocaleString(),
        }));
        callback(orders);
      },
      (error) => {
        console.warn("Ordered snapshot failed, falling back to simple collection query:", error);
        // Fallback to query without orderBy if index is missing or building
        return onSnapshot(collection(db, "orders"), (snapshot) => {
          const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            formattedTime: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleString() : new Date().toLocaleString(),
          }));
          // Sort client-side
          orders.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          callback(orders);
        });
      }
    );
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
