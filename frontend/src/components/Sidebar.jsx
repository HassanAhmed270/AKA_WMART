import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LuLayoutDashboard, LuPackagePlus, LuPackageSearch } from "react-icons/lu";
import { FaUsers, FaBars, FaTimes } from "react-icons/fa";
import { TbBorderStyle } from "react-icons/tb";
import { useSelector } from "react-redux";

const Sidebar = () => {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(store => store.user.user);
  const isWorker = user?.role === "worker";

  // 🚀 AUTO REDIRECT ON FIRST LOAD
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      navigate("/dashboard/insights", { replace: true });
    }
  }, []);

  const linkClass = ({ isActive }) =>
    `text-lg flex items-center gap-2 cursor-pointer px-3 py-3 rounded-xl transition-colors
    ${isActive
      ? "bg-[var(--color-primary)] text-white"
      : "hover:bg-[var(--color-primary)]/10 text-[var(--color-text)]"
    }`;

  return (
    <>

      {/* TOP BAR (MOBILE ONLY TOGGLE) */}
      <div className="md:hidden flex items-center p-4 pt-20 border-b border-[var(--color-border-primary)] bg-[var(--color-background)]">

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md bg-[var(--color-primary)] text-white"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      {/* SIDEBAR */}
      <div className={`
        fixed md:static top-0 left-0 z-50
        h-full md:h-screen
        w-[260px]
        bg-[var(--color-background)]
        border-r border-[var(--color-border-primary)]
        p-5 space-y-4
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        <div className="pt-6 md:pt-24 space-y-2">

          <NavLink to="/dashboard/insights" className={linkClass}>
            <LuLayoutDashboard /><span>Insights</span>
          </NavLink>

          {!isWorker && (
            <>

              <NavLink to="/dashboard/users" className={linkClass}>
                <FaUsers /><span>Users</span>
              </NavLink>
            </>
          )}
          <NavLink to="/dashboard/add-products" className={linkClass}>
            <LuPackagePlus /><span>Add Product</span>
          </NavLink>

          <NavLink to="/dashboard/products" className={linkClass}>
            <LuPackageSearch /><span>Products</span>
          </NavLink>
          <NavLink to="/dashboard/orders" className={linkClass}>
            <TbBorderStyle /><span>Orders</span>
          </NavLink>

        </div>

      </div>

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-40"
        />
      )}

    </>
  );
};

export default Sidebar;