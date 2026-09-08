"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { subscribeToOrders, updateOrderStatusInFirestore, updateOrderInFirestore, deleteOrderFromFirestore, formatBookingDateText } from "@/lib/orders";
import { subscribeToMenuItems, saveMenuItemToFirestore, deleteMenuItemFromFirestore } from "@/lib/menu";
import { subscribeToBanners, saveBannerToFirestore, deleteBannerFromFirestore } from "@/lib/banners";
import { 
  FaChartSimple, 
  FaGlobe, 
  FaPlus, 
  FaPenToSquare, 
  FaTrashCan, 
  FaCircleInfo, 
  FaXmark, 
  FaMobileScreen, 
  FaCircleCheck, 
  FaPhone, 
  FaCalendarDays, 
  FaClock, 
  FaNoteSticky,
  FaRightFromBracket,
  FaImage,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa6";
import { MdOutlineRestaurantMenu } from "react-icons/md";

// Utility function to compress & resize images client-side for ultra-fast loading
const compressAndResizeImage = (file, maxWidth = 800, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to WebP Data URL
        const compressedDataUrl = canvas.toDataURL("image/webp", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "menu" | "banners"
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [banners, setBanners] = useState([]);
  
  // Modals state
  const [editingItem, setEditingItem] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [deletingMenuItemId, setDeletingMenuItemId] = useState(null);
  const [deletingBannerId, setDeletingBannerId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const isAuthorizedEmail = (email) => {
    if (!email) return false;
    const allowedEmails = (process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    return allowedEmails.includes(email.toLowerCase());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAuthorizedEmail(user.email)) {
        setCurrentUser(user);
        setAuthed(true);
        setCheckingAuth(false);
      } else {
        setAuthed(false);
        setCheckingAuth(false);
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    if (!authed) return;
    const unsubOrders = subscribeToOrders((liveOrders) => setOrders(liveOrders));
    const unsubMenu = subscribeToMenuItems((liveItems) => setMenuItems(liveItems));
    const unsubBanners = subscribeToBanners((liveBanners) => setBanners(liveBanners));
    return () => {
      unsubOrders && unsubOrders();
      unsubMenu && unsubMenu();
      unsubBanners && unsubBanners();
    };
  }, [authed]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0f120f] text-[#FAF9F5] flex flex-col items-center justify-center space-y-4 p-4">
        <Logo className="h-16 w-auto animate-pulse" />
        <p className="text-xs text-[#9A978F]">Verifying Admin Access...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0f120f] text-[#FAF9F5] flex flex-col items-center justify-center space-y-4 p-4 text-center">
        <Logo className="h-16 w-auto" />
        <h2 className="text-xl font-bold text-[#E5C158]">Admin Portal Restricted</h2>
        <p className="text-xs text-[#9A978F] max-w-xs">Redirecting to login portal...</p>
        <a
          href="/admin/login"
          className="bg-[#05c92f] text-[#0f110f] font-bold text-xs px-5 py-2.5 rounded-full shadow hover:bg-[#3ade5c] transition"
        >
          Go to Admin Login
        </a>
      </div>
    );
  }

  // Order Handlers
  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatusInFirestore(orderId, newStatus);
    setStatusMessage(`Updated order status to ${newStatus}`);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleDeleteOrder = async (orderId) => {
    await deleteOrderFromFirestore(orderId);
    setDeletingOrderId(null);
    setStatusMessage("Order deleted from database.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Menu Handlers
  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    await saveMenuItemToFirestore(editingItem);
    setEditingItem(null);
    setStatusMessage("Menu item saved & updated live on website!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleDeleteMenuItem = async (itemId) => {
    await deleteMenuItemFromFirestore(itemId);
    setDeletingMenuItemId(null);
    setStatusMessage("Menu item deleted from website.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleAddNewMenuItem = () => {
    setEditingItem({
      id: `item-${Date.now()}`,
      name: "",
      price: 50,
      category: "Bowl",
      badge: "Sugar Free",
      description: "",
      image: "",
      images: [],
      displayOrder: menuItems.length + 1,
      inStock: true,
    });
  };

  // Banner Handlers
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!editingBanner) return;
    await saveBannerToFirestore(editingBanner);
    setEditingBanner(null);
    setStatusMessage("Promotional banner saved & published live!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleDeleteBanner = async (bannerId) => {
    await deleteBannerFromFirestore(bannerId);
    setDeletingBannerId(null);
    setStatusMessage("Promotional banner removed.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleAddNewBanner = () => {
    setEditingBanner({
      id: `banner-${Date.now()}`,
      title: "",
      subtitle: "",
      image: "",
      order: banners.length + 1,
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  // Analytics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;

  return (
    <div className="min-h-screen bg-[#0f120f] text-[#FAF9F5] font-sans selection:bg-[#05c92f]/20">
      {/* Admin Top Header */}
      <header className="bg-[#162118] border-b border-[#263629] px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <Logo className="h-10 w-auto" />
          <span className="bg-[#E5C158] text-[#0f110f] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Admin Dashboard
          </span>
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <span className="text-xs text-[#E5C158] font-bold bg-[#0a140c] px-3 py-1.5 rounded-full border border-[#263629] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#05c92f] animate-pulse"></span>
              {currentUser.email}
            </span>
          )}
          <a href="/" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#FAF9F5] hover:text-[#E5C158] flex items-center gap-1.5 transition">
            <FaGlobe className="text-[#05c92f]" />
            <span>Live Site</span>
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white px-4 py-2 rounded-full text-xs font-bold transition border border-red-500/40 flex items-center gap-1.5"
          >
            <FaRightFromBracket className="text-xs" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-[#0a140c] border-b border-[#263629] px-6 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-full font-bold text-xs transition flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-[#E5C158] text-[#0f110f] shadow-sm"
                : "bg-[#162118] text-[#9A978F] hover:text-[#FAF9F5] border border-[#263629]"
            }`}
          >
            <FaChartSimple className="text-xs" />
            <span>WhatsApp Orders Log ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-5 py-2.5 rounded-full font-bold text-xs transition flex items-center gap-2 ${
              activeTab === "menu"
                ? "bg-[#E5C158] text-[#0f110f] shadow-sm"
                : "bg-[#162118] text-[#9A978F] hover:text-[#FAF9F5] border border-[#263629]"
            }`}
          >
            <MdOutlineRestaurantMenu className="text-sm" />
            <span>Food Menu & Prices ({menuItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("banners")}
            className={`px-5 py-2.5 rounded-full font-bold text-xs transition flex items-center gap-2 ${
              activeTab === "banners"
                ? "bg-[#E5C158] text-[#0f110f] shadow-sm"
                : "bg-[#162118] text-[#9A978F] hover:text-[#FAF9F5] border border-[#263629]"
            }`}
          >
            <FaImage className="text-xs" />
            <span>Promotional Banners ({banners.length})</span>
          </button>
        </div>
      </div>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Status Notification */}
        {statusMessage && (
          <div className="bg-[#05c92f] text-[#0f110f] font-bold p-3 rounded-full shadow border border-[#05c92f] text-center text-xs flex items-center justify-center gap-2">
            <FaCircleCheck className="text-sm shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* TAB 1: REAL-TIME WHATSAPP ORDERS LOG */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#162118] p-5 rounded-[.75rem] border border-[#263629] shadow-sm">
                <span className="text-xs font-bold text-[#E5C158] uppercase tracking-wider">Total Recorded Orders</span>
                <h3 className="text-3xl font-extrabold text-[#FAF9F5] mt-1">{orders.length}</h3>
              </div>
              <div className="bg-[#162118] p-5 rounded-[.75rem] border border-[#263629] shadow-sm">
                <span className="text-xs font-bold text-[#E5C158] uppercase tracking-wider">Total Projected Revenue</span>
                <h3 className="text-3xl font-extrabold text-[#E5C158] mt-1">₹{totalRevenue}</h3>
              </div>
              <div className="bg-[#162118] p-5 rounded-[.75rem] border border-[#263629] shadow-sm">
                <span className="text-xs font-bold text-[#E5C158] uppercase tracking-wider">Pending Orders Queue</span>
                <h3 className="text-3xl font-extrabold text-yellow-400 mt-1">{pendingOrdersCount}</h3>
              </div>
            </div>

            {/* Orders Queue Table / Cards */}
            <div className="bg-[#162118] rounded-[.75rem] border border-[#263629] p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#263629] pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#E5C158]">Real-Time Orders Management</h2>
                  <p className="text-xs text-[#9A978F] mt-0.5">Edit order details or remove orders live from Firebase</p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-[#0e2413] text-[#05c92f] border border-[#1b4224] text-xs px-3 py-1 rounded-full font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#05c92f] animate-pulse"></span>
                  Live Firebase Listener Active
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-[#9A978F] text-xs space-y-3">
                  <FaMobileScreen className="text-4xl mx-auto text-[#E5C158]" />
                  <p>No orders logged yet. Place a test pre-order on the main site to see it appear here live!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-[#0a140c] p-5 rounded-[.75rem] border border-[#263629] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-base text-[#FAF9F5]">{order.customerName}</h4>
                          {order.customerPhone && (
                            <a href={`tel:${order.customerPhone}`} className="text-xs text-[#E5C158] hover:underline font-bold inline-flex items-center gap-1">
                              <FaPhone className="text-[10px]" />
                              <span>{order.customerPhone}</span>
                            </a>
                          )}
                          <span className="text-[11px] text-[#9A978F]">{order.formattedTime}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#E5C158]">
                          <span className="inline-flex items-center gap-1">
                            <FaCalendarDays className="text-[10px] text-[#05c92f]" />
                            <span>Date: <strong>{formatBookingDateText(order.bookingDate)}</strong></span>
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <FaClock className="text-[10px] text-[#05c92f]" />
                            <span>Time: <strong>{order.timeSlot}</strong></span>
                          </span>
                        </div>

                        {/* Order Items list */}
                        <div className="pt-2">
                          <p className="text-xs font-bold text-[#9A978F] mb-1">Items Ordered:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items?.map((item, idx) => (
                              <span key={idx} className="bg-[#162118] px-2.5 py-1 rounded-full text-xs border border-[#263629] font-medium text-[#FAF9F5]">
                                {item.name} × <strong>{item.qty}</strong> (<span className="text-[#E5C158]">₹{item.price * item.qty}</span>)
                              </span>
                            ))}
                          </div>
                        </div>

                        {order.notes && (
                          <p className="text-xs text-[#9A978F] italic pt-1 flex items-center gap-1.5">
                            <FaNoteSticky className="text-xs text-[#E5C158] shrink-0" />
                            <span>Note: {order.notes}</span>
                          </p>
                        )}
                      </div>

                      {/* Status & Controls */}
                      <div className="flex flex-col items-end gap-2 w-full md:w-auto border-t md:border-t-0 border-[#263629] pt-3 md:pt-0">
                        <span className="text-2xl font-extrabold text-[#E5C158]">₹{order.totalAmount}</span>

                        <div className="flex items-center gap-2">
                          <select
                            value={order.status || "Pending"}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer ${
                              order.status === "Completed"
                                ? "bg-green-600 text-white border-green-400"
                                : order.status === "Confirmed"
                                ? "bg-blue-600 text-white border-blue-400"
                                : order.status === "Cancelled"
                                ? "bg-red-600 text-white border-red-400"
                                : "bg-yellow-500 text-[#0f110f] border-yellow-400"
                            }`}
                          >
                            <option value="Pending">● Pending</option>
                            <option value="Confirmed">● Confirmed</option>
                            <option value="Completed">● Completed</option>
                            <option value="Cancelled">● Cancelled</option>
                          </select>

                          <button
                            onClick={() => setDeletingOrderId(order.id)}
                            className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded-full border border-red-500/40 transition flex items-center gap-1"
                            title="Delete Order"
                          >
                            <FaTrashCan className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FOOD MENU & PRICING MANAGER WITH ITEM RANKING */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#162118] p-6 rounded-[.75rem] border border-[#263629] shadow-sm">
              <div>
                <h1 className="text-xl font-bold text-[#E5C158]">Menu & Price Manager</h1>
                <p className="text-xs text-[#9A978F] mt-0.5">
                  Set custom display ranking (#1, #2, #3...), upload multiple photos per item, and adjust food prices live!
                </p>
              </div>

              <button
                onClick={handleAddNewMenuItem}
                className="bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] font-bold px-5 py-2.5 rounded-full shadow-sm text-xs flex items-center gap-2 transition active:scale-95"
              >
                <FaPlus className="text-xs" />
                <span>Add New Menu Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`bg-[#162118] p-5 rounded-[.75rem] border ${
                    item.inStock ? "border-[#263629] hover:border-[#3d5441]" : "border-red-500/40 opacity-75"
                  } shadow-sm flex flex-col justify-between space-y-4 overflow-hidden`}
                >
                  <div>
                    {/* Optional Image Thumbnail Preview */}
                    {item.image && item.image.trim() !== "" && (
                      <div className="w-full h-40 rounded-[.5rem] overflow-hidden mb-3 border border-[#263629] bg-[#0a140c] flex items-center justify-center p-1">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[#E5C158] bg-[#0e2413] px-2.5 py-1 rounded-full border border-[#1b4224]">
                          {item.category || "General"}
                        </span>
                        <span className="text-xs font-bold text-[#FAF9F5] bg-[#0a140c] px-2.5 py-1 rounded-full border border-[#263629]">
                          Rank #{item.displayOrder || idx + 1}
                        </span>
                      </div>

                      <button
                        onClick={() => saveMenuItemToFirestore({ ...item, inStock: !item.inStock })}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition flex items-center gap-1.5 ${
                          item.inStock
                            ? "bg-green-500/20 text-green-300 border border-green-500/40"
                            : "bg-red-500/20 text-red-300 border border-red-500/40"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${item.inStock ? "bg-green-400" : "bg-red-400"}`}></span>
                        <span>{item.inStock ? "In Stock" : "Out of Stock"}</span>
                      </button>
                    </div>

                    {/* Golden Yellow Product Name */}
                    <h3 className="text-base font-bold text-[#E5C158] mb-1 tracking-[-.02em]">{item.name}</h3>
                    <p className="text-xs text-[#9A978F] line-clamp-2">{item.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#263629]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#9A978F]">Price (₹)</label>
                      <span className="text-lg font-extrabold text-[#E5C158] bg-[#0a140c] px-3 py-0.5 rounded-full border border-[#263629] tabular-nums">
                        ₹{item.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const images = Array.isArray(item.images) && item.images.length > 0
                            ? item.images
                            : (item.image && item.image.trim() !== "" ? [item.image.trim()] : []);
                          setEditingItem({
                            ...item,
                            image: item.image || "",
                            images: images,
                            displayOrder: item.displayOrder || idx + 1,
                          });
                        }}
                        className="flex-1 bg-[#0a140c] hover:bg-[#263629] text-[#FAF9F5] hover:text-[#E5C158] font-bold py-2 rounded-full border border-[#263629] text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <FaPenToSquare className="text-xs text-[#E5C158]" />
                        <span>Edit Rank & Photos</span>
                      </button>
                      <button
                        onClick={() => setDeletingMenuItemId(item.id)}
                        className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white px-3 py-2 rounded-full border border-red-500/40 text-xs font-bold transition flex items-center justify-center"
                        title="Delete Menu Item"
                      >
                        <FaTrashCan className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROMOTIONAL BANNERS MANAGER */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#162118] p-6 rounded-[.75rem] border border-[#263629] shadow-sm">
              <div>
                <h1 className="text-xl font-bold text-[#E5C158]">Promotional Banners Manager</h1>
                <p className="text-xs text-[#9A978F] mt-0.5">
                  Upload multiple scrollable banner posters displayed right above the FITCAT MENU on mobile and desktop!
                </p>
              </div>

              <button
                onClick={handleAddNewBanner}
                className="bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] font-bold px-5 py-2.5 rounded-full shadow-sm text-xs flex items-center gap-2 transition active:scale-95"
              >
                <FaPlus className="text-xs" />
                <span>Upload New Banner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className="bg-[#162118] p-5 rounded-[.75rem] border border-[#263629] hover:border-[#3d5441] shadow-sm flex flex-col justify-between space-y-4 overflow-hidden"
                >
                  <div>
                    {banner.image && (
                      <div className="w-full h-44 rounded-[.5rem] overflow-hidden mb-3 border border-[#263629] bg-[#0a140c] flex items-center justify-center p-1">
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-[#E5C158] bg-[#0e2413] px-2.5 py-0.5 rounded-full border border-[#1b4224] inline-block mb-2">
                      Banner #{banner.order || idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-[#FAF9F5] mb-1">{banner.title || "Promotional Banner"}</h3>
                    <p className="text-xs text-[#9A978F]">{banner.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[#263629]">
                    <button
                      onClick={() => setEditingBanner(banner)}
                      className="flex-1 bg-[#0a140c] hover:bg-[#263629] text-[#FAF9F5] hover:text-[#E5C158] font-bold py-2 rounded-full border border-[#263629] text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <FaPenToSquare className="text-xs text-[#E5C158]" />
                      <span>Edit Banner</span>
                    </button>
                    <button
                      onClick={() => setDeletingBannerId(banner.id)}
                      className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white px-3 py-2 rounded-full border border-red-500/40 text-xs font-bold transition flex items-center justify-center"
                      title="Delete Banner"
                    >
                      <FaTrashCan className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* EDIT MENU ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#162118] border border-[#263629] rounded-[.75rem] p-6 max-w-lg w-full text-[#FAF9F5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#263629] pb-3">
              <h3 className="text-lg font-bold text-[#E5C158]">
                {editingItem.name ? `Edit "${editingItem.name}"` : "Add New Menu Item"}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-[#9A978F] hover:text-[#FAF9F5] p-1.5 rounded-full hover:bg-[#263629] transition">
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#E5C158] mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Peanut Butter Banana Sandwich"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#E5C158] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#E5C158] mb-1">Display Rank (#)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingItem.displayOrder || 1}
                    onChange={(e) => setEditingItem({ ...editingItem, displayOrder: Number(e.target.value) })}
                    className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#E5C158] mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Bowl, Sandwich..."
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E5C158] mb-1">Highlight Badge</label>
                <input
                  type="text"
                  placeholder="Sugar Free, Energy Boost..."
                  value={editingItem.badge || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                  className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-xs text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
                />
              </div>

              {/* Food Images (Multiple Images Support) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-[#E5C158]">Food Images (Add Multiple)</label>
                  {(editingItem.image || (editingItem.images && editingItem.images.length > 0)) && (
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, image: "", images: [] })}
                      className="text-[11px] text-red-400 hover:underline font-bold"
                    >
                      Clear All Images
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block">
                    <span className="text-[11px] text-[#9A978F] font-medium block mb-1">Upload Photos (Shown at Full Resolution without cutting):</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          try {
                            const newCompressed = await Promise.all(
                              files.map((file) => compressAndResizeImage(file))
                            );
                            setEditingItem((prev) => {
                              const existingList = Array.isArray(prev.images) && prev.images.length > 0
                                ? prev.images
                                : (prev.image ? [prev.image] : []);
                              const updatedList = [...existingList, ...newCompressed];
                              return {
                                ...prev,
                                image: updatedList[0] || "",
                                images: updatedList,
                              };
                            });
                          } catch (err) {
                            console.error("Compression error:", err);
                          }
                        }
                      }}
                      className="w-full text-xs text-[#9A978F] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#05c92f] file:text-[#0f110f] hover:file:bg-[#3ade5c] cursor-pointer bg-[#0a140c] border border-[#263629] rounded-lg p-1"
                    />
                  </label>

                  {/* Thumbnail Previews */}
                  {editingItem.images && editingItem.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#263629]">
                      {editingItem.images.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#263629] bg-[#0a140c] p-0.5">
                          <img src={imgUrl} alt="preview" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedList = editingItem.images.filter((_, i) => i !== imgIdx);
                              setEditingItem({
                                ...editingItem,
                                image: updatedList[0] || "",
                                images: updatedList,
                              });
                            }}
                            className="absolute top-0.5 right-0.5 bg-black/80 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                            title="Remove photo"
                          >
                            <FaXmark className="w-3 h-3" />
                          </button>
                          {editingItem.image === imgUrl && (
                            <span className="absolute bottom-0 inset-x-0 bg-[#05c92f] text-[#0f110f] text-[9px] font-bold text-center py-0.5">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E5C158] mb-1">Item Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe ingredients, taste, fiber..."
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-xs text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
                />
              </div>

              <div className="pt-3 border-t border-[#263629] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-full border border-[#263629] text-xs font-bold text-[#9A978F] hover:text-[#FAF9F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] text-xs font-bold shadow transition"
                >
                  Save Item & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROMOTIONAL BANNER MODAL */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#162118] border border-[#263629] rounded-[.75rem] p-6 max-w-md w-full text-[#FAF9F5] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#263629] pb-3">
              <h3 className="text-lg font-bold text-[#E5C158]">
                {editingBanner.title ? `Edit Banner` : "Add New Banner"}
              </h3>
              <button onClick={() => setEditingBanner(null)} className="text-[#9A978F] hover:text-[#FAF9F5] p-1.5 rounded-full hover:bg-[#263629] transition">
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#E5C158] mb-1">Banner Title</label>
                <input
                  type="text"
                  placeholder="e.g. Good Food • Good Mood"
                  value={editingBanner.title || ""}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E5C158] mb-1">Subtitle / Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Fitcat Daily Special"
                  value={editingBanner.subtitle || ""}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-xs text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E5C158] mb-1">Banner Sequence Order (#)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editingBanner.order || 1}
                  onChange={(e) => setEditingBanner({ ...editingBanner, order: Number(e.target.value) })}
                  className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E5C158] mb-1">Banner Poster Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressed = await compressAndResizeImage(file, 1000, 0.8);
                        setEditingBanner((prev) => ({ ...prev, image: compressed }));
                      } catch (err) {
                        console.error("Banner image compression error:", err);
                      }
                    }
                  }}
                  className="w-full text-xs text-[#9A978F] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#05c92f] file:text-[#0f110f] hover:file:bg-[#3ade5c] cursor-pointer bg-[#0a140c] border border-[#263629] rounded-lg p-1"
                />
              </div>

              {editingBanner.image && (
                <div className="w-full h-36 rounded-lg overflow-hidden border border-[#263629] bg-[#0a140c] flex items-center justify-center p-1">
                  <img src={editingBanner.image} alt="banner preview" className="w-full h-full object-contain" />
                </div>
              )}

              <div className="pt-3 border-t border-[#263629] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 rounded-full border border-[#263629] text-xs font-bold text-[#9A978F] hover:text-[#FAF9F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] text-xs font-bold shadow transition"
                >
                  Save & Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODALS */}
      {deletingMenuItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#162118] border border-[#263629] rounded-[.75rem] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#E5C158]">Delete Menu Item?</h3>
            <p className="text-xs text-[#9A978F]">This will permanently remove the item from fitcat.in!</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingMenuItemId(null)}
                className="px-4 py-2 rounded-full border border-[#263629] text-xs font-bold text-[#9A978F]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMenuItem(deletingMenuItemId)}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingBannerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#162118] border border-[#263629] rounded-[.75rem] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#E5C158]">Delete Banner?</h3>
            <p className="text-xs text-[#9A978F]">This will remove the banner from the promotional carousel.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingBannerId(null)}
                className="px-4 py-2 rounded-full border border-[#263629] text-xs font-bold text-[#9A978F]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBanner(deletingBannerId)}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
