import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

const ShowUserOrders = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [userOrder, setUserOrder] = useState(null);

  const accessToken = localStorage.getItem("accessToken");

  const getUserOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/user-order/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        setUserOrder(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <div className="
      min-h-screen
      bg-[var(--color-background)]
      text-[var(--color-text)]
      px-4 sm:px-6 lg:px-16
      pt-6 md:pt-28
    ">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-4xl ">

      

        {/* TITLE */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          User Orders
        </h2>

        {/* EMPTY STATE */}
        {userOrder?.orders?.length === 0 ? (
          <p className="text-gray-500 text-lg">
            No Orders Found
          </p>
        ) : (
          <div className="space-y-6">

            {userOrder?.orders?.map((order) => (
              <div
                key={order._id}
                className="
                  bg-white/10
                  backdrop-blur-md
                  border border-white/20
                  rounded-xl
                  p-4 sm:p-5
                  shadow-md
                "
              >

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">

                  <h1 className="font-semibold break-words">
                    Order ID:{" "}
                    <span className="text-gray-400 text-sm">
                      {order._id}
                    </span>
                  </h1>

                  <p className="font-medium">
                    {order.currency} {order.amount?.toFixed?.(2)}
                  </p>

                </div>

                {/* USER + STATUS */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">

                  <div>
                    <p>
                      <b>User:</b>{" "}
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {order.user?.email}
                    </p>
                  </div>

                  <span className={`
                    px-3 py-1 flex items-center rounded text-white text-sm w-fit
                    ${order.status === "Paid"
                      ? "bg-green-500"
                      : order.status === "Failed"
                      ? "bg-red-500"
                      : "bg-orange-400"
                    }
                  `}>
                    {order.status}
                  </span>

                </div>

                {/* PRODUCTS */}
                <div>

                  <h3 className="font-medium mb-2">
                    Products
                  </h3>

                  <div className="space-y-2">

                    {order.products?.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => navigate(`/products/${item.productId?._id}`)}
                        className="
                          flex flex-col sm:flex-row
                          items-start sm:items-center
                          gap-3
                          bg-white/5
                          p-3
                          rounded-lg
                          cursor-pointer
                        "
                      >

                        <img
                          src={item.productId?.productImg?.[0]?.url}
                          className="w-14 h-14 object-cover rounded"
                          alt=""
                        />

                        <div className="flex-1 min-w-0">
                          <p className="truncate">
                            {item.productId?.productName}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {item.productId?._id}
                          </p>
                        </div>

                        <p className="font-medium">
                          PKR {item.productId?.productPrice} × {item.quantity}
                        </p>

                      </div>
                    ))}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default ShowUserOrders;