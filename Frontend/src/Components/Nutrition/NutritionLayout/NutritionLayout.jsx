import React from "react";
import { Container, Box } from "@mui/material";
import NutritionHistory from "../Nutrition/NutritionHistory";
import Feedback from "../Nutrition/Feedback";
import Meals from "../Nutrition/Meals"

export default function NutritionLayout() {
  return (
    <Box
      sx={{
        backgroundColor: "#eef2f6", 
        minHeight: "100vh",
        py: 5, 
      }}
    >
      <Container maxWidth="lg">
        <NutritionHistory />
        <Feedback />
        <Meals />
      </Container>
    </Box>
  );
}