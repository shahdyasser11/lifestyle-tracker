import React from "react";
import { Container, Box } from "@mui/material";
import NutritionHistory from "../History/NutritionHistory";

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
      </Container>
    </Box>
  );
}