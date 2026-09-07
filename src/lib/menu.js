import { db } from "./firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

const INITIAL_MENU_ITEMS = [
  {
    id: "pb-sandwich",
    name: "Peanut Butter Banana Sandwich",
    price: 50,
    category: "Sandwich",
    badge: "Sugar Free",
    description: "Creamy peanut butter and fresh, sweet banana slices layered for a classic, wholesome energy boost.",
    image: "/images/menu_poster.jpeg",
    inStock: true,
  },
  {
    id: "chia-pudding",
    name: "Superfood Chia Pudding",
    price: 55,
    category: "Pudding",
    badge: "Sugar Free",
    description: "A velvety, nutrient-rich delight with a perfectly creamy texture and natural goodness.",
    image: "/images/hero_poster.jpeg",
    inStock: true,
  },
  {
    id: "rice-cakes",
    name: "Crispy Rice Cakes",
    price: 50,
    category: "Snack",
    badge: "Sugar Free",
    description: "Light, airy, and crisp—the perfect satisfying crunch to keep you fueled and focused.",
    image: "/images/menu_poster.jpeg",
    inStock: true,
  },
  {
    id: "oats",
    name: "Whole Grain Oats",
    price: 65,
    category: "Bowl",
    badge: "Sugar Free",
    description: "A warm, comforting bowl of whole-grain oats, rich in fiber and simmered to a perfect, hearty texture.",
    image: "/images/hero_poster.jpeg",
    inStock: true,
  },
  {
    id: "muesli",
    name: "Toasted Nut Muesli",
    price: 70,
    category: "Bowl",
    badge: "Sugar Free",
    description: "A wholesome, satisfying crunch of toasted oats, premium nuts, and vibrant dried fruits.",
    image: "/images/menu_poster.jpeg",
    inStock: true,
  },
  {
    id: "fruit-bowl",
    name: "Fresh Fruit Bowl",
    price: 50,
    category: "Bowl",
    badge: "Sugar Free",
    description: "A vibrant, refreshing medley of freshly chopped fruits bursting with natural sweetness.",
    image: "/images/hero_poster.jpeg",
    inStock: true,
  },
];

// Subscribe to real-time menu items from Firestore
export function subscribeToMenuItems(callback) {
  try {
    const menuRef = collection(db, "menu");
    return onSnapshot(menuRef, async (snapshot) => {
      if (snapshot.empty) {
        // Seed default items if collection is empty
        await seedDefaultMenu();
      } else {
        const items = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            image: typeof data.image === "string" ? data.image : "",
            images: Array.isArray(data.images) ? data.images : (data.image ? [data.image] : []),
          };
        });
        callback(items);
      }
    });
  } catch (error) {
    console.error("Error subscribing to menu items: ", error);
    callback(INITIAL_MENU_ITEMS);
  }
}

// Seed initial menu into Firestore
async function seedDefaultMenu() {
  try {
    for (const item of INITIAL_MENU_ITEMS) {
      await setDoc(doc(db, "menu", item.id), {
        ...item,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error seeding default menu: ", error);
  }
}

// Save or Update a Menu Item in Firestore (reflects live on website)
export async function saveMenuItemToFirestore(itemData) {
  try {
    const itemId = itemData.id || `item-${Date.now()}`;
    const itemRef = doc(db, "menu", itemId);
    const cleanData = {
      id: itemId,
      name: itemData.name || "Untitled Item",
      price: Number(itemData.price) || 0,
      category: itemData.category || "General",
      badge: itemData.badge || "",
      description: itemData.description || "",
      image: itemData.image ? itemData.image.trim() : "", // Primary cover image
      images: Array.isArray(itemData.images) ? itemData.images : (itemData.image ? [itemData.image.trim()] : []),
      inStock: Boolean(itemData.inStock),
      updatedAt: serverTimestamp(),
    };

    await setDoc(itemRef, cleanData, { merge: true });
    return { success: true, id: itemId };
  } catch (error) {
    console.error("Error saving menu item: ", error);
    return { success: false, error: error.message };
  }
}

// Delete a Menu Item from Firestore
export async function deleteMenuItemFromFirestore(itemId) {
  try {
    await deleteDoc(doc(db, "menu", itemId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu item: ", error);
    return { success: false, error: error.message };
  }
}
