"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  subscribeToOrders,
  updateOrderStatusInFirestore,
  updateOrderInFirestore,
  deleteOrderFromFirestore,
  formatBookingDateText,
} from "@/lib/orders";
import {
  subscribeToMenuItems,
  saveMenuItemToFirestore,
  deleteMenuItemFromFirestore,
  reorderMenuItemsInFirestore,
} from "@/lib/menu";
import {
  subscribeToBanners,
  saveBannerToFirestore,
  deleteBannerFromFirestore,
  reorderBannersInFirestore,
} from "@/lib/banners";

// Modular Admin UI Components (AcadBytes Dark System)
import AdminDateFilterModule from "@/components/admin/AdminDateFilterModule";
import AdminStatsGrid from "@/components/admin/AdminStatsGrid";
import AdminItemDemandRanking from "@/components/admin/AdminItemDemandRanking";
import AdminCustomerGroupCard from "@/components/admin/AdminCustomerGroupCard";
import AdminEditOrderModal from "@/components/admin/AdminEditOrderModal";

import {
  FaChartSimple,
  FaGlobe,
  FaPlus,
  FaPenToSquare,
  FaTrashCan,
  FaXmark,
  FaMobileScreen,
  FaCircleCheck,
  FaPhone,
  FaCalendarDays,
  FaClock,
  FaNoteSticky,
  FaRightFromBracket,
  FaImage,
  FaUserGroup,
  FaListUl,
  FaUtensils,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa6";
import { MdOutlineRestaurantMenu } from "react-icons/md";

// Client-side WebP/JPEG Image Compressor for Ultra-Fast Loading & Reliable Mobile Uploads
const compressAndResizeImage = (file, maxWidth = 800, quality = 0.65) => {
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

        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        // If string exceeds 500KB, scale down further to guarantee Firestore save success on mobile
        if (dataUrl.length > 500000) {
          const smallCanvas = document.createElement("canvas");
          const scale = 600 / Math.max(width, 1);
          smallCanvas.width = 600;
          smallCanvas.height = Math.round(height * scale);
          const sCtx = smallCanvas.getContext("2d");
          sCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
          dataUrl = smallCanvas.toDataURL("image/jpeg", 0.55);
        }

        resolve(dataUrl);
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

  // Tabs state
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "menu" | "banners"

  // Firestore real-time collections state
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [banners, setBanners] = useState([]);
  const [isCompressingBanner, setIsCompressingBanner] = useState(false);

  // Modals state
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [deletingMenuItemId, setDeletingMenuItemId] = useState(null);
  const [deletingBannerId, setDeletingBannerId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  // Date Filtering Module state (Default is TOMORROW for store pre-orders)
  const [selectedDateFilter, setSelectedDateFilter] = useState("TOMORROW"); // "TOMORROW" | "TODAY" | "DAY_AFTER" | "CUSTOM" | "ALL"
  const [customDateValue, setCustomDateValue] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [orderViewMode, setOrderViewMode] = useState("grouped"); // "grouped" | "list"
  const [expandedCustomers, setExpandedCustomers] = useState({});

  const toggleCustomerExpand = (name) => {
    setExpandedCustomers((prev) => ({
      ...prev,
      [name]: prev[name] === undefined ? false : !prev[name], // expanded by default unless true in collapsed state
    }));
  };

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
      <div className="min-h-screen bg-[#0f110f] text-[#faf9f5] flex flex-col items-center justify-center space-y-4 p-4">
        <Logo className="h-14 w-auto animate-pulse" />
        <p className="text-xs text-[#9a978f] font-medium tracking-wide">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0f110f] text-[#faf9f5] flex flex-col items-center justify-center space-y-4 p-4 text-center">
        <Logo className="h-14 w-auto" />
        <h2 className="text-xl font-semibold text-[#faf9f5] tracking-[-0.03em]">
          Admin Portal Restricted
        </h2>
        <p className="text-xs text-[#9a978f] max-w-xs">
          Redirecting to secure login page...
        </p>
        <a
          href="/admin/login"
          className="bg-[#05c92f] text-[#0f110f] font-semibold text-xs px-6 py-2.5 rounded-full shadow hover:bg-[#3ade5c] transition-all duration-200"
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
    if (!editingBanner.image || editingBanner.image.trim() === "") {
      alert("Please select a poster image file before saving!");
      return;
    }
    const res = await saveBannerToFirestore(editingBanner);
    if (res.success) {
      setEditingBanner(null);
      setStatusMessage(
        res.fallback
          ? "Promotional banner saved locally!"
          : "Promotional banner saved & published live!"
      );
      setTimeout(() => setStatusMessage(""), 3000);
    } else {
      alert(`Failed to save banner image: ${res.error}`);
    }
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

  const handleMoveBanner = async (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === banners.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updatedBanners = [...banners];
    const temp = updatedBanners[index];
    updatedBanners[index] = updatedBanners[targetIndex];
    updatedBanners[targetIndex] = temp;

    setBanners(updatedBanners);
    await reorderBannersInFirestore(updatedBanners);
    setStatusMessage("Banner display order updated live!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleMoveMenuItem = async (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === menuItems.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updatedItems = [...menuItems];
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[targetIndex];
    updatedItems[targetIndex] = temp;

    setMenuItems(updatedItems);
    await reorderMenuItemsInFirestore(updatedItems);
    setStatusMessage("Menu rank order updated live!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  // DYNAMIC RELATIVE DATE CALCULATIONS
  const now = new Date();
  const todayISO = now.toISOString().split("T")[0];
  const tomorrowISO = new Date(now.getTime() + 86400000).toISOString().split("T")[0];
  const dayAfterISO = new Date(now.getTime() + 86400000 * 2).toISOString().split("T")[0];

  const formattedToday = formatBookingDateText(todayISO);
  const formattedTomorrow = formatBookingDateText(tomorrowISO);
  const formattedDayAfter = formatBookingDateText(dayAfterISO);

  let activeTargetDateText = null;
  if (selectedDateFilter === "TOMORROW") {
    activeTargetDateText = formattedTomorrow;
  } else if (selectedDateFilter === "TODAY") {
    activeTargetDateText = formattedToday;
  } else if (selectedDateFilter === "DAY_AFTER") {
    activeTargetDateText = formattedDayAfter;
  } else if (selectedDateFilter === "CUSTOM") {
    activeTargetDateText = formatBookingDateText(customDateValue);
  }

  // Filter orders based on active target date
  const filteredOrders = orders.filter((order) => {
    if (selectedDateFilter === "ALL") return true;
    if (!activeTargetDateText) return true;
    return formatBookingDateText(order.bookingDate) === activeTargetDateText;
  });

  const activeDateLabel =
    selectedDateFilter === "ALL"
      ? "All Dates"
      : selectedDateFilter === "TOMORROW"
      ? `Tomorrow (${formattedTomorrow})`
      : selectedDateFilter === "TODAY"
      ? `Today (${formattedToday})`
      : selectedDateFilter === "DAY_AFTER"
      ? formattedDayAfter
      : formatBookingDateText(customDateValue) || "Custom Date";

  // Analytics on filtered orders
  const totalFoodItemsOrdered = filteredOrders.reduce((sum, order) => {
    const itemsCount =
      order.items?.reduce((itemSum, item) => itemSum + (Number(item.qty) || 1), 0) || 0;
    return sum + itemsCount;
  }, 0);

  const uniqueCustomersCount = new Set(
    filteredOrders.map((o) => (o.customerName || "").trim().toLowerCase()).filter(Boolean)
  ).size;

  const filteredTotalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (Number(o.totalAmount) || 0),
    0
  );
  const filteredPendingCount = filteredOrders.filter(
    (o) => (o.status || "Pending") === "Pending"
  ).length;

  // Item Demand Breakdown
  const itemDemandSummary = {};
  filteredOrders.forEach((order) => {
    order.items?.forEach((item) => {
      const name = item.name || "Unknown Item";
      const qty = Number(item.qty) || 1;
      itemDemandSummary[name] = (itemDemandSummary[name] || 0) + qty;
    });
  });

  const rankedItemDemand = Object.entries(itemDemandSummary)
    .map(([itemName, totalQty]) => ({ itemName, totalQty }))
    .sort((a, b) => b.totalQty - a.totalQty);

  // Group Filtered Orders by Customer Mobile Number (Primary Key)
  const groupedOrdersMap = {};
  filteredOrders.forEach((order) => {
    const rawPhone = (order.customerPhone || "").replace(/\D/g, "");
    const primaryKeyPhone = rawPhone.length === 10 ? rawPhone : (order.customerPhone && order.customerPhone !== "Not provided" ? order.customerPhone : null);
    const key = primaryKeyPhone || (order.customerName || "Customer").trim();

    if (!groupedOrdersMap[key]) {
      groupedOrdersMap[key] = {
        primaryKeyPhone: primaryKeyPhone || order.customerPhone || "Unregistered Mobile",
        customerName: (order.customerName || "Customer").trim(),
        customerPhone: order.customerPhone || "",
        ordersList: [],
        totalSpent: 0,
        totalItemsCount: 0,
      };
    }
    groupedOrdersMap[key].ordersList.push(order);
    groupedOrdersMap[key].totalSpent += Number(order.totalAmount) || 0;
    const orderItemsCount =
      order.items?.reduce((sum, i) => sum + (Number(i.qty) || 1), 0) || 0;
    groupedOrdersMap[key].totalItemsCount += orderItemsCount;
    if (!groupedOrdersMap[key].customerName && order.customerName) {
      groupedOrdersMap[key].customerName = order.customerName;
    }
  });

  const customerGroupsList = Object.values(groupedOrdersMap);

  return (
    <div className="min-h-screen bg-[#0f110f] text-[#faf9f5] font-sans selection:bg-[#05c92f]/20">
      {/* Top Admin Header (AcadBytes Dark Specs) */}
      <header className="bg-[#171a17] border-b border-[#262a26] px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Logo className="h-9 w-auto" />
          <span className="bg-[#0e2413] border border-[#1b4224] text-[#05c92f] text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            ADMIN DASHBOARD
          </span>
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <span className="text-xs text-[#faf9f5] font-medium bg-[#0a0c0a] px-3.5 py-1.5 rounded-full border border-[#262a26] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#05c92f] animate-pulse"></span>
              {currentUser.email}
            </span>
          )}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[#faf9f5] hover:text-[#05c92f] flex items-center gap-1.5 transition-all duration-200"
          >
            <FaGlobe className="text-[#05c92f]" />
            <span>Live Site</span>
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-600/15 hover:bg-red-600 text-red-300 hover:text-white px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border border-red-500/30 flex items-center gap-1.5"
          >
            <FaRightFromBracket className="text-xs" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Segmented Navigation Tab Switcher */}
      <div className="bg-[#0a0c0a] border-b border-[#262a26] px-6 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#171a17] p-1 rounded-full border border-[#262a26] inline-flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-2 rounded-full font-semibold text-xs transition-all duration-200 flex items-center gap-2 ${
                activeTab === "orders"
                  ? "bg-[#faf9f5] text-[#0f110f] shadow-sm"
                  : "text-[#9a978f] hover:text-[#faf9f5]"
              }`}
            >
              <FaChartSimple className="text-xs" />
              <span>WhatsApp Pre-Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-5 py-2 rounded-full font-semibold text-xs transition-all duration-200 flex items-center gap-2 ${
                activeTab === "menu"
                  ? "bg-[#faf9f5] text-[#0f110f] shadow-sm"
                  : "text-[#9a978f] hover:text-[#faf9f5]"
              }`}
            >
              <MdOutlineRestaurantMenu className="text-sm" />
              <span>Menu & Prices ({menuItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("banners")}
              className={`px-5 py-2 rounded-full font-semibold text-xs transition-all duration-200 flex items-center gap-2 ${
                activeTab === "banners"
                  ? "bg-[#faf9f5] text-[#0f110f] shadow-sm"
                  : "text-[#9a978f] hover:text-[#faf9f5]"
              }`}
            >
              <FaImage className="text-xs" />
              <span>MENU IMAGE UPDATES ({banners.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Dashboard Body */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Status Notification Toast */}
        {statusMessage && (
          <div className="bg-[#0e2413] text-[#05c92f] font-semibold p-3.5 rounded-full shadow border border-[#1b4224] text-center text-xs flex items-center justify-center gap-2 animate-fade-in">
            <FaCircleCheck className="text-sm shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* TAB 1: WHATSAPP PRE-ORDERS LOG & DATE MODULE */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* 1. DYNAMIC PRE-ORDER DATE MODULE */}
            <AdminDateFilterModule
              orders={orders}
              selectedDateFilter={selectedDateFilter}
              setSelectedDateFilter={setSelectedDateFilter}
              customDateValue={customDateValue}
              setCustomDateValue={setCustomDateValue}
            />

            {/* 2. TOP ANALYTICS STATS GRID */}
            <AdminStatsGrid
              totalFoodItemsOrdered={totalFoodItemsOrdered}
              uniqueCustomersCount={uniqueCustomersCount}
              filteredTotalRevenue={filteredTotalRevenue}
              filteredPendingCount={filteredPendingCount}
              filteredOrdersCount={filteredOrders.length}
              dateLabel={activeDateLabel}
            />

            {/* 3. ITEM DEMAND RANKING SUMMARY */}
            <AdminItemDemandRanking
              rankedItemDemand={rankedItemDemand}
              dateLabel={activeDateLabel}
            />

            {/* 4. ORDERS VIEW DIRECTORY */}
            <div className="bg-[#171a17] rounded-xl border border-[#262a26] p-6 shadow-sm space-y-4 transition-all duration-200 hover:border-[#363b36]">
              {/* Directory Header Bar with View Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262a26] pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#faf9f5]">
                    {orderViewMode === "grouped"
                      ? "Customer Pre-Orders Directory"
                      : "WhatsApp Pre-Orders Log"}
                  </h2>
                  <p className="text-xs text-[#9a978f] mt-0.5">
                    Showing pre-orders for <strong>{activeDateLabel}</strong> ({filteredOrders.length} tickets)
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#0a0c0a] p-1 rounded-full border border-[#262a26] self-start sm:self-auto">
                  <button
                    onClick={() => setOrderViewMode("grouped")}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      orderViewMode === "grouped"
                        ? "bg-[#faf9f5] text-[#0f110f] shadow-sm"
                        : "text-[#9a978f] hover:text-[#faf9f5]"
                    }`}
                  >
                    <FaUserGroup className="text-xs" />
                    <span>Grouped ({customerGroupsList.length})</span>
                  </button>
                  <button
                    onClick={() => setOrderViewMode("list")}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      orderViewMode === "list"
                        ? "bg-[#faf9f5] text-[#0f110f] shadow-sm"
                        : "text-[#9a978f] hover:text-[#faf9f5]"
                    }`}
                  >
                    <FaListUl className="text-xs" />
                    <span>Flat List ({filteredOrders.length})</span>
                  </button>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 text-[#9a978f] text-xs space-y-3">
                  <FaMobileScreen className="text-4xl mx-auto text-[#05c92f]" />
                  <p className="max-w-md mx-auto">
                    No pre-orders recorded for <strong>{activeDateLabel}</strong>. Switch to "Tomorrow", "Today", or "All Pre-Orders" to view other dates!
                  </p>
                </div>
              ) : orderViewMode === "grouped" ? (
                /* GROUPED BY CUSTOMER VIEW */
                <div className="space-y-4">
                  {customerGroupsList.map((group, groupIdx) => (
                    <AdminCustomerGroupCard
                      key={groupIdx}
                      group={group}
                      isExpanded={expandedCustomers[group.customerName] !== true} // expanded by default
                      onToggleExpand={() => toggleCustomerExpand(group.customerName)}
                      onStatusChange={handleStatusChange}
                      onEditOrder={(orderToEdit) => setEditingOrder(orderToEdit)}
                      onDeleteOrder={(orderId) => setDeletingOrderId(orderId)}
                    />
                  ))}
                </div>
              ) : (
                /* FLAT ORDERS LIST VIEW */
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-[#0a0c0a] p-5 rounded-xl border border-[#262a26] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm transition-all duration-200 hover:border-[#363b36]"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-base text-[#faf9f5]">
                            {order.customerName}
                          </h4>
                          {order.customerPhone && (
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="text-xs text-[#05c92f] hover:underline font-semibold inline-flex items-center gap-1"
                            >
                              <FaPhone className="text-[10px]" />
                              <span>{order.customerPhone}</span>
                            </a>
                          )}
                          <span className="text-[11px] text-[#9a978f]">{order.formattedTime}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#faf9f5]">
                          <span className="inline-flex items-center gap-1.5 font-semibold bg-[#171a17] px-3 py-1 rounded-full border border-[#262a26]">
                            <FaCalendarDays className="text-[10px] text-[#05c92f]" />
                            <span>Pickup Date: <strong className="text-[#05c92f]">{formatBookingDateText(order.bookingDate)}</strong></span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-semibold bg-[#171a17] px-3 py-1 rounded-full border border-[#262a26]">
                            <FaClock className="text-[10px] text-[#05c92f]" />
                            <span>Time Slot: <strong className="text-[#faf9f5]">{order.timeSlot}</strong></span>
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="pt-1">
                          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9a978f] mb-1">
                            Items Pre-Ordered:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {order.items?.map((item, idx) => (
                              <span
                                key={idx}
                                className="bg-[#171a17] px-3 py-1 rounded-full text-xs border border-[#262a26] font-medium text-[#faf9f5]"
                              >
                                {item.name} × <strong className="text-[#05c92f]">{item.qty}</strong> (
                                <span className="text-yellow-400 font-extrabold">₹{item.price * item.qty}</span>)
                              </span>
                            ))}
                          </div>
                        </div>

                        {order.notes && (
                          <p className="text-xs text-[#9a978f] italic pt-1 flex items-center gap-1.5">
                            <FaNoteSticky className="text-xs text-[#05c92f] shrink-0" />
                            <span>Note: {order.notes}</span>
                          </p>
                        )}
                      </div>

                      {/* Amount, Orange Edit Button, Status Dropdown & Delete (Flex Wrap for 100% Fit on Mobile) */}
                      <div className="flex flex-col items-start sm:items-end gap-2 w-full md:w-auto border-t md:border-t-0 border-[#262a26] pt-3 md:pt-0 shrink-0">
                        <span className="text-xl font-extrabold text-yellow-400 tabular-nums self-end">
                          ₹{order.totalAmount}
                        </span>

                        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 w-full">
                          {/* ORANGE EDIT BUTTON */}
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="bg-orange-600/25 hover:bg-orange-600 text-orange-300 hover:text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full border border-orange-500/40 transition flex items-center gap-1 shadow-sm shrink-0"
                            title="Edit Order Details & Items"
                          >
                            <FaPenToSquare className="w-3 h-3 text-orange-400" />
                            <span>Edit</span>
                          </button>

                          <select
                            value={order.status || "Pending"}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer shrink-0 ${
                              order.status === "Completed"
                                ? "bg-green-600/20 text-green-300 border-green-500/40"
                                : order.status === "Confirmed"
                                ? "bg-blue-600/20 text-blue-300 border-blue-500/40"
                                : order.status === "Cancelled"
                                ? "bg-red-600/20 text-red-300 border-red-500/40"
                                : "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                            }`}
                          >
                            <option value="Pending" className="bg-[#171a17] text-[#faf9f5]">● Pending</option>
                            <option value="Confirmed" className="bg-[#171a17] text-[#faf9f5]">● Confirmed</option>
                            <option value="Completed" className="bg-[#171a17] text-[#faf9f5]">● Completed</option>
                            <option value="Cancelled" className="bg-[#171a17] text-[#faf9f5]">● Cancelled</option>
                          </select>

                          <button
                            onClick={() => setDeletingOrderId(order.id)}
                            className="bg-red-600/15 hover:bg-red-600 hover:text-white text-red-300 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full border border-red-500/30 transition flex items-center gap-1 shrink-0"
                            title="Delete Order Log"
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

        {/* TAB 2: FOOD MENU & PRICE MANAGER WITH DISPLAY RANKING */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#171a17] p-6 rounded-xl border border-[#262a26] shadow-sm">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#9a978f] block">
                  MENU MANAGEMENT
                </span>
                <h1 className="text-lg font-semibold text-[#faf9f5] mt-0.5">
                  Food Menu & Pricing Manager
                </h1>
                <p className="text-xs text-[#9a978f] mt-1">
                  Adjust display ranking (#1, #2...), upload multiple photos, and update prices live on fitcat.in!
                </p>
              </div>

              <button
                onClick={handleAddNewMenuItem}
                className="bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] font-semibold px-5 py-2.5 rounded-full shadow-sm text-xs flex items-center gap-2 transition-all duration-200"
              >
                <FaPlus className="text-xs" />
                <span>Add New Menu Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`bg-[#171a17] p-5 rounded-xl border ${
                    item.inStock ? "border-[#262a26] hover:border-[#363b36]" : "border-red-500/30 opacity-75"
                  } shadow-sm flex flex-col justify-between space-y-4 transition-all duration-200 hover:-translate-y-1`}
                >
                  <div>
                    {item.image && item.image.trim() !== "" && (
                      <div className="w-full h-40 rounded-lg overflow-hidden mb-3 border border-[#262a26] bg-[#0a0c0a] flex items-center justify-center p-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-[#05c92f] bg-[#0e2413] px-2.5 py-1 rounded-full border border-[#1b4224]">
                          {item.category || "General"}
                        </span>
                        <span className="text-xs font-semibold text-[#faf9f5] bg-[#0a0c0a] px-2.5 py-1 rounded-full border border-[#262a26]">
                          Rank #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1 ml-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveMenuItem(idx, "up")}
                            className="bg-[#0a0c0a] hover:bg-[#262a26] disabled:opacity-30 text-[#faf9f5] p-1 rounded border border-[#262a26] text-xs transition"
                            title="Move Rank Up"
                          >
                            <FaArrowUp className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === menuItems.length - 1}
                            onClick={() => handleMoveMenuItem(idx, "down")}
                            className="bg-[#0a0c0a] hover:bg-[#262a26] disabled:opacity-30 text-[#faf9f5] p-1 rounded border border-[#262a26] text-xs transition"
                            title="Move Rank Down"
                          >
                            <FaArrowDown className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => saveMenuItemToFirestore({ ...item, inStock: !item.inStock })}
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition flex items-center gap-1.5 ${
                          item.inStock
                            ? "bg-green-600/20 text-green-300 border border-green-500/30"
                            : "bg-red-600/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${item.inStock ? "bg-green-400" : "bg-red-400"}`}></span>
                        <span>{item.inStock ? "In Stock" : "Out of Stock"}</span>
                      </button>
                    </div>

                    <h3 className="text-base font-semibold text-[#faf9f5] mb-1 tracking-[-0.02em]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#9a978f] line-clamp-2">{item.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#262a26]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#9a978f]">Price (₹)</label>
                      <span className="text-base font-semibold text-[#05c92f] bg-[#0a0c0a] px-3 py-0.5 rounded-full border border-[#262a26] tabular-nums">
                        ₹{item.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const images =
                            Array.isArray(item.images) && item.images.length > 0
                              ? item.images
                              : item.image && item.image.trim() !== ""
                              ? [item.image.trim()]
                              : [];
                          setEditingItem({
                            ...item,
                            image: item.image || "",
                            images: images,
                            displayOrder: item.displayOrder || idx + 1,
                          });
                        }}
                        className="flex-1 bg-[#0a0c0a] hover:bg-[#faf9f5] text-[#faf9f5] hover:text-[#0f110f] font-semibold py-2 rounded-full border border-[#262a26] text-xs transition-all duration-200 flex items-center justify-center gap-1.5"
                      >
                        <FaPenToSquare className="text-xs" />
                        <span>Edit Rank & Photos</span>
                      </button>
                      <button
                        onClick={() => setDeletingMenuItemId(item.id)}
                        className="bg-red-600/15 hover:bg-red-600 text-red-300 hover:text-white px-3 py-2 rounded-full border border-red-500/30 text-xs font-semibold transition flex items-center justify-center"
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

        {/* TAB 3: PROMOTIONAL BANNERS CAROUSEL MANAGER */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#171a17] p-6 rounded-xl border border-[#262a26] shadow-sm">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#9a978f] block">
                  PROMOTIONAL BANNERS
                </span>
                <h1 className="text-lg font-semibold text-[#faf9f5] mt-0.5">
                  Promotional Banner Carousel
                </h1>
                <p className="text-xs text-[#9a978f] mt-1">
                  Upload scrollable banner posters displayed right above the FITCAT Menu on mobile & desktop!
                </p>
              </div>

              <button
                onClick={handleAddNewBanner}
                className="bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] font-semibold px-5 py-2.5 rounded-full shadow-sm text-xs flex items-center gap-2 transition-all duration-200"
              >
                <FaPlus className="text-xs" />
                <span>Upload New Banner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className="bg-[#171a17] p-5 rounded-xl border border-[#262a26] hover:border-[#363b36] shadow-sm flex flex-col justify-between space-y-4 overflow-hidden transition-all duration-200 hover:-translate-y-1"
                >
                  <div>
                    {banner.image && (
                      <div className="w-full h-44 rounded-lg overflow-hidden mb-3 border border-[#262a26] bg-[#0a0c0a] flex items-center justify-center p-1">
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#05c92f] bg-[#0e2413] px-2.5 py-1 rounded-full border border-[#1b4224]">
                        Image #{idx + 1} {idx === 0 ? "(Displays 1st)" : ""}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveBanner(idx, "up")}
                          className="bg-[#0a0c0a] hover:bg-[#262a26] disabled:opacity-30 text-[#faf9f5] p-1.5 rounded-md border border-[#262a26] text-xs transition"
                          title="Move Up"
                        >
                          <FaArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === banners.length - 1}
                          onClick={() => handleMoveBanner(idx, "down")}
                          className="bg-[#0a0c0a] hover:bg-[#262a26] disabled:opacity-30 text-[#faf9f5] p-1.5 rounded-md border border-[#262a26] text-xs transition"
                          title="Move Down"
                        >
                          <FaArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-[#faf9f5] mb-1">
                      {banner.title || "Promotional Banner"}
                    </h3>
                    <p className="text-xs text-[#9a978f]">{banner.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[#262a26]">
                    <button
                      onClick={() => setEditingBanner(banner)}
                      className="flex-1 bg-[#0a0c0a] hover:bg-[#faf9f5] text-[#faf9f5] hover:text-[#0f110f] font-semibold py-2 rounded-full border border-[#262a26] text-xs transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      <FaPenToSquare className="text-xs" />
                      <span>Edit Banner</span>
                    </button>
                    <button
                      onClick={() => setDeletingBannerId(banner.id)}
                      className="bg-red-600/15 hover:bg-red-600 text-red-300 hover:text-white px-3 py-2 rounded-full border border-red-500/30 text-xs font-semibold transition flex items-center justify-center"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171a17] border border-[#262a26] rounded-xl p-6 max-w-lg w-full text-[#faf9f5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#262a26] pb-3">
              <h3 className="text-base font-semibold text-[#faf9f5]">
                {editingItem.name ? `Edit "${editingItem.name}"` : "Add New Menu Item"}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-[#9a978f] hover:text-[#faf9f5] p-1.5 rounded-full hover:bg-[#262a26] transition"
              >
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#faf9f5] mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Peanut Butter Banana Sandwich"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-sm text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#faf9f5] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-sm text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#faf9f5] mb-1">Display Rank (#)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingItem.displayOrder || 1}
                    onChange={(e) => setEditingItem({ ...editingItem, displayOrder: Number(e.target.value) })}
                    className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-sm text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#faf9f5] mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Bowl, Sandwich..."
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-sm text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#faf9f5] mb-1">Highlight Badge</label>
                <input
                  type="text"
                  placeholder="Sugar Free, Energy Boost..."
                  value={editingItem.badge || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                  className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-xs text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
                />
              </div>

              {/* Food Photos Upload (Multiple Images Support) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#faf9f5]">Food Photos</label>
                  {(editingItem.image || (editingItem.images && editingItem.images.length > 0)) && (
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, image: "", images: [] })}
                      className="text-[11px] text-red-400 hover:underline font-semibold"
                    >
                      Clear All Images
                    </button>
                  )}
                </div>

                <div className="space-y-2">
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
                            const existingList =
                              Array.isArray(prev.images) && prev.images.length > 0
                                ? prev.images
                                : prev.image
                                ? [prev.image]
                                : [];
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
                    className="w-full text-xs text-[#9a978f] file:mr-3 file:py-1.5 file:px-3.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#05c92f] file:text-[#0f110f] hover:file:bg-[#3ade5c] cursor-pointer bg-[#0a0c0a] border border-[#262a26] rounded-lg p-1.5"
                  />

                  {editingItem.images && editingItem.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#262a26]">
                      {editingItem.images.map((imgUrl, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#262a26] bg-[#0a0c0a] p-0.5"
                        >
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
                <label className="block text-xs font-semibold text-[#faf9f5] mb-1">
                  Item Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe ingredients, taste, fiber..."
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-xs text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
                />
              </div>

              <div className="pt-3 border-t border-[#262a26] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-full border border-[#262a26] text-xs font-semibold text-[#9a978f] hover:text-[#faf9f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] text-xs font-semibold shadow transition"
                >
                  Save Item & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BANNER MODAL */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171a17] border border-[#262a26] rounded-xl p-6 max-w-md w-full text-[#faf9f5] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262a26] pb-3">
              <h3 className="text-base font-semibold text-[#faf9f5]">
                {editingBanner.title ? `Edit Banner` : "Add New Banner"}
              </h3>
              <button
                onClick={() => setEditingBanner(null)}
                className="text-[#9a978f] hover:text-[#faf9f5] p-1.5 rounded-full hover:bg-[#262a26] transition"
              >
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#faf9f5] mb-1">Banner Title</label>
                <input
                  type="text"
                  placeholder="e.g. Good Food • Good Mood"
                  value={editingBanner.title || ""}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-sm text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#faf9f5] mb-1">Subtitle / Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Fitcat Daily Special"
                  value={editingBanner.subtitle || ""}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-xs text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#faf9f5] mb-1">Banner Poster Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setIsCompressingBanner(true);
                        const compressed = await compressAndResizeImage(file, 800, 0.65);
                        setEditingBanner((prev) => ({ ...prev, image: compressed }));
                      } catch (err) {
                        console.error("Banner compression error:", err);
                        alert("Error processing image file. Please try another photo.");
                      } finally {
                        setIsCompressingBanner(false);
                      }
                    }
                  }}
                  className="w-full text-xs text-[#9a978f] file:mr-3 file:py-1.5 file:px-3.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#05c92f] file:text-[#0f110f] hover:file:bg-[#3ade5c] cursor-pointer bg-[#0a0c0a] border border-[#262a26] rounded-lg p-1.5"
                />
                {isCompressingBanner && (
                  <p className="text-[11px] text-[#05c92f] animate-pulse mt-1 font-semibold">
                    ⚡ Optimizing image for ultra-fast mobile loading...
                  </p>
                )}
              </div>

              {editingBanner.image && !isCompressingBanner && (
                <div className="w-full h-44 rounded-lg overflow-hidden border border-[#262a26] bg-[#0a0c0a] flex items-center justify-center p-1">
                  <img src={editingBanner.image} alt="banner preview" className="w-full h-full object-contain" />
                </div>
              )}

              <div className="pt-3 border-t border-[#262a26] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 rounded-full border border-[#262a26] text-xs font-semibold text-[#9a978f] hover:text-[#faf9f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCompressingBanner}
                  className="px-5 py-2 rounded-full bg-[#05c92f] hover:bg-[#3ade5c] disabled:opacity-50 text-[#0f110f] text-xs font-semibold shadow transition"
                >
                  {isCompressingBanner ? "Processing Image..." : "Save & Publish Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ORDER TICKET MODAL */}
      {editingOrder && (
        <AdminEditOrderModal
          order={editingOrder}
          menuItems={menuItems}
          onClose={() => setEditingOrder(null)}
          onOrderUpdated={(msg) => {
            setStatusMessage(msg);
            setTimeout(() => setStatusMessage(""), 3000);
          }}
        />
      )}

      {/* DELETE CONFIRMATION MODALS */}
      {deletingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171a17] border border-[#262a26] rounded-xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-semibold text-[#faf9f5]">Delete Pre-Order Log?</h3>
            <p className="text-xs text-[#9a978f]">
              This will permanently remove this pre-order log from Firestore.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingOrderId(null)}
                className="px-4 py-2 rounded-full border border-[#262a26] text-xs font-semibold text-[#9a978f]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(deletingOrderId)}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingMenuItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171a17] border border-[#262a26] rounded-xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-semibold text-[#faf9f5]">Delete Menu Item?</h3>
            <p className="text-xs text-[#9a978f]">
              This will permanently remove the item from fitcat.in!
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingMenuItemId(null)}
                className="px-4 py-2 rounded-full border border-[#262a26] text-xs font-semibold text-[#9a978f]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMenuItem(deletingMenuItemId)}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingBannerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171a17] border border-[#262a26] rounded-xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-semibold text-[#faf9f5]">Delete Banner?</h3>
            <p className="text-xs text-[#9a978f]">
              This will remove the banner from the promotional carousel.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingBannerId(null)}
                className="px-4 py-2 rounded-full border border-[#262a26] text-xs font-semibold text-[#9a978f]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBanner(deletingBannerId)}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow"
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
