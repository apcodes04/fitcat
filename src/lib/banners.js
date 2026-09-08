import { db } from "./firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const DEFAULT_BANNERS = [
  {
    id: "banner-1",
    title: "Good Food • Good Mood",
    subtitle: "Fitcat Daily Special",
    image: "/images/hero_poster.jpeg",
    order: 1,
  },
  {
    id: "banner-2",
    title: "Sugar Free Breakfast Menu",
    subtitle: "Fresh Daily at Vikhroli Station",
    image: "/images/menu_poster.jpeg",
    order: 2,
  },
  {
    id: "banner-3",
    title: "Store Contact & Location",
    subtitle: "Pre-Book Orders Till 11:00 PM",
    image: "/images/business_card.jpeg",
    order: 3,
  },
];

// Subscribe to real-time promotional banners from Firestore
export function subscribeToBanners(callback) {
  try {
    const bannersRef = collection(db, "banners");
    return onSnapshot(bannersRef, async (snapshot) => {
      if (snapshot.empty) {
        // Seed default banners if collection is empty & pass default immediately
        callback(DEFAULT_BANNERS);
        await seedDefaultBanners();
      } else {
        const banners = snapshot.docs.map((doc, idx) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            order: Number(data.order || idx + 1),
          };
        });
        // Sort by order
        banners.sort((a, b) => (a.order || 0) - (b.order || 0));
        callback(banners);
      }
    });
  } catch (error) {
    console.error("Error subscribing to banners: ", error);
    callback(DEFAULT_BANNERS);
  }
}

// Seed default banners into Firestore
async function seedDefaultBanners() {
  try {
    for (const banner of DEFAULT_BANNERS) {
      await setDoc(doc(db, "banners", banner.id), {
        ...banner,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error seeding default banners: ", error);
  }
}

// Save or Update Banner in Firestore
export async function saveBannerToFirestore(bannerData) {
  try {
    const bannerId = bannerData.id || `banner-${Date.now()}`;
    const bannerRef = doc(db, "banners", bannerId);
    await setDoc(
      bannerRef,
      {
        ...bannerData,
        id: bannerId,
        order: Number(bannerData.order || 1),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true, id: bannerId };
  } catch (error) {
    console.error("Error saving banner: ", error);
    return { success: false, error: error.message };
  }
}

// Delete Banner from Firestore
export async function deleteBannerFromFirestore(bannerId) {
  try {
    await deleteDoc(doc(db, "banners", bannerId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting banner: ", error);
    return { success: false, error: error.message };
  }
}

// Reorder Banners Batch in Firestore
export async function reorderBannersInFirestore(bannersList) {
  try {
    for (let i = 0; i < bannersList.length; i++) {
      const banner = bannersList[i];
      const bannerRef = doc(db, "banners", banner.id);
      await setDoc(bannerRef, { order: i + 1, updatedAt: serverTimestamp() }, { merge: true });
    }
    return { success: true };
  } catch (error) {
    console.error("Error reordering banners: ", error);
    return { success: false, error: error.message };
  }
}

