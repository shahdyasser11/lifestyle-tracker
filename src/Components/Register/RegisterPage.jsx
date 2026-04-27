import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";

export default function RegisterPage({ show }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "absolute",
        top: "55%",
        left: "50%",
        transform: show
          ? "translate(-50%, -50%) scale(1)"
          : "translate(-50%, -50%) scale(0.9)",
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
        transition: "all 0.5s ease",

        width: "90%",
        maxWidth: "800px",
        height: "70vh",

        p: 4,
        borderRadius: "20px",
        bgcolor: "white",
        boxShadow: "0 30px 80px rgba(0,0,0,0.2)",

        display: "flex",
        flexDirection: "column",
        gap: 2,

        overflowY: "auto",
      }}
    >
      {/* Back Button */}
      <KeyboardBackspaceIcon
        onClick={() => navigate("/")}
        sx={{
          cursor: "pointer",
          color: "#4a6cf7",
        }}
      />

      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: 600,
          mb: 1,
        }}
      >
        Create Account
      </Typography>

      {/* Form Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        <TextField label="First Name" fullWidth />
        <TextField label="Last Name" fullWidth />

        <TextField label="Email or Username" fullWidth />
        <TextField label="Password" type="password" fullWidth />

        <TextField label="Age" type="number" fullWidth />
        <TextField label="Weight (kg)" type="number" fullWidth />

        <TextField label="Height (cm)" type="number" fullWidth />
        <TextField select label="Gender" fullWidth>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </TextField>
      </Box>

      {/* Register Button */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          py: 1.5,
          borderRadius: "12px",
          textTransform: "none",
          fontSize: "1rem",
          bgcolor: "#0a7f0a",
          "&:hover": {
            bgcolor: "#086608",
          },
        }}
      >
        Register
      </Button>

      {/* Switch to Login */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 0.5,
        }}
      >
        <Typography variant="body2" sx={{ color: "#666" }}>
          Already have an account?
        </Typography>

        <Typography
          variant="body2"
          onClick={() => navigate("/login")}
          sx={{
            color: "#4a6cf7",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Login
        </Typography>
      </Box>
    </Box>
  );
}