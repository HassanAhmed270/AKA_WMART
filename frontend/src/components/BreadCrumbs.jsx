import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";

const BreadCrumbs = () => {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div
      className="px-6 py-3 md:pt-8"
      style={{
        background: "var(--color-background)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: "rgba(255,255,255,0.4)",
          },
        }}
      >
        {/* Home */}
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          sx={{
            color: "var(--color-text)",
            fontSize: {
              xs: "0.9rem",
              md: "1.35rem", // ✅ 1.5x approx increase
            },
            "&:hover": { color: "#d4af37" },
          }}
        >
          Home
        </Link>

        {/* Dynamic Paths */}
        {pathnames.map((value, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          const label = value.replace(/-/g, " ").toUpperCase();
          const isValidLabel = /^[A-Za-z\s]+$/.test(label);

          if (isLast) {
            return isValidLabel ? (
              <Typography
                key={to}
                sx={{
                  color: "#d4af37",
                  fontWeight: 600,
                  fontSize: {
                    xs: "0.9rem",
                    md: "1.35rem", // ✅ 1.5x size
                  },
                }}
              >
                {label}
              </Typography>
            ) : null;
          }

          return (
            <Link
              key={to}
              component={RouterLink}
              to={to}
              underline="hover"
              sx={{
                color: "var(--color-text)",
                fontSize: {
                  xs: "0.9rem",
                  md: "1.35rem", // ✅ 1.5x size
                },
                "&:hover": { color: "#d4af37" },
              }}
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

export default BreadCrumbs;