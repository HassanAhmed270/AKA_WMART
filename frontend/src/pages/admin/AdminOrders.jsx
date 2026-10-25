import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from "@mui/material";
import axios from 'axios';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import userLogo from "../../assets/userLogo.png";
import LoaderScreen from '../../components/LoaderScreen';

const AdminOrders = () => {

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // 🔥 STATUS CONTROL
  const getAllowedStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return ["Pending", "Confirmed"];

      case "Confirmed":
        return ["Confirmed", "Out for Delivery", "Completed"];

      case "Out for Delivery":
        return ["Out for Delivery", "Completed"];

      case "Completed":
        return ["Completed"];

      default:
        return [...new Set([
          currentStatus,
          "Pending",
          "Confirmed",
          "Out for Delivery",
          "Completed"
        ])];
    }
  };

  // 🟢 GET ORDERS
  const getAllOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/all-orders`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      }

    } catch {
      setToast({
        open: true,
        message: "Failed to fetch orders",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  // 🟢 UPDATE STATUS
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/update-status/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId
              ? { ...order, status: newStatus }
              : order
          )
        );

        setToast({
          open: true,
          message: `Status updated to ${newStatus}`,
          severity: "success"
        });
      }

    } catch {
      setToast({
        open: true,
        message: "Update failed",
        severity: "error"
      });
    }
  };

const handleWhatsApp = (order) => {

  const details = order.Details || {};

  const productsList = order.products
    ?.map((p) => {
      const name = p.productId?.productName || "Deleted product";
      const qty = p.quantity || 1;
      return `• ${name} x ${qty}`;
    })
    .join("\n");

  // 🟢 BASE MESSAGE
  let message =
    `🛒 *Order Confirmation*\n\n` +
    `Order ID: ${order._id}\n\n` +
    `Products:\n${productsList}\n\n` +
    `Total: ${order.currency} ${order.amount}\n\n`;

  // 🟡 ADD ADDRESS IF EXISTS
  if (details.address) {
    message +=
      `📍 *Delivery Address Confirmation*\n` +
      `Name: ${details.fullName || "N/A"}\n` +
      `Address: ${details.address}\n` +
      `City: ${details.city || ""}\n` +
      `State: ${details.state || ""}\n` +
      `Zip: ${details.zip || ""}\n` +
      `Country: ${details.country || ""}\n\n` +
      `Please confirm if this address is correct.\n\n`;
  }

  message += `Please confirm your order.`;

  // 🟢 PHONE FROM DETAILS FIRST
  let phone = details.phone || order.phoneNumber;

  if (!phone) {
    alert("Phone number missing in order Details");
    return;
  }

  // clean number
  phone = phone.toString().replace(/\D/g, "");

  // Pakistan format fix
  if (phone.startsWith("0")) {
    phone = "92" + phone.slice(1);
  }

  // validation
  if (phone.length < 11) {
    alert("Invalid phone number: " + phone);
    return;
  }

  const text = encodeURIComponent(message);

  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;

  const newTab = window.open(url, "_blank", "noopener,noreferrer");

  if (!newTab) {
    window.location.href = url;
  }
};

  // 🟢 SEARCH
  const filtered = orders.filter(order => {
    const t = search.toLowerCase();
    const name = `${order.user?.firstName || order.guestDetails?.fullName || ""}`.toLowerCase();
    const email = (order.user?.email || order.guestDetails?.email || "").toLowerCase();

    return (
      name.includes(t) ||
      email.includes(t) ||
      order._id?.toLowerCase().includes(t) ||
      order.status?.toLowerCase().includes(t) ||
      String(order.amount)?.includes(t) ||
      order.products?.some(p =>
        p.productId?.productName?.toLowerCase().includes(t)
      )
    );
  });

  // 🟢 RENDER ORDERS
  const renderOrders = (list, title) => (
    <div className="mt-8">

      <h2 className="text-lg md:text-xl font-bold mb-4 text-[var(--color-text)]">
        {title}
      </h2>

      {list.length === 0 ? (
        <p className="text-gray-500">No {title} Orders</p>
      ) : (
        <div className="space-y-3">

          {list.map(order => (
            <div
              key={order._id}
              className="p-4 md:p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3"
            >

              {/* ORDER ID */}
              <div className="text-xs md:text-sm break-all text-[var(--color-text)]">
                <b>Order ID:</b> {order._id}
              </div>

              {/* USER */}
              <div className="flex items-center gap-3">
                <img
                  src={order.user?.profilePic || order.guestDetails?.profilePic || userLogo}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-[var(--color-text)] font-medium">
                    {order.user?.firstName || order.user?.lastName
                      ? `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim()
                      : order.guestDetails?.fullName || "Unknown User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.user?.email || order.guestDetails?.email || "No email"}
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <div className="flex items-center gap-3 flex-wrap">

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(order._id, e.target.value)
                  }
                  disabled={order.status === "Completed"}
                  className="px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-[var(--color-text)] disabled:opacity-50"
                >
                  {getAllowedStatuses(order.status).map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleWhatsApp(order)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  <FaWhatsapp />
                  Chat
                </button>

              </div>

              {/* PRODUCTS */}
              <div className="text-sm text-gray-400">

                <b className="text-[var(--color-text)]">Products:</b>

                <div className="mt-1 space-y-1">

                  {order.products?.map((p, i) => {

                    const name = p.productId?.productName || "Deleted product";
                    const qty = p.quantity;

                    return (
                      <div key={i} className="text-xs md:text-sm">
                        <span>{name} × {qty}</span>
                      </div>
                    );
                  })}

                </div>
                <p className="mt-2 text-[var(--color-text)]">
                  Total: {order.currency} {order.amount?.toFixed?.(2)}
                </p>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );

  if (loading) return <LoaderScreen />;

  return (
    <div className="p-4 pt-6 md:p-8 md:pt-28">

      <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
        Orders Management
      </h1>

      {/* SEARCH */}
      <div className="relative w-full sm:w-[320px] mt-5">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Orders..."
          className="w-full p-2 pl-3 pr-10 rounded-lg bg-white/10 border border-white/10 text-[var(--color-text)]"
        />

        <FaMagnifyingGlass className="absolute right-3 top-3 text-gray-400" />
      </div>

      {/* GROUPS */}
      {renderOrders(filtered.filter(o => o.status === "Pending"), "Pending")}
      {renderOrders(filtered.filter(o => o.status === "Confirmed"), "Confirmed")}
      {renderOrders(filtered.filter(o => o.status === "Out for Delivery"), "Out for Delivery")}
      {renderOrders(filtered.filter(o => o.status === "Completed"), "Completed")}
      {filtered.some(o => o.status === "Paid") &&
        renderOrders(filtered.filter(o => o.status === "Paid"), "Paid")}
      {filtered.some(o => o.status === "Failed") &&
        renderOrders(filtered.filter(o => o.status === "Failed"), "Failed")}

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default AdminOrders;