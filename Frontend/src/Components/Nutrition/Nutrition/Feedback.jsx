import React, { useMemo, useState, useEffect } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  LinearProgress,
  Divider,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";

import {
  saveTargets,
  calculateDifference,
  calculateDailyNeed,
  isGoalReasonable,
  determineAction,
  calculateProgress,
  calculateDaysLeft,
} from "../../../services/Nutrition/feedback";

import {
  getNutritionHistory, getCurrentNutrition
} from "../../../services/Nutrition/nutritionServices";


export default function Feedback() {

  // CURRENT VALUES
  const [currentData, setCurrentData] =
  useState({

    weight: 0,
    protein: 0,
    calories: 0,
    carbs: 0,
  });

  // TARGET STATES
  const [targets, setTargets] = useState({
    weight: "",
    protein: "",
    calories: "",
    carbs: "",
  });

  const [targetDate, setTargetDate] = useState("");

  const [showFeedback, setShowFeedback] =useState(false);

  useEffect(() => {

  const fetchCurrentData =
    async () => {

try {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const userId = user.user_id;

  const response =
    await getCurrentNutrition(userId);

  const latest = response.data;

  setCurrentData({
    weight:
      latest.current.weight,

    protein:
      latest.current.protein,

    calories:
      latest.current.calories,

    carbs:
      latest.current.carbs,
  });

} catch (error) {
        console.log(error);
      }
    };

  fetchCurrentData();

}, []);
  // DAYS LEFT
  const daysLeft = useMemo(() => {

    return calculateDaysLeft(
      targetDate
    );

  }, [targetDate]);

  // FEEDBACK ANALYSIS
  const analysis = useMemo(() => {

    const nutrition = [

      {
        key: "weight",
        label: "Weight",
        unit: "kg",
        reasonablePerDay: 0.5,
        icon: <MonitorWeightIcon />,
      },

      {
        key: "protein",
        label: "Protein",
        unit: "g",
        reasonablePerDay: 30,
        icon: <FitnessCenterIcon />,
      },

      {
        key: "calories",
        label: "Calories",
        unit: "kcal",
        reasonablePerDay: 120,
        icon: <RestaurantIcon />,
      },

      {
        key: "carbs",
        label: "Carbs",
        unit: "g",
        reasonablePerDay: 10,
        icon: <TrendingUpIcon />,
      },
    ];

    return nutrition.map((item) => {

      const current =
        currentData[item.key];

      const target =
  targets[item.key] === ""
    ? current
    : Number(targets[item.key]);

      const difference =
        calculateDifference(
          current,
          target
        );

      const dailyNeeded =
        calculateDailyNeed(
          difference,
          daysLeft
        );

      const isReasonable =
        isGoalReasonable(
          dailyNeeded,
          item.reasonablePerDay
        );

      const progress =
        calculateProgress(
          dailyNeeded
        );

      return {...item,current,target, difference, dailyNeeded, isReasonable, progress,
         action:
          determineAction(
            difference
          ),
      };

    });

  }, [targets, daysLeft, currentData]);

  const filledTargets =
  analysis.filter(
    (a) => targets[a.key] !== ""
  );

const overallGood =
  filledTargets.every(
    (a) => a.isReasonable
  );

  return (

    <Box
      sx={{
        p: 4,
        mt: 3,
        background:
          "linear-gradient(180deg, #f1fff4, #ffffff)",
        height: "fit-content",
        borderRadius: "2rem",
      }}
    >

      {/* HEADER */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#1b5e20",
          mb: 4,
          textAlign: "center",
        }}
      >
        Nutrition Goal Feedback
      </Typography>

      {/* TARGET FORM */}
      <Card
        sx={{
          borderRadius: "2rem",
          p: 3,
          mb: 5,
          background:
            "linear-gradient(135deg, #e8f5e9, #ffffff)",
          boxShadow:
            "0 12px 32px rgba(0,0,0,0.08)",
        }}
      >

        <CardContent>

          <Grid
  container
  spacing={3}
  justifyContent="center"
>

            {/* Weight */}
            <Grid
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                label="Target Weight (kg)"
                type="number"
                value={targets.weight}

                onChange={(e) => {

                  const value =
                    e.target.value;

                  if (
                    value === "" ||
                    Number(value) > 0
                  ) {

                    setTargets({
                      ...targets,
                      weight: value,
                    });
                  }

                }}

                  InputProps={{
                    inputProps: {
                      min: 1,
                    },
                  }}

                sx={{

                  "& .MuiOutlinedInput-root": {

                    borderRadius: "18px",
                    backgroundColor:
                      "white",
                  },
                }}
              />

            </Grid>

            {/* Protein */}
            <Grid
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                label="Target Protein (g)"
                type="number"
                value={targets.protein}

                onChange={(e) => {

                  const value =
                    e.target.value;

                  if (
                    value === "" ||
                    Number(value) > 0
                  ) {

                    setTargets({
                      ...targets,
                      protein: value,
                    });
                  }

                }}

InputProps={{
  inputProps: {
    min: 1,
  },
}}

                sx={{

                  "& .MuiOutlinedInput-root": {

                    borderRadius: "18px",
                    backgroundColor:
                      "white",
                  },
                }}
              />

            </Grid>

            {/* Calories */}
            <Grid
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                label="Target Calories"
                type="number"
                value={targets.calories}

                onChange={(e) => {

                  const value =
                    e.target.value;

                  if (
                    value === "" ||
                    Number(value) > 0
                  ) {

                    setTargets({
                      ...targets,
                      calories: value,
                    });
                  }

                }}

InputProps={{
  inputProps: {
    min: 1,
  },
}}

                sx={{

                  "& .MuiOutlinedInput-root": {

                    borderRadius: "18px",
                    backgroundColor:
                      "white",
                  },
                }}
              />

            </Grid>

            {/* Carbs */}
            <Grid
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                label="Target Carbs (g)"
                type="number"
                value={targets.carbs}

                onChange={(e) => {

                  const value =
                    e.target.value;

                  if (
                    value === "" ||
                    Number(value) > 0
                  ) {

                    setTargets({
                      ...targets,
                      carbs: value,
                    });
                  }

                }}

InputProps={{
  inputProps: {
    min: 1,
  },
}}

                sx={{

                  "& .MuiOutlinedInput-root": {

                    borderRadius: "18px",
                    backgroundColor:
                      "white",
                  },
                }}
              />

            </Grid>

            {/* DATE */}
            <Grid
              xs={12}
            >

              <Typography
                sx={{
                  mb: 1,
                  fontWeight: "bold",
                  color: "#2e7d32",
                  fontSize: "1rem",
                }}
              >
                Enter Your Targeted Day
              </Typography>

              <TextField
                fullWidth
                type="date"

                value={targetDate}

                onChange={(e) =>
                  setTargetDate(
                    e.target.value
                  )
                }

InputProps={{
  inputProps: {
    min:
      new Date()
        .toISOString()
        .split("T")[0],
  },
}}

                sx={{

                  "& .MuiOutlinedInput-root": {

                    borderRadius: "18px",
                    backgroundColor:
                      "white",
                  },

                  "& input": {
                    padding:
                      "16.5px 14px",
                  },
                }}
              />

            </Grid>

            {/* BUTTON */}
            <Grid
              xs={12}

              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
              }}
            >

              <Button
                variant="contained"

            onClick={async () => {
              try {
                const user = JSON.parse(
                  localStorage.getItem("user")
                );

                const userId = user.user_id;

                const response = await saveTargets({
                  user_id: userId,

                  target_weight: targets.weight,

                  target_protein: targets.protein,

                  target_calories: targets.calories,

                  target_carbs: targets.carbs,
                });

                console.log(response);

                setShowFeedback(true);

              } catch (error) {
                console.error(error);
              }
            }}

                sx={{

                  width: "240px",
                  height: "2.5rem",

                  whiteSpace:
                    "nowrap",

                  py: 1,

                  borderRadius:
                    "999px",

                  fontWeight:
                    "bold",

                  fontSize:
                    "1rem",

                  letterSpacing:
                    "0.5px",

                  background:
                    "linear-gradient(135deg, #43cea2, #185a9d)",

                  boxShadow:
                    "0 10px 28px rgba(24,90,157,0.25)",

                  transition:
                    "0.35s ease",

                  "&:hover": {

                    transform:
                      "translateY(-2px) scale(1.01)",

                    boxShadow:
                      "0 14px 32px rgba(24,90,157,0.35)",
                  },
                }}
              >
                Analyze My Goal
              </Button>

            </Grid>

          </Grid>

        </CardContent>

      </Card>
                {/* FEEDBACK */}
{showFeedback && (

  <Box
    sx={{
      mt: 4,
      mb: 4,
    }}
  >

    {/* ALERT */}
    <Alert
      severity={
        overallGood
          ? "success"
          : "warning"
      }
      sx={{
        mb: 4,
        borderRadius: "1.5rem",
        fontSize: "1rem",
      }}
    >
      {overallGood
        ? "You're so close to your goal. Your plan looks achievable and balanced."
        : "You have become far from your goal. Some targets may be unrealistic for the selected time."}
    </Alert>

{/* ANALYSIS CARDS */}
<Grid
  container
  spacing={4}

  sx={{
    justifyContent: "center",
    alignItems: "stretch",
  }}
>

  {analysis.map((item, index) => (

    <Grid
      key={index}

      item

      xs={12}
      sm={10}
      md={5}

      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >

      <Card
        sx={{

          borderRadius: "2rem",

          width: "100%",

          maxWidth: "520px",

          minHeight: "100%",

          background:
            "linear-gradient(180deg, #ffffff, #f8fff8)",

          boxShadow:
            "0 10px 28px rgba(0,0,0,0.08)",

          transition: "0.3s ease",

          "&:hover": {

            transform:
              "translateY(-4px)",

            boxShadow:
              "0 14px 32px rgba(0,0,0,0.12)",
          },
        }}
      >

        <CardContent>

          {/* HEADER */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >

            <Box
              sx={{
                color: "#2e7d32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </Box>

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: "#1b5e20",
              }}
            >
              {item.label}
            </Typography>

          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* CURRENT */}
          <Typography sx={{ mb: 1 }}>
            Current:
            <strong>
              {" "}
              {item.current} {item.unit}
            </strong>
          </Typography>

          {/* TARGET */}
          <Typography sx={{ mb: 1 }}>
            Target:
            <strong>
              {" "}
              {item.target} {item.unit}
            </strong>
          </Typography>

          {/* DIFFERENCE */}
          <Typography sx={{ mb: 1 }}>
            Difference:
            <strong>
              {" "}
              {Math.abs(
                item.difference
              ).toFixed(1)}{" "}
              {item.unit}
            </strong>
          </Typography>

          {/* DAILY NEED */}
          <Typography sx={{ mb: 2 }}>

            You need to{" "}

            <strong>
              {item.action}
            </strong>{" "}

            approximately{" "}

            <strong>
              {item.dailyNeeded.toFixed(2)}{" "}
              {item.unit}
            </strong>{" "}

            daily for{" "}

            <strong>
              {daysLeft} days
            </strong>.

          </Typography>

          {/* STATUS */}
          <Typography
            sx={{

              color:
                item.isReasonable
                  ? "#2e7d32"
                  : "#c62828",

              fontWeight: "bold",

              mb: 2,
            }}
          >

            {item.isReasonable
              ? "This goal is realistic."
              : "This goal may be difficult to achieve safely."}

          </Typography>

          {/* PROGRESS BAR */}
          <LinearProgress
            variant="determinate"
            value={item.progress}

            sx={{

              height: 12,

              borderRadius: "999px",

              backgroundColor:
                item.isReasonable
                  ? "#c8e6c9"
                  : "#ffcdd2",

              "& .MuiLinearProgress-bar": {

                backgroundColor:
                  item.isReasonable
                    ? "#2e7d32"
                    : "#c62828",
              },
            }}
          />

        </CardContent>

      </Card>

    </Grid>

  ))}

</Grid>

  </Box>

)}
    </Box>
  );
}