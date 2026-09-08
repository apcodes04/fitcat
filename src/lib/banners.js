import { db } from "./firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const LOCAL_STORAGE_KEY = "fitcat_promotional_banners_cache";

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

// Helper to get local stored banners as instant fallback
export function getLocalBanners() {
  if (typeof window === "undefined") return DEFAULT_BANNERS;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading local banners:", e);
  }
  return DEFAULT_BANNERS;
}

// Helper to save local banners
export function saveLocalBanners(banners) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(banners));
  } catch (e) {
    console.error("Error saving local banners:", e);
  }
}

// Subscribe to real-time promotional banners with local-first instant fallback
export function subscribeToBanners(callback) {
  // Emit local cache immediately so UI is responsive with 0 delay
  const initialLocal = getLocalBanners();
  callback(initialLocal);

  try {
    const bannersRef = collection(db, "banners");
    return onSnapshot(
      bannersRef,
      async (snapshot) => {
        if (snapshot.empty) {
          // Seed default banners in Firestore if empty
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
          banners.sort((a, b) => (a.order || 0) - (b.order || 0));
          saveLocalBanners(banners);
          callback(banners);
        }
      },
      (error) => {
        console.warn("Firestore banners snapshot error (using local cache):", error);
        callback(getLocalBanners());
      }
    );
  } catch (error) {
    console.error("Error subscribing to banners: ", error);
    callback(getLocalBanners());
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
    console.warn("Could not seed default banners to Firestore:", error);
  }
}

// Save or Update Banner in Firestore with Local Storage Fallback
export async function saveBannerToFirestore(bannerData) {
  const bannerId = bannerData.id || `banner-${Date.now()}`;
  const bannerObj = {
    ...bannerData,
    id: bannerId,
    order: Number(bannerData.order || 1),
    updatedAt: new Date().toISOString(),
  };

  // Always update local storage first so user sees immediate success
  const currentLocal = getLocalBanners();
  const existingIdx = currentLocal.findIndex((b) => b.id === bannerId);
  let updatedLocal;
  if (existingIdx >= 0) {
    updatedLocal = [...currentLocal];
    updatedLocal[existingIdx] = bannerObj;
  } else {
    updatedLocal = [...currentLocal, bannerObj];
  }
  updatedLocal.sort((a, b) => (a.order || 0) - (b.order || 0));
  saveLocalBanners(updatedLocal);

  try {
    const bannerRef = doc(db, "banners", bannerId);
    await setDoc(
      bannerRef,
      {
        ...bannerObj,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true, id: bannerId };
  } catch (error) {
    console.warn("Firestore save banner permission/network warning (saved locally): ", error);
    // Return success since it is saved locally to client cache
    return { success: true, id: bannerId, fallback: true, warning: error.message };
  }
}

// Delete Banner from Firestore & Local Storage
export async function deleteBannerFromFirestore(bannerId) {
  const currentLocal = getLocalBanners();
  const updatedLocal = currentLocal.filter((b) => b.id !== bannerId);
  saveLocalBanners(updatedLocal);

  try {
    await deleteDoc(doc(db, "banners", bannerId));
    return { success: true };
  } catch (error) {
    console.warn("Firestore delete banner warning (deleted locally): ", error);
    return { success: true, fallback: true };
  }
}

// Reorder Banners Batch in Firestore & Local Storage
export async function reorderBannersInFirestore(bannersList) {
  const reordered = bannersList.map((b, idx) => ({ ...b, order: idx + 1 }));
  saveLocalBanners(reordered);

  try {
    for (let i = 0; i < reordered.length; i++) {
      const banner = reordered[i];
      const bannerRef = doc(db, "banners", banner.id);
      await setDoc(bannerRef, { order: i + 1, updatedAt: serverTimestamp() }, { merge: true });
    }
    return { success: true };
  } catch (error) {
    console.warn("Firestore reorder banners warning (reordered locally): ", error);
    return { success: true, fallback: true };
  }
}
