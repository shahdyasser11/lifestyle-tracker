import React from "react";
import { Container, Box } from "@mui/material";
import NutritionHistory from "../Nutrition/NutritionHistory";
import Feedback from "../Nutrition/Feedback";
import Meals from "../Nutrition/Meals";
import Navbar from "../../Navbar/Navbar";

export default function NutritionLayout() {
  return (
    <Box
      sx={{
        backgroundColor: "#eef2f6",
        minHeight: "100vh",
      }}
    >
      <Box  sx={{ mt: 3 }}>
        <Navbar />
      </Box>


<Container maxWidth="lg" sx={{ mt: 3 }}>
  <NutritionHistory />
  <Feedback />
  <Meals />
</Container>
    </Box>
  );
}