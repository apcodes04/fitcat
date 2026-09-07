// Node test script for Firebase Firestore read/write
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAMsja4PwdZOdG6quoBV53PjdFyPP6m6gk",
  authDomain: "fitcat-677ad.firebaseapp.com",
  projectId: "fitcat-677ad",
  storageBucket: "fitcat-677ad.firebasestorage.app",
  messagingSenderId: "269874101544",
  appId: "1:269874101544:web:37a3296aed793794e8241d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testDatabase() {
  console.log("🔥 Testing Firebase Firestore database connection...");
  try {
    // 1. Test Writing a Test Order
    const testOrder = {
      customerName: "Automated System Test",
      customerPhone: "+91 9999999999",
      bookingDate: "2026-09-08",
      timeSlot: "07:30 AM",
      items: [{ name: "Test Chia Pudding", qty: 1, price: 55 }],
      totalAmount: 55,
      status: "Pending",
      notes: "Testing Firebase integration",
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, "orders"), testOrder);
    console.log("✅ SUCCESS: Order saved to Firestore with Document ID:", docRef.id);

    // 2. Test Reading Orders from Firestore
    console.log("📖 Fetching orders from Firestore 'orders' collection...");
    const querySnapshot = await getDocs(collection(db, "orders"));
    console.log(`✅ SUCCESS: Found ${querySnapshot.size} total orders in database!`);
    querySnapshot.forEach((doc) => {
      console.log(` - Order ID [${doc.id}]:`, doc.data().customerName, `(₹${doc.data().totalAmount})`);
    });

  } catch (error) {
    console.error("❌ ERROR connecting to Firestore:", error.message);
  }
  process.exit(0);
}

testDatabase();
