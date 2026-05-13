import * as React from "react";

import {
  Box,
  Typography,
  LinearProgress,
} from "@mui/material";

import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";

import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

export default function LeftCard() {

  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  // weekly nutrition values
  const finalValues = [
    1200,
    1800,
    1500,
    2100,
    2400,
    2000,
    2300,
  ];

  const [values, setValues] =
    React.useState(
      Array(finalValues.length).fill(0)
    );

  // nutrition gauge
  const nutritionGoal = 2500;

  const todayCalories =
    values[values.length - 1];

  const gaugeValue = Math.min(
    (todayCalories / nutritionGoal) * 100,
    100
  );

  // chart animation
  React.useEffect(() => {

    let interval;

    const animate = () => {

      setValues(
        Array(finalValues.length).fill(0)
      );

      finalValues.forEach((val, i) => {

        setTimeout(() => {

          setValues((prev) => {

            const copy = [...prev];

            copy[i] = val;

            return copy;

          });

        }, i * 120);
      });
    };

    animate();

    interval = setInterval(
      animate,
      2000
    );

    return () =>
      clearInterval(interval);

  }, []);

  return (
    <Box
      sx={{
        width: 300,
        padding: "1rem",
      }}
    >
      {/* TITLE */}
      <Box mb={2}>
        <Typography variant="h6">
          Nutrition Tracking
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Track calories and nutrition goals
        </Typography>
      </Box>

      {/* GAUGE CARD */}
      <Box
        sx={{
          p: 2,

          borderRadius: "1.5rem",

          bgcolor: "#eef7f0",

          display: "flex",

          flexDirection: "column",

          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            justifyContent:
              "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,

                height: 48,

                borderRadius: "50%",

                bgcolor: "#d8f3dc",

                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",
              }}
            >
              <RestaurantMenuRoundedIcon
                sx={{
                  color: "#2e7d32",
                }}
              />
            </Box>

            <Box>
              <Typography
                fontWeight={600}
                fontSize={14}
              >
                Daily Goal
              </Typography>

              <Typography
                fontSize={12}
                color="text.secondary"
              >
                {todayCalories} / {nutritionGoal} kcal
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              fontWeight: 700,

              color: "#2e7d32",

              fontSize: "1rem",
            }}
          >
            {Math.round(gaugeValue)}%
          </Typography>
        </Box>

        {/* GAUGE */}
        <LinearProgress
          variant="determinate"
          value={gaugeValue}
          sx={{
            height: 10,

            borderRadius: "999px",

            bgcolor: "#dfeee2",

            "& .MuiLinearProgress-bar":
              {
                borderRadius:
                  "999px",

                background:
                  "linear-gradient(90deg, #86efac, #16a34a)",
              },
          }}
        />
      </Box>

      {/* CHART */}
      <Box mt={2}>
        <Typography
          fontWeight={600}
          fontSize={14}
          mb={1}
        >
          This week
        </Typography>

        <Box
          sx={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "flex-end",
          }}
        >
          {values.map((value, i) => (

            <Box
              key={i}
              sx={{
                display: "flex",

                flexDirection:
                  "column",

                alignItems:
                  "center",

                flex: 1,
              }}
            >
              <SparkLineChart
                plotType="bar"

                data={[value]}

                height={80}

                series={[
                  {
                    data: [value],

                    color:
                      value > 2000
                        ? "#22c55e"
                        : "#86efac",
                  },
                ]}
              />

              <Typography
                fontSize={10}
                color="text.secondary"
                mt={0.5}
              >
                {days[i]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* INSIGHT */}
      <Box
        sx={{
          mb: 2,

          textAlign: "center",
        }}
      >
        {/* DIVIDER */}
        <Typography
          variant="h6"

          sx={{
            color: "#0a7f0a",

            letterSpacing: 2,
          }}
        >
          ---------------------------------------
        </Typography>

        {/* TEXT */}
        <Typography
          variant="caption"

          color="text.secondary"

          sx={{
            display: "block",

            mt: 1,

            px: 1,

            lineHeight: 1.5,

            fontSize: "1rem",

            borderRadius: "1.5rem",

            bgcolor: "#eef2f7",

            p: 2,
          }}
        >
          Your nutrition consistency
          has improved this week.
          Balanced meals and calorie
          tracking are helping you
          stay aligned with your
          health goals.
        </Typography>

        {/* BUTTON */}
        <Box
          sx={{
            display: "flex",

            justifyContent:
              "flex-start",

            mt: 1,
          }}
        >
          <Typography
            sx={{
              display: "inline-block",

              width: "fit-content",

              cursor: "pointer",

              bgcolor: "#000",

              color: "#fff",

              px: 3,

              py: 1,

              borderRadius:
                "999px",

              fontSize: "0.8rem",

              fontWeight: 600,

              transition:
                "all 0.2s ease",

              "&:hover": {
                bgcolor: "#222",

                transform:
                  "translateY(-1px)",
              },
            }}
          >
            Update nutrition →
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}