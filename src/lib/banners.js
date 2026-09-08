import { db } from "./firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const DEFAULT_BANNERS = [
  {
    id: "banner-poster-1",
    title: "FitCat Special Breakfast Menu",
    image: "/images/hero_poster.jpeg",
    order: 1,
    isBanner: true,
  },
  {
    id: "banner-poster-2",
    title: "Fresh & Sugar Free Daily Menu",
    image: "/images/menu_poster.jpeg",
    order: 2,
    isBanner: true,
  },
];

// Subscribe to real-time Menu Card Poster Images from Cloud Firestore
export function subscribeToBanners(callback) {
  try {
    const menuRef = collection(db, "menu");
    return onSnapshot(
      menuRef,
      (snapshot) => {
        if (snapshot.empty) {
          callback(DEFAULT_BANNERS);
        } else {
          const banners = snapshot.docs
            .map((doc, idx) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                order: Number(data.order || data.displayOrder || idx + 1),
              };
            })
            .filter((item) => item.isBanner === true);

          if (banners.length === 0) {
            callback(DEFAULT_BANNERS);
          } else {
            banners.sort((a, b) => (a.order || 0) - (b.order || 0));
            callback(banners);
          }
        }
      },
      (error) => {
        console.error("Firestore menu posters subscription error: ", error);
        callback(DEFAULT_BANNERS);
      }
    );
  } catch (error) {
    console.error("Error subscribing to menu posters: ", error);
    callback(DEFAULT_BANNERS);
  }
}

// Save or Update Menu Card Image DIRECTLY in Cloud Firestore
export async function saveBannerToFirestore(bannerData) {
  try {
    const bannerId = bannerData.id || `banner-poster-${Date.now()}`;
    const bannerRef = doc(db, "menu", bannerId);
    const payload = {
      id: bannerId,
      title: bannerData.title || "",
      image: bannerData.image,
      order: Number(bannerData.order || 1),
      isBanner: true,
      updatedAt: serverTimestamp(),
    };

    await setDoc(bannerRef, payload, { merge: true });
    return { success: true, id: bannerId };
  } catch (error) {
    console.error("Error saving menu card poster to Firestore: ", error);
    return { success: false, error: error.message };
  }
}

// Delete Menu Card Image DIRECTLY from Cloud Firestore
export async function deleteBannerFromFirestore(bannerId) {
  try {
    const bannerRef = doc(db, "menu", bannerId);
    await deleteDoc(bannerRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu card poster from Firestore: ", error);
    return { success: false, error: error.message };
  }
}

// Reorder Menu Card Images DIRECTLY in Cloud Firestore
export async function reorderBannersInFirestore(bannersList) {
  try {
    for (let i = 0; i < bannersList.length; i++) {
      const banner = bannersList[i];
      const bannerRef = doc(db, "menu", banner.id);
      await setDoc(
        bannerRef,
        {
          order: i + 1,
          isBanner: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
    return { success: true };
  } catch (error) {
    console.error("Error reordering menu card posters in Firestore: ", error);
    return { success: false, error: error.message };
  }
}
