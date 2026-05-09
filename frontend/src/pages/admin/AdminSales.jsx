import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const AdminSales = () => {

  const [states, setStates] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: []
  });

  const accessToken = localStorage.getItem("accessToken");

  const fetchStates = async () => {
    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {

        const formattedSales = (res.data.sales || []).map(item => ({
          date: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          }),
          amount: item.amount
        }));

        setStates({
          totalUsers: res.data.totalUsers || 0,
          totalProducts: res.data.totalProducts || 0,
          totalOrders: res.data.totalOrders || 0,
          totalSales: res.data.totalSales || 0,
          salesByDate: formattedSales
        });
      }

    } catch (error) {
      console.log("ERROR FETCHING SALES:", error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  return (
    <div className="
      min-h-screen
      bg-[var(--color-background)]
      text-[var(--color-text)]
      px-4 sm:px-6 lg:px-10 pt-8
      md:pt-32
    ">

      {/* ================= STATS ================= */}
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-4 lg:gap-6
      ">

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow">
          <h1 className="text-sm font-medium opacity-80">
            Total Users
          </h1>

          <div className="mt-2 text-2xl font-bold">
            {states.totalUsers}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow">
          <h1 className="text-sm font-medium opacity-80">
            Total Products
          </h1>

          <div className="mt-2 text-2xl font-bold">
            {states.totalProducts}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow">
          <h1 className="text-sm font-medium opacity-80">
            Total Orders
          </h1>

          <div className="mt-2 text-2xl font-bold">
            {states.totalOrders}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow">
          <h1 className="text-sm font-medium opacity-80">
            Total Sales
          </h1>

          <div className="mt-2 text-2xl font-bold">
            PKR {states.totalSales}
          </div>
        </div>

      </div>

      {/* ================= GRAPH ================= */}
      <div className="mt-10">

        <h1 className="text-xl font-bold mb-4">
          Sales (Last 30 Days)
        </h1>

        <div className="
          h-[320px]
          bg-white/10
          backdrop-blur-md
          rounded-xl
          shadow
          p-4 sm:p-6
        ">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={states.salesByDate}>

              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.1}
              />

              <XAxis
                dataKey="date"
                tick={{ fill: "currentColor", fontSize: 12 }}
              />

              <YAxis
                tick={{ fill: "currentColor", fontSize: 12 }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

export default AdminSales;