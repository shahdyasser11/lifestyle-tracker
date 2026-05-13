import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";


export default function HomePage() {
  const navigate = useNavigate();
  const servicesRef = useRef(null);

  /* animations */
  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
      },
    },
  };

  const slideLeft = {
    hidden: {
      opacity: 0,
      x: 120,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2,
      },
    },
  };

  const slideRight = {
    hidden: {
      opacity: 0,
      x: -120,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2,
      },
    },
  };

  const cardStyle = {
    borderRadius: "2rem",
    p: 3,
    background: "#f5fff5",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    transition: "0.4s ease",
    height: "100%",
    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 20px 40px rgba(46,125,50,0.18)",
    },
  };

  const arrowAnimation = {
    transition: "0.3s ease",
    ".MuiButton-root:hover &": {
      transform: "translateX(6px)",
    },
  };

  const scrollToServices = () => {
  servicesRef.current?.scrollIntoView({
    behavior: "smooth",
  });
};

  return (
    <Box
      sx={{
        backgroundColor: "#eef2f6",
        overflowX: "hidden",
      }}
    >
      {/* HERO SECTION */}

      <Grid
        container
        spacing={6}
        alignItems="center"
        sx={{
          minHeight: "100vh",
          px: { xs: 3, md: 10 },
          py: 8,
        }}
      >
        {/* LEFT TEXT */}

        <Grid item xs={12} md={6}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: "#1b5e20",
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              Build A
              <br />
              Healthier Life
            </Typography>

            <Typography
              sx={{
                color: "#667085",
                fontSize: "1.1rem",
                maxWidth: "500px",
                mb: 4,
              }}
            >
              Improve your lifestyle through smart nutrition tracking,
              personalized workouts, and healthy daily habits.
            </Typography>

            {/* BUTTONS */}

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <motion.div
                whileHover={{
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                <Button
                  variant="contained"
                  onClick={scrollToServices}
                  sx={{
                    borderRadius: "999px",
                    px: 4,
                    py: 1.5,
                    backgroundColor: "#2e7d32",
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "0 10px 25px rgba(46,125,50,0.25)",
                    "&:hover": {
                      backgroundColor: "#1b5e20",
                    },
                  }}
                >
                  Get Started
                </Button>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={scrollToServices}
                  sx={{
                    borderRadius: "999px",
                    px: 4,
                    py: 1.5,
                    borderColor: "#2e7d32",
                    color: "#2e7d32",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Grid>

        {/* RIGHT IMAGE */}

        <Grid item xs={12} md={6}>
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop"
              alt="fitness"
              sx={{
                width: {
                  xs: "100%",
                  md: "100%",
                  lg: "110%",
                },
                // ml: 4,
                borderRadius: "2rem",
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              }}
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* SERVICES SECTION */}

      <Box
        ref={servicesRef}
        sx={{
          px: { xs: 3, md: 10 },
          py: 10,
        }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontWeight: 800,
              color: "#1b5e20",
              mb: 2,
            }}
          >
            Our Services
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "#667085",
              maxWidth: "700px",
              mx: "auto",
              mb: 8,
              fontSize: "1.05rem",
            }}
          >
            Smart health solutions designed to help you stay fit,
            eat healthier, and build stronger habits.
          </Typography>
        </motion.div>

        {/* SERVICE CARDS */}

        <Grid container spacing={4}>
          {/* WORKOUTS */}

          <Grid item xs={12} md={4}>
            <motion.div
              variants={slideRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card sx={cardStyle}>
                <CardContent>
                  <FitnessCenterIcon
                    sx={{
                      fontSize: 55,
                      color: "#2e7d32",
                      mb: 2,
                    }}
                  />

                  <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={2}
                  >
                    Workouts
                  </Typography>

                  <Typography
                    color="text.secondary"
                    mb={3}
                  >
                    Personalized workout plans with
                    progress tracking and performance insights.
                  </Typography>

                  <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        variant="contained"
                        endIcon={
                          <ArrowRightAltIcon
                            sx={arrowAnimation}
                          />
                        }
                        onClick={() => navigate("/workouts")}
                        sx={{
                          borderRadius: "999px",
                          backgroundColor: "#2e7d32",
                          textTransform: "none",
                        }}
                      >
                        Explore
                      </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* NUTRITION */}

          <Grid item xs={12} md={4}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card sx={cardStyle}>
                <CardContent>
                  <RestaurantIcon
                    sx={{
                      fontSize: 55,
                      color: "#2e7d32",
                      mb: 2,
                    }}
                  />

                  <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={2}
                  >
                    Nutrition
                  </Typography>

                  <Typography
                    color="text.secondary"
                    mb={3}
                  >
                    Track calories, protein, and
                    healthy eating habits through interactive dashboards.
                  </Typography>

                  <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        variant="contained"
                        endIcon={
                          <ArrowRightAltIcon
                            sx={arrowAnimation}
                          />
                        }
                        onClick={() => navigate("/nutrition")}
                        sx={{
                          borderRadius: "999px",
                          backgroundColor: "#2e7d32",
                          textTransform: "none",
                        }}
                      >
                        Explore
                      </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* HABITS */}

          <Grid item xs={12} md={4}>
            <motion.div
              variants={slideLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card sx={cardStyle}>
                <CardContent>
                  <PsychologyIcon
                    sx={{
                      fontSize: 55,
                      color: "#2e7d32",
                      mb: 2,
                    }}
                  />

                  <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={2}
                  >
                    Habits
                  </Typography>

                  <Typography
                    color="text.secondary"
                    mb={3}
                  >
                    Build sustainable routines with
                    daily reminders and motivational tracking.
                  </Typography>

                  <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        variant="contained"
                        endIcon={
                          <ArrowRightAltIcon
                            sx={arrowAnimation}
                          />
                        }
                        onClick={() => navigate("/habits")}
                        sx={{
                          borderRadius: "999px",
                          backgroundColor: "#2e7d32",
                          textTransform: "none",
                        }}
                      >
                        Explore
                      </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}