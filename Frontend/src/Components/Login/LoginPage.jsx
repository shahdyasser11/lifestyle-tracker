import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Collapse,
} from "@mui/material";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/Auth/auth";

export default function LoginPage({ show }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  // ================= NOTIFICATION =================
  const [notification, setNotification] =
    useState({
      open: false,
      type: "success",
      message: "",
    });

  // ================= VALIDATION =================
  const validate = () => {
    let tempErrors = {};

    // EMAIL
    if (!formData.email.trim()) {
      tempErrors.email =
        "Email is required";

    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.email
      )
    ) {
      tempErrors.email =
        "Enter a valid email address";
    }

    // PASSWORD
    if (!formData.password) {
      tempErrors.password =
        "Password is required";

    } else if (
      formData.password.length < 8
    ) {
      tempErrors.password =
        "Password must be at least 8 characters";

    } else if (
      !/[A-Z]/.test(formData.password)
    ) {
      tempErrors.password =
        "Password must contain at least one uppercase letter";

    } else if (
      !/[a-z]/.test(formData.password)
    ) {
      tempErrors.password =
        "Password must contain at least one lowercase letter";

    } else if (
      !/[0-9]/.test(formData.password)
    ) {
      tempErrors.password =
        "Password must contain at least one number";
    }

    setErrors(tempErrors);

    return (
      Object.keys(tempErrors).length === 0
    );
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {

      const data = await loginUser(
        formData.email,
        formData.password
      );

      // SUCCESS
      if (data.success) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setNotification({
          open: true,
          type: "success",
          message:
            "Login successful! Redirecting...",
        });

        setTimeout(() => {
          navigate("/home");
        }, 1800);

      } else {

        // FAILED
        setNotification({
          open: true,
          type: "error",
          message:
            data.message ||
            "Invalid email or password",
        });

        setTimeout(() => {
          setNotification((prev) => ({
            ...prev,
            open: false,
          }));
        }, 2500);
      }
    }
  };

  return (
    <>
      {/* FLOATING NOTIFICATION */}
      <Collapse in={notification.open}>
        <Box
          sx={{
            position: "fixed",

            top: 30,

            left: "50%",

            transform:
              "translateX(-50%)",

            zIndex: 99999,

            animation:
              "popupDrop 0.7s ease",
          }}
        >
          <Alert
            severity={
              notification.type
            }
            sx={{
              minWidth: "360px",

              borderRadius: "18px",

              fontWeight: 700,

              fontSize: "1rem",

              alignItems: "center",

              boxShadow:
                "0 18px 45px rgba(0,0,0,0.22)",
            }}
          >
            {notification.message}
          </Alert>
        </Box>
      </Collapse>

      <Box
        sx={{
          position: "absolute",

          top: "50%",

          left: "50%",

          transform: show
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.7)",

          opacity: show ? 1 : 0,

          pointerEvents: show
            ? "auto"
            : "none",

          transition:
            "all 0.6s ease",

          width: 320,

          p: 3,

          borderRadius: 3,

          bgcolor: "white",

          boxShadow:
            "0 20px 60px rgba(0,0,0,0.1)",

          "@keyframes popupDrop": {
            "0%": {
              opacity: 0,

              transform:
                "translateX(-50%) translateY(-80px) scale(0.8)",
            },

            "60%": {
              opacity: 1,

              transform:
                "translateX(-50%) translateY(12px) scale(1.04)",
            },

            "100%": {
              opacity: 1,

              transform:
                "translateX(-50%) translateY(0) scale(1)",
            },
          },
        }}
      >
        {/* BACK BUTTON */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
          }}
        >
          <KeyboardBackspaceIcon
            onClick={() =>
              navigate("/")
            }
            sx={{
              cursor: "pointer",
              color: "#4a6cf7",
            }}
          />
        </Box>

        {/* TITLE */}
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",

            gap: 1,

            mb: 2,

            fontWeight: 600,
          }}
        >
          Welcome Back

          <WavingHandIcon
            sx={{
              color: "#92b5f7",

              transformOrigin:
                "70% 70%",

              animation:
                "wave 1.5s infinite",
            }}
          />

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

        {/* FORM */}
        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          {/* EMAIL */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(
              errors.email
            )}
            helperText={errors.email}
            autoComplete="email"

            inputProps={{
              maxLength: 100,
            }}

            sx={{
              "& .MuiOutlinedInput-root":
                {
                  borderRadius:
                    "12px",

                  "&.Mui-focused fieldset":
                    {
                      borderColor:
                        "#4a6cf7",
                    },
                },
            }}
          />

          {/* PASSWORD */}
          <TextField
            fullWidth
            label="Password"
            name="password"

            type={
              showPassword
                ? "text"
                : "password"
            }

            margin="normal"

            value={formData.password}

            onChange={handleChange}

            error={Boolean(
              errors.password
            )}

            helperText={
              errors.password
            }

            autoComplete="current-password"

            inputProps={{
              maxLength: 50,
            }}

            sx={{
              "& .MuiOutlinedInput-root":
                {
                  borderRadius:
                    "12px",

                  "&.Mui-focused fieldset":
                    {
                      borderColor:
                        "#4a6cf7",
                    },
                },
            }}

            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* LOGIN BUTTON */}
          <Button
            fullWidth
            type="submit"
            variant="contained"

            sx={{
              mt: 2,

              py: 1.2,

              borderRadius:
                "1rem",

              textTransform:
                "none",

              fontSize: "1rem",

              fontWeight: 600,

              bgcolor: "#0a7f0a",

              "&:hover": {
                bgcolor: "#086608",
              },
            }}
          >
            Sign in
          </Button>
        </Box>

        {/* REGISTER LINK */}
        <Box
          sx={{
            display: "flex",

            justifyContent:
              "center",

            gap: 0.5,

            flexWrap: "wrap",

            mt: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#666",
            }}
          >
            Don’t have an account?
          </Typography>

          <Typography
            variant="body2"

            onClick={() =>
              navigate("/register")
            }

            sx={{
              color: "#4a6cf7",

              cursor: "pointer",

              fontWeight: 500,

              "&:hover": {
                textDecoration:
                  "underline",
              },
            }}
          >
            Register now
          </Typography>
        </Box>
      </Box>
    </>
  );
}