import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import bgImage from "../../assets/imgs/background.jpg";

import LoginPage from "../Login/LoginPage";
import RegisterPage from "../Register/RegisterPage";

import LowerCard from "./Cards/LowerCard";
import LeftCard from "./Cards/LeftCard";
import RightCard from "./Cards/RightCard";
import UpperCard from "./Cards/UpperCard";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [authMode, setAuthMode] = useState(
    location.pathname === "/register"
      ? "register"
      : location.pathname === "/login"
      ? "login"
      : null
  );

  useEffect(() => {
    if (location.pathname === "/login") setAuthMode("login");
    else if (location.pathname === "/register") setAuthMode("register");
    else setAuthMode(null);
  }, [location.pathname]);

  const isAuthOpen = authMode !== null;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        overflowY: "auto",
        bgcolor: "transparent", 

        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {/*  BACKGROUND */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(12px)",
          transform: "scale(1.1)",
          zIndex: -2,
        }}
      />

      {/*  OVERLAY */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.45)",
          zIndex: -1,
        }}
      />

      {/* NAVBAR */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: "98%",
          maxWidth: "1400px",
          height: 70,
          px: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "20px",
          bgcolor: "#2F6B3F",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          zIndex: 20,
        }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 600 }}>
          Welcome to Inside Out Tracker
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Divider */}
        <Box
          sx={{
            height: 28,
            width: "0.2rem",
            bgcolor: "#a7f3d0",
            borderRadius: "2px",
            opacity: 0.6,
          }}
        />

        <Typography
          sx={{
            color: "#a7f3d0",
            fontWeight: 700,
            whiteSpace: "nowrap",
            letterSpacing: 0.5,
            
          }}
        >
          Build a healthy lifestyle
        </Typography>
      </Box>

      </Box>

      {/* CARDS */}
      <Box
        sx={{
          position: "absolute",
          top: "57%",
          left: "50%",
          width: "100%",
          height: "100%",
          transform: "translate(-50%, -50%)",
          p: 1,
        }}
      >
        {/* TOP */}
        <Box
          sx={{
            position: "absolute",
            width: 320,
            height: 255,
            p: 2,
            borderRadius: 3,
            bgcolor: "#f5f6f8",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            bottom: "75%",
            left: "50%",
            transform: isAuthOpen
              ? "translate(-50%, -300px) scale(0.8)"
              : "translate(-50%, 140px) scale(1)",
            opacity: isAuthOpen ? 0 : 1,
            transition: "all 0.8s ease",
            zIndex: 2,
          }}
        >
          <UpperCard />
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            position: "absolute",
            width: 320,
            height: 560,
            p: 2,
            borderRadius: 3,
            bgcolor: "#f5f6f8",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            top: "50%",
            left: "55%",
            transform: isAuthOpen
              ? "translate(450px, -50%) scale(0.8)"
              : "translate(140px, -50%) scale(1)",
            opacity: isAuthOpen ? 0 : 1,
            transition: "all 0.8s ease",
            zIndex: 2,
          }}
        >
          <RightCard />
        </Box>

        {/* BOTTOM */}
        <Box
          sx={{
            position: "absolute",
            width: 320,
            height: 255,
            p: 2,
            borderRadius: 3,
            bgcolor: "#f5f6f8",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            top: "35%",
            left: "50%",
            transform: isAuthOpen
              ? "translate(-50%, 450px) scale(0.8)"
              : "translate(-50%, 140px) scale(1)",
            opacity: isAuthOpen ? 0 : 1,
            transition: "all 0.8s ease",
            zIndex: 2,
          }}
        >
          <LowerCard />
        </Box>

        {/* LEFT */}
        <Box
          sx={{
            position: "absolute",
            width: 320,
            height: 560,
            p: 2,
            borderRadius: 3,
            bgcolor: "#f5f6f8",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            top: "50%",
            right: "55%",
            transform: isAuthOpen
              ? "translate(-450px, -50%) scale(0.8)"
              : "translate(-140px, -50%) scale(1)",
            opacity: isAuthOpen ? 0 : 1,
            transition: "all 0.8s ease",
            zIndex: 2,
          }}
        >
          <LeftCard />
        </Box>
      </Box>

      {/* BUTTON */}
      {!isAuthOpen && (
        <Button
          onClick={() => navigate("/login")}
          variant="contained"
          sx={{
            position: "absolute",
            top: "56%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            px: 3,
            py: 1.5,
            borderRadius: "25px",
            textTransform: "none",
            bgcolor: "#0a7f0a",
            zIndex: 10,
            "&:hover": { bgcolor: "#086608" },
          }}
        >
          Start tracking now
        </Button>
      )}

      {/* AUTH */}
      <LoginPage show={authMode === "login"} />
      <RegisterPage show={authMode === "register"} />
    </Box>
  );
}