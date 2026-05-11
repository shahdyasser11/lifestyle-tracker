import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const LINKS = [
  { label: "Home", path: "/home" },
  { label: "Nutrition", path: "/nutrition" },
  { label: "Habits", path: "/habits" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

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
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* logo */}
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
        🌿 LifeTracker
      </Typography>

      {/* links */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {LINKS.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Button
              key={link.path}
              onClick={() => navigate(link.path)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "999px",
                px: 2.5,
                color: isActive ? "#1b5e20" : "#fff",
                backgroundColor: isActive ? "#fff" : "transparent",
                "&:hover": {
                  backgroundColor: isActive ? "#fff" : "rgba(255,255,255,0.15)",
                },
              }}
            >
              {link.label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
