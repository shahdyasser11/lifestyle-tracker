import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  LinearProgress,
} from "@mui/material";

import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GrainIcon from "@mui/icons-material/Grain";
import AutorenewIcon from "@mui/icons-material/Autorenew";

export default function Meals() {

  // CURRENT USER VALUES
  const currentData = {
    calories: 1700,
    protein: 85,
    carbs: 150,
  };

  // TARGET VALUES
  const targetData = {
    calories: 2400,
    protein: 140,
    carbs: 250,
  };

  // REMAINING VALUES
  const remaining = {
    calories:
      targetData.calories -
      currentData.calories,

    protein:
      targetData.protein -
      currentData.protein,

    carbs:
      targetData.carbs -
      currentData.carbs,
  };

  // MEAL TYPE
  const [mealType, setMealType] =
    useState("breakfast");

  // MEALS
  const [meals, setMeals] = useState([]);

  // FETCH SUGGESTED MEALS
  useEffect(() => {

    // LATER:
    // axios.get("/api/meals/suggest")

    // TEMP DEMO DATA
    const dummyMeals = [

      {
        id: 1,

        title:
          mealType === "breakfast"
            ? "Protein Breakfast"
            : mealType === "lunch"
            ? "Chicken Pasta Bowl"
            : "Healthy Dinner Plate",

        foods: [
          {
            name: "Eggs",
            quantity: "2 eggs",
          },

          {
            name: "Pasta",
            quantity: "200g",
          },

          {
            name: "Chicken Breast",
            quantity: "150g",
          },

          {
            name: "Olive Oil",
            quantity: "10g",
          },
        ],

        calories: 620,
        protein: 48,
        carbs: 58,

        match: 92,

        reason:
          "Perfect for your remaining protein and calorie targets.",
      },

      {
        id: 2,

        title:
          mealType === "breakfast"
            ? "Oats Energy Meal"
            : mealType === "lunch"
            ? "Rice Chicken Meal"
            : "Balanced Night Meal",

        foods: [
          {
            name: "Oats",
            quantity: "120g",
          },

          {
            name: "Banana",
            quantity: "1 banana",
          },

          {
            name: "Greek Yogurt",
            quantity: "200g",
          },
        ],

        calories: 520,
        protein: 35,
        carbs: 70,

        match: 85,

        reason:
          "Good balanced meal for healthy energy intake.",
      },
    ];

    setMeals(dummyMeals);

  }, [mealType]);

  return (

    <Box
      sx={{
        p: 4,
        mt:3,
        borderRadius:"2rem",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f4fff6, #ffffff)",
      }}
    >

      {/* HEADER */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#1b5e20",
          textAlign: "center",
          mb: 1,
        }}
      >
        Smart Meal Suggestions
      </Typography>

      <Typography
        sx={{
          textAlign: "center",
          color: "#558b2f",
          mb: 5,
          fontSize: "1rem",
        }}
      >
        Personalized meals based on your nutrition goals
      </Typography>

      {/* REMAINING SUMMARY */}
<Card
  sx={{
    borderRadius: "2rem",
    mb: 5,
    background:
      "linear-gradient(135deg, #e8f5e9, #ffffff)",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.08)",
  }}
>
  <CardContent
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >

    <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        mb: 3,
        color: "#2e7d32",
        textAlign: "center",
      }}
    >
      Remaining Nutrition Today
    </Typography>

<Grid
  container
  spacing={2}
  sx={{
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
  }}
>

  {/* CALORIES */}
  <Grid
    size={4}
    sx={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        width: "100%",
        maxWidth: "280px",
        p: 2,
        borderRadius: "1.5rem",
        background: "#fff3e0",
        textAlign: "center",
      }}
    >
      <LocalFireDepartmentIcon
        sx={{
          color: "#ef6c00",
          fontSize: 40,
          mb: 1,
        }}
      />

      <Typography fontWeight="bold">
        {remaining.calories} kcal left
      </Typography>
    </Box>
  </Grid>

  {/* PROTEIN */}
  <Grid
    size={4}
    sx={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        width: "100%",
        maxWidth: "280px",
        p: 2,
        borderRadius: "1.5rem",
        background: "#e8f5e9",
        textAlign: "center",
      }}
    >
      <FitnessCenterIcon
        sx={{
          color: "#2e7d32",
          fontSize: 40,
          mb: 1,
        }}
      />

      <Typography fontWeight="bold">
        {remaining.protein} g protein left
      </Typography>
    </Box>
  </Grid>

  {/* CARBS */}
  <Grid
    size={4}
    sx={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        width: "100%",
        maxWidth: "280px",
        p: 2,
        borderRadius: "1.5rem",
        background: "#e3f2fd",
        textAlign: "center",
      }}
    >
      <GrainIcon
        sx={{
          color: "#1565c0",
          fontSize: 40,
          mb: 1,
        }}
      />

      <Typography fontWeight="bold">
        {remaining.carbs} g carbs left
      </Typography>
    </Box>
  </Grid>

