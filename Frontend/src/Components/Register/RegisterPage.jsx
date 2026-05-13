import { useState } from "react";

import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  InputAdornment,
  IconButton,
  Alert,
  Collapse,
} from "@mui/material";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useNavigate } from "react-router-dom";

import { registerUser } from "../../services/Auth/auth";

export default function RegisterPage({ show }) {

  const navigate = useNavigate();

  // ================= STATES =================
  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      age: "",
      weight: "",
      height: "",
      gender: "",
    });

  const [errors, setErrors] =
    useState({});

  // ================= FLOATING NOTIFICATION =================
  const [notification, setNotification] =
    useState({
      open: false,
      type: "success",
      message: "",
    });

  // ================= VALIDATE FIELD =================
  const validateField = (
    name,
    value
  ) => {

    let error = "";

    // FIRST NAME
    if (name === "firstName") {

      if (!value.trim()) {

        error =
          "First name is required";

      } else if (
        value.length < 2
      ) {

        error =
          "First name must be at least 2 characters";

      } else if (
        !/^[A-Za-z]+$/.test(value)
      ) {

        error =
          "First name must contain letters only";
      }
    }

    // LAST NAME
    if (name === "lastName") {

      if (!value.trim()) {

        error =
          "Last name is required";

      } else if (
        value.length < 2
      ) {

        error =
          "Last name must be at least 2 characters";

      } else if (
        !/^[A-Za-z]+$/.test(value)
      ) {

        error =
          "Last name must contain letters only";
      }
    }

    // EMAIL
    if (name === "email") {

      if (!value.trim()) {

        error =
          "Email is required";

      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
          value
        )
      ) {

        error =
          "Enter a valid email address";
      }
    }

    // PASSWORD
    if (name === "password") {

      if (!value) {

        error =
          "Password is required";

      } else if (
        value.length < 8
      ) {

        error =
          "Password must be at least 8 characters";

      } else if (
        !/[A-Z]/.test(value)
      ) {

        error =
          "Must contain one uppercase letter";

      } else if (
        !/[a-z]/.test(value)
      ) {

        error =
          "Must contain one lowercase letter";

      } else if (
        !/[0-9]/.test(value)
      ) {

        error =
          "Must contain one number";
      }
    }

    // AGE
    if (name === "age") {

      if (!value) {

        error =
          "Age is required";

      } else if (
        value < 10 ||
        value > 100
      ) {

        error =
          "Age must be between 10 and 100";
      }
    }

    // WEIGHT
    if (name === "weight") {

      if (!value) {

        error =
          "Weight is required";

      } else if (
        value < 20 ||
        value > 300
      ) {

        error =
          "Enter a realistic weight";
      }
    }

    // HEIGHT
    if (name === "height") {

      if (!value) {

        error =
          "Height is required";

      } else if (
        value < 80 ||
        value > 250
      ) {

        error =
          "Enter a realistic height";
      }
    }

    // GENDER
    if (name === "gender") {

      if (!value) {

        error =
          "Please select a gender";
      }
    }

    return error;
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {

    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error =
      validateField(
        name,
        value
      );

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // ================= VALIDATE FORM =================
  const validate = () => {

    let tempErrors = {};

    Object.keys(formData).forEach(
      (key) => {

        const error =
          validateField(
            key,
            formData[key]
          );

        if (error) {

          tempErrors[key] =
            error;
        }
      }
    );

    setErrors(tempErrors);

    return (
      Object.keys(tempErrors)
        .length === 0
    );
  };

  // ================= SUBMIT =================
  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    if (validate()) {

      const data =
        await registerUser({
          firstName:
            formData.firstName,

          lastName:
            formData.lastName,

          username:
            formData.email,

          password:
            formData.password,

          age: formData.age,

          gender:
            formData.gender,

          height:
            formData.height,

          weight:
            formData.weight,
        });

      // SUCCESS
      if (data.success) {

        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user
          )
        );

        setNotification({
          open: true,

          type: "success",

          message:
            "Registration successful! Redirecting...",
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
            "Registration failed",
        });

        setTimeout(() => {

          setNotification(
            (prev) => ({
              ...prev,
              open: false,
            })
          );

        }, 2500);
      }
    }
  };

  return (
    <>
      {/* FLOATING POPUP */}
      <Collapse
        in={notification.open}
      >
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

              borderRadius:
                "18px",

              fontWeight: 700,

              fontSize: "1rem",

              alignItems:
                "center",

              boxShadow:
                "0 18px 45px rgba(0,0,0,0.22)",
            }}
          >
            {
              notification.message
            }
          </Alert>
        </Box>
      </Collapse>

      {/* MAIN CARD */}
      <Box
        sx={{
          position: "absolute",

          top: "55%",

          left: "50%",

          transform: show
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.9)",

          opacity: show
            ? 1
            : 0,

          pointerEvents: show
            ? "auto"
            : "none",

          transition:
            "all 0.5s ease",

          width: "90%",

          maxWidth: "800px",

          height: "70vh",

          p: 4,

          borderRadius:
            "20px",

          bgcolor: "white",

          boxShadow:
            "0 30px 80px rgba(0,0,0,0.2)",

          display: "flex",

          flexDirection:
            "column",

          gap: 2,

          overflowY: "auto",

          "@keyframes popupDrop":
            {
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
        <KeyboardBackspaceIcon
          onClick={() =>
            navigate("/")
          }

          sx={{
            cursor: "pointer",

            color: "#4a6cf7",
          }}
        />

        {/* TITLE */}
        <Typography
          variant="h4"

          sx={{
            textAlign:
              "center",

            fontWeight: 600,

            mb: 1,
          }}
        >
          Create Account
        </Typography>

        {/* FORM */}
        <Box
          component="form"

          onSubmit={
            handleSubmit
          }
        >
          {/* GRID */}
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns:
                {
                  xs: "1fr",

                  sm: "1fr 1fr",
                },

              gap: 2,
            }}
          >
            {/* FIRST NAME */}
            <TextField
              label="First Name"

              name="firstName"

              fullWidth

              value={
                formData.firstName
              }

              onChange={
                handleChange
              }

              error={Boolean(
                errors.firstName
              )}

              helperText={
                errors.firstName
              }

              inputProps={{
                maxLength: 30,
              }}
            />

            {/* LAST NAME */}
            <TextField
              label="Last Name"

              name="lastName"

              fullWidth

              value={
                formData.lastName
              }

              onChange={
                handleChange
              }

              error={Boolean(
                errors.lastName
              )}

              helperText={
                errors.lastName
              }

              inputProps={{
                maxLength: 30,
              }}
            />

            {/* EMAIL */}
            <TextField
              label="Email"

              name="email"

              type="email"

              fullWidth

              value={
                formData.email
              }

              onChange={
                handleChange
              }

              error={Boolean(
                errors.email
              )}

              helperText={
                errors.email
              }

              inputProps={{
                maxLength: 100,
              }}
            />

            {/* PASSWORD */}
            <TextField
              label="Password"

              name="password"

              type={
                showPassword
                  ? "text"
                  : "password"
              }

              fullWidth

              value={
                formData.password
              }

              onChange={
                handleChange
              }

              error={Boolean(
                errors.password
              )}

              helperText={
                errors.password
              }

              inputProps={{
                maxLength: 50,
              }}

              InputProps={{
                endAdornment:
                  (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
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

            {/* AGE */}
            <TextField
              label="Age"

              name="age"

              type="number"

              fullWidth

              value={
                formData.age
              }

              onChange={
                handleChange
              }

              error={Boolean(
                errors.age
              )}

              helperText={
                errors.age
              }

              inputProps={{
                min: 10,
                max: 100,
              }}
            />

            {/* WEIGHT */}
            <TextField
              label="Weight (kg)"

              name="weight"

              type="number"

              fullWidth

              value={
                formData.weight
              }

              onChange={
                handleChange
              }

              error={Boolean(
                errors.weight
              )}

              helperText={
                errors.weight
              }

              inputProps={{
                min: 20,
                max: 300,
              }}
            />

            {/* HEIGHT */}
            <TextField
              label="Height (cm)"

              name="height"

              type="number"

              fullWidth

              value={
                formData.height
              }

              onChange={
                handleChange
              }

              error={Boolean(
                errors.height
              )}

              helperText={
                errors.height
              }

              inputProps={{
                min: 80,
                max: 250,
              }}
            />

            {/* GENDER */}
            <TextField
              select

              label="Gender"

              name="gender"

              fullWidth

              value={
                formData.gender
              }

              onChange={
                handleChange
              }

              error={Boolean(
                errors.gender
              )}

              helperText={
                errors.gender
              }
            >
              <MenuItem value="male">
                Male
              </MenuItem>

              <MenuItem value="female">
                Female
              </MenuItem>
            </TextField>
          </Box>

          {/* REGISTER BUTTON */}
          <Button
            fullWidth

            type="submit"

            variant="contained"

            sx={{
              mt: 3,

              py: 1.5,

              borderRadius:
                "12px",

              textTransform:
                "none",

              fontSize: "1rem",

              fontWeight: 600,

              bgcolor:
                "#0a7f0a",

              "&:hover": {
                bgcolor:
                  "#086608",
              },
            }}
          >
            Register
          </Button>
        </Box>

        {/* LOGIN LINK */}
        <Box
          sx={{
            display: "flex",

            justifyContent:
              "center",

            gap: 0.5,
          }}
        >
          <Typography
            variant="body2"

            sx={{
              color: "#666",
            }}
          >
            Already have an
            account?
          </Typography>

          <Typography
            variant="body2"

            onClick={() =>
              navigate("/login")
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
            Login
          </Typography>
        </Box>
      </Box>
    </>
  );
}