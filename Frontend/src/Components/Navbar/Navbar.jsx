import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";

import LogoutIcon from "@mui/icons-material/Logout";

const LINKS = [
  { label: "Home", path: "/home" },
  { label: "Nutrition", path: "/nutrition" },
  { label: "Habits", path: "/habits" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        px: 4,
        py: 1.5,

        backgroundColor: "#1b5e20",

        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",

        position: "sticky",
        top: 12,
        zIndex: 1000,

        borderRadius: "22px",

        width: "95%",
        mx: "auto",
        mt: 2,
      }}
    >
      {/* LEFT SIDE */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {/* LOGO */}
        <Typography
          onClick={() => navigate("/home")}
          sx={{
            fontWeight: 800,
            fontSize: "1.2rem",
            color: "#fff",
            cursor: "pointer",
            letterSpacing: 1,
          }}
        >
          🌿 Inside Out Tracker
        </Typography>

        {/* LINKS */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {LINKS.map((link) => {
            const isActive =
              location.pathname === link.path;

            return (
              <Button
                key={link.path}
                onClick={() =>
                  navigate(link.path)
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "999px",
                  px: 2.5,

                  color: isActive
                    ? "#1b5e20"
                    : "#fff",

                  backgroundColor: isActive
                    ? "#fff"
                    : "transparent",

                  "&:hover": {
                    backgroundColor: isActive
                      ? "#fff"
                      : "rgba(255,255,255,0.15)",
                  },
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* LOGOUT ICON */}
      <Tooltip title="Logout">
        <IconButton
          onClick={handleLogout}
          sx={{
            color: "#fff",

            "&:hover": {
              backgroundColor:
                "rgba(255,255,255,0.15)",
            },
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}