</Grid>

  </CardContent>
</Card>

      {/* MEAL FILTERS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 5,
        }}
      >

        {["breakfast", "lunch", "dinner"].map(
          (type) => (

            <Button
              key={type}
              variant={
                mealType === type
                  ? "contained"
                  : "outlined"
              }
              onClick={() =>
                setMealType(type)
              }
              sx={{
                borderRadius: "999px",
                px: 4,
                py: 1.2,
                textTransform: "capitalize",
                fontWeight: "bold",

                background:
                  mealType === type
                    ? "linear-gradient(135deg, #43cea2, #185a9d)"
                    : "transparent",

                color:
                  mealType === type
                    ? "white"
                    : "#2e7d32",

                borderColor: "#43cea2",

                "&:hover": {
                  transform:
                    "translateY(-2px)",
                },
              }}
            >
              {type}
            </Button>
          )
        )}

      </Box>

      {/* MEALS */}
      <Grid
        container
        spacing={4}
        sx={{
            justifyContent: "center",
        }}
        >

        {meals.map((meal) => (

          <Grid
            size={{
                xs: 12,
                md: 6,
            }}
            key={meal.id}
          >

            <Card
              sx={{
                borderRadius: "2rem",
                height: "100%",
                background:
                  "linear-gradient(135deg, #ffffff, #f4fff6)",
                boxShadow:
                  "0 12px 30px rgba(0,0,0,0.08)",
                transition: "0.35s ease",

                "&:hover": {
                  transform:
                    "translateY(-6px)",
                  boxShadow:
                    "0 16px 40px rgba(0,0,0,0.12)",
                },
              }}
            >

              <CardContent>

                {/* TOP */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <RestaurantIcon
                      sx={{
                        color: "#2e7d32",
                      }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      {meal.title}
                    </Typography>
                  </Box>

                  <Chip
                    label={`${meal.match}% Match`}
                    sx={{
                      background:
                        "linear-gradient(135deg, #66bb6a, #43a047)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />

                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* FOOD ITEMS */}
                <Typography
                  sx={{
                    fontWeight: "bold",
                    mb: 1.5,
                    color: "#2e7d32",
                  }}
                >
                  Meal Contents
                </Typography>

                {meal.foods.map(
                  (food, index) => (

                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        p: 1.2,
                        borderRadius: "1rem",
                        mb: 1,
                        background:
                          "rgba(76,175,80,0.08)",
                      }}
                    >

                      <Typography>
                        {food.name}
                      </Typography>

                      <Typography
                        fontWeight="bold"
                      >
                        {food.quantity}
                      </Typography>

                    </Box>
                  )
                )}

                {/* NUTRITION */}
                <Box
                  sx={{
                    mt: 3,
                    mb: 2,
                  }}
                >

                  <Grid
                    container
                    spacing={2}
                  >

                    <Grid size={4}>
                      <Box
                        sx={{
                          textAlign:
                            "center",
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                        >
                          {meal.calories}
                        </Typography>

                        <Typography
                          variant="caption"
                        >
                          kcal
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid xs={4}>
                      <Box
                        sx={{
                          textAlign:
                            "center",
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                        >
                          {meal.protein}g
                        </Typography>

                        <Typography
                          variant="caption"
                        >
                          protein
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid xs={4}>
                      <Box
                        sx={{
                          textAlign:
                            "center",
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                        >
                          {meal.carbs}g
                        </Typography>

                        <Typography
                          variant="caption"
                        >
                          carbs
                        </Typography>
                      </Box>
                    </Grid>

                  </Grid>

                </Box>

                {/* MATCH */}
                <Typography
                  sx={{
                    mb: 1,
                    color: "#2e7d32",
                    fontWeight: "bold",
                  }}
                >
                  Nutrition Match
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={meal.match}
                  sx={{
                    height: 12,
                    borderRadius: "999px",
                    backgroundColor:
                      "#dcedc8",

                    "& .MuiLinearProgress-bar": {
                      background:
                        "linear-gradient(90deg, #43a047, #66bb6a)",
                    },
                  }}
                />

                {/* REASON */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: "1.5rem",
                    background:
                      "rgba(67,206,162,0.08)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#2e7d32",
                      fontWeight: "bold",
                      mb: 0.5,
                    }}
                  >
                    Why this meal?
                  </Typography>

                  <Typography
                    variant="body2"
                  >
                    {meal.reason}
                  </Typography>
                </Box>

                {/* ACTION BUTTONS */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 3,
                  }}
                >

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      borderRadius: "999px",
                      py: 1,
                      background:
                        "linear-gradient(135deg, #43cea2, #185a9d)",
                    }}
                  >
                    Add To Today
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={
                      <AutorenewIcon />
                    }
                    sx={{
                      borderRadius: "999px",
                      py: 1,
                      borderColor:
                        "#43cea2",
                      color: "#2e7d32",
                    }}
                  >
                    Regenerate
                  </Button>

                </Box>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

    </Box>
  );
}