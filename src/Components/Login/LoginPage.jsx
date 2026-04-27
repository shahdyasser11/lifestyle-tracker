import { Box, TextField, Typography, Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import WavingHandIcon from "@mui/icons-material/WavingHand";

export default function LoginPage({ show }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: show
          ? "translate(-50%, -50%) scale(1)"
          : "translate(-50%, -50%) scale(0.7)",
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
        transition: "all 0.6s ease",
        width: 320,
        p: 3,
        borderRadius: 3,
        bgcolor: "white",
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
      }}
    >
      {/* Back Button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <KeyboardBackspaceIcon
          onClick={() => navigate("/")}
          sx={{
            cursor: "pointer",
            color: "#4a6cf7",
          }}
        />
      </Box>

      {/* Title */}
      <Typography
  variant="h5"
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    mb: 2,
  }}
>
  Welcome Back

  <WavingHandIcon
    sx={{
      color: "#92b5f7",
      transformOrigin: "70% 70%",
      animation: "wave 1.5s infinite",
    }}
  />

  {/* animation */}
  <style>
    {`
      @keyframes wave {
        0% { transform: rotate(0deg); }
        15% { transform: rotate(14deg); }
        30% { transform: rotate(-8deg); }
        45% { transform: rotate(14deg); }
        60% { transform: rotate(-4deg); }
        75% { transform: rotate(10deg); }
        100% { transform: rotate(0deg); }
      }
    `}
  </style>
</Typography>

      {/* Email */}
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        sx={{
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#4a6cf7",
            },
          },
        }}
      />

      {/* Password */}
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        sx={{
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#4a6cf7",
            },
          },
        }}
      />

      {/* Login Button */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          borderRadius: "1rem",
          textTransform: "none",
          bgcolor: "#0a7f0a",
          "&:hover": {
            bgcolor: "#086608",
          },
        }}
      >
        Sign in
      </Button>

      {/* Register Link */}
      <Box
        mt={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 0.5,
          flexWrap: "wrap",
          mt:2,
        
        }}
      >
        <Typography variant="body2" sx={{ color: "#666" }}>
          Don’t have an account?
        </Typography>

        <Typography
          variant="body2"
          onClick={() => navigate("/register")}
          sx={{
            color: "#4a6cf7",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Register now
        </Typography>
      </Box>
    </Box>
  );
}