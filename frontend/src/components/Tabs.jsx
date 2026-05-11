import { useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const Tabs = ({
  profilePic,
  handleFileChange,
  handleChange,
  handleSubmit,
  updateUser,
  loading,
  userOrder
}) => {

  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  // 🔥 NEW: lock per order (prevents multiple clicks)
  const [loadingInquiryId, setLoadingInquiryId] = useState(null);

  const inquireOrder = async (order) => {
    try {

      const orderId = order._id;
      const accessToken = localStorage.getItem("accessToken");

      // prevent double click per order
      if (loadingInquiryId === orderId) return;
      setLoadingInquiryId(orderId);

      // company number (Pakistan format fixed)
      let phone = "03351234567";

      // convert to WhatsApp format
      phone = phone.replace(/\D/g, "");
      if (phone.startsWith("0")) {
        phone = "92" + phone.slice(1);
      }

      const userName =
        `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim();

      const message =
        `🛒 Order Inquiry\n\n` +
        `Name: ${userName}\n` +
        `Order ID: ${orderId}\n\n` +
        `Hello, I want to know the status/update of my order. Please assist me.`;

      const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

      // open whatsapp
      const newTab = window.open(url, "_blank");

      if (!newTab) {
        window.location.href = url;
      }

      // optional backend call (kept same idea)
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/inquire`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        alert("Inquiry sent successfully. WhatsApp opened.");
      } else {
        alert("Inquiry recorded but failed response.");
      }

    } catch (error) {
      console.log("Inquiry error:", error);
      alert("Failed to send inquiry");
    } finally {
      setLoadingInquiryId(null);
    }
  };

  return (
    <div className="flex flex-col items-center mt-6 md:mt-10 px-3 md:px-0 w-full">

      {/* TABS HEADER */}
      <div className="flex flex-wrap justify-center gap-2 glass-card p-1 rounded-lg">

        <button
          onClick={() => setActiveTab("profile")}
          className={`
            px-4 md:px-6 py-2 rounded-md text-sm font-medium transition
            ${activeTab === "profile"
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-text)] hover:bg-[var(--color-primary)]/20"
            }
          `}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`
            px-4 md:px-6 py-2 rounded-md text-sm font-medium transition
            ${activeTab === "orders"
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-text)] hover:bg-[var(--color-primary)]/20"
            }
          `}
        >
          Orders
        </button>

      </div>

      {/* CONTENT WRAPPER */}
      <div className="glass-card p-4 md:p-6 mt-4 w-full max-w-5xl">

        {/* ================= PROFILE ================= */}
        {activeTab === "profile" && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* LEFT */}
            <div className="flex flex-col items-center gap-4">

              <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-text)]">
                Update Profile
              </h2>

              <img
                src={profilePic}
                alt="profile"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-[var(--color-primary)]"
              />

              <label className="
                cursor-pointer
                px-4 md:px-5 py-2
                rounded-lg
                font-semibold
                flex items-center gap-2
                transition
                bg-[var(--color-primary)]
                text-white
                hover:opacity-90
              ">
                {loading ? (
                  <>
                    <LuLoaderCircle className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Image"
                )}

                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>

            </div>

            {/* RIGHT */}
            <div className="space-y-3 md:space-y-4">

              <input
                name="firstName"
                value={updateUser.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-2 border rounded-lg bg-transparent text-[var(--color-text)]"
              />

              <input
                name="lastName"
                value={updateUser.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-2 border rounded-lg bg-transparent text-[var(--color-text)]"
              />

              <input
                name="email"
                value={updateUser.email}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-white/10 text-[var(--color-text)]"
              />

              <input
                name="phoneNo"
                value={updateUser.phoneNo}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-2 border rounded-lg bg-transparent text-[var(--color-text)]"
              />

              <input
                name="address"
                value={updateUser.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-2 border rounded-lg bg-transparent text-[var(--color-text)]"
              />

              <input
                name="city"
                value={updateUser.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full p-2 border rounded-lg bg-transparent text-[var(--color-text)]"
              />

              <input
                name="zipCode"
                value={updateUser.zipCode}
                onChange={handleChange}
                placeholder="Zip Code"
                className="w-full p-2 border rounded-lg bg-transparent text-[var(--color-text)]"
              />

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full py-2 rounded-lg
                  flex justify-center items-center gap-2
                  text-white font-semibold
                  bg-[var(--color-primary)]
                  hover:opacity-90
                  transition
                "
              >
                {loading ? (
                  <>
                    <LuLoaderCircle className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>

            </div>

          </form>
        )}

        {/* ================= ORDERS ================= */}
        {activeTab === "orders" && (
          <div>

            {/* BACK BUTTON */}
            <button
              onClick={() => navigate(-1)}
              className="mb-3 text-[var(--color-text)]"
            >
              <FaArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)]">
              My Orders
            </h2>

            {userOrder?.orders?.length === 0 ? (
              <p className="text-gray-500">No Orders Found</p>
            ) : (
              <div className="space-y-5">

                {userOrder?.orders?.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-xl p-4 md:p-5 border bg-white/5"
                  >

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-3">

                      <h1 className="font-semibold break-words text-[var(--color-text)]">
                        Order ID: <span className="text-gray-400">{order._id}</span>
                      </h1>

                      <p className="text-[var(--color-text)]">
                        {order.currency} {order.amount?.toFixed?.(2)}
                      </p>

                    </div>

                    {/* USER */}
                    <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-3">

                      <div>
                        <p className="text-[var(--color-text)]">
                          <b>User:</b> {order.user?.firstName} {order.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-400">{order.user?.email}</p>
                      </div>

                      <span className={`
                        px-2 py-1 rounded text-white text-sm w-fit
                        ${order.status === "Paid"
                          ? "bg-green-500"
                          : order.status === "Failed"
                            ? "bg-red-500"
                            : "bg-orange-400"}
                      `}>
                        {order.status}
                      </span>

                    </div>

                    {/* PRODUCTS */}
                    <div className="space-y-2">

                      {order.products?.map((item, i) => (
                        <div
                          key={i}
                          onClick={() => navigate(`/products/${item.productId._id}`)}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/10 p-2 rounded-lg"
                        >

                          <img
                            src={item.productId?.productImg?.[0]?.url}
                            className="w-12 h-12 md:w-14 md:h-14 object-cover rounded"
                            alt=""
                          />

                          <div className="flex-1 min-w-0">
                            <p className="break-words text-[var(--color-text)]">
                              {item.productId?.productName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {item.productId?._id}
                            </p>
                          </div>

                          <p className="text-[var(--color-text)] font-medium">
                            PKR {item.productId?.productPrice} × {item.quantity}
                          </p>

                        </div>
                      ))}

                    </div>

                    {/* INQUIRE BUTTON */}
                    <button
                      disabled={loadingInquiryId === order._id}
                      onClick={() => inquireOrder(order)}
                      className="
                        mt-4 w-full md:w-auto
                        px-4 py-2
                        rounded-md
                        bg-white/10
                        text-blue-500 font-semibold
                        hover:bg-white/20
                        transition
                        border border-blue-500
                        disabled:opacity-50
                      "
                    >
                      {loadingInquiryId === order._id
                        ? "Opening WhatsApp..."
                        : "Inquire Order"}
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Tabs;