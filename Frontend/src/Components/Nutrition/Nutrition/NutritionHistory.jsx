import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  useBrush,
  useDrawingArea,
  useLineSeries,
  useXScale,
} from "@mui/x-charts/hooks";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fade,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useEffect, useState } from "react";
import { getNutritionHistory, saveNutritionData, getCurrentNutrition } from "../../../services/Nutrition/nutritionServices"; 
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';


function CustomBrushOverlay() {
  const theme = useTheme();
  const drawingArea = useDrawingArea();
  const brush = useBrush();
  const xScale = useXScale();
  const series = useLineSeries("weight");



  if (!brush || !series) return null;

  const { left, top, width, height } = drawingArea;

  const clampX = (x) => Math.max(left, Math.min(left + width, x));
  const startX = clampX(brush.start.x);
  const currentX = clampX(brush.current.x);

  const minX = Math.min(startX, currentX);
  const maxX = Math.max(startX, currentX);
  const rectWidth = maxX - minX;

  if (rectWidth < 1) return null;

  const color = theme.palette.primary.main;

  return (
    <g>
      <rect
        x={minX}
        y={top}
        width={rectWidth}
        height={height}
        fill={color}
        fillOpacity={0.1}
      />
    </g>
  );
}


export default function NutritionHistory() {
  const [nutritionHistory, setNutritionHistory] = useState([]);
const [weightData, setWeightData] = useState([]);
const [proteinData, setProteinData] = useState([]);
const [calsData, setCalsData] = useState([]);
const [carbsData, setCarbsData] = useState([]);

const [days, setDays] = useState([]);

const [currentData, setCurrentData] = useState({
  weight: 0,
  protein: 0,
  calories: 0,
  carbs: 0,
});

const [targetData, setTargetData] = useState({
  weight: 0,
  protein: 0,
  calories: 0,
  carbs: 0,
});

const [percentages, setPercentages] = useState({
  weight: 0,
  protein: 0,
  calories: 0,
  carbs: 0,
});

const cardStyle = {
  borderRadius: 4,
  boxShadow: 4,
  p: 2,
  // background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
  background: "#48824d94",
};

/*  reusable animation style */
const chartAnimation = {
  "& .MuiLineElement-root path": {
    strokeDasharray: 1200,
    strokeDashoffset: 1200,
    animation: "drawLine 2.5s ease-out forwards",
  },
  "@keyframes drawLine": {
    from: { strokeDashoffset: 1200 },
    to: { strokeDashoffset: 0 },
  },
};

const animatedBox = {
  animation: "slideUp 1s ease",
  "@keyframes slideUp": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
};

const [openDialog, setOpenDialog] = useState(false);

const [selectedNutrition, setSelectedNutrition] = useState("");

const [inputValue, setInputValue] = useState("");

const [loading, setLoading] = useState(false);

 const [overallPercentage, setOverallPercentage] =
  useState(0);
// fetch nutrition history

useEffect(() => {

  const fetchNutritionHistory = async () => {

    try {

      // temporary user id
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const userId = user.user_id;

      const response =
        await getNutritionHistory(userId);

      const history = response.data || [];

      // reverse to show oldest -> newest in chart
      const orderedHistory = [...history].reverse();

      setNutritionHistory(orderedHistory);

      // =========================================
      // CHART DATA
      // =========================================

      setWeightData(
        orderedHistory.map(item => item.current.weight)
      );

      setProteinData(
        orderedHistory.map(item => item.current.protein)
      );

      setCalsData(
        orderedHistory.map(item => item.current.calories)
      );

      setCarbsData(
        orderedHistory.map(item => item.current.carbs)
      );



      setDays(
        orderedHistory.map((item, index) =>
          `Day ${index + 1}`
        )
      );


      const latest =
        orderedHistory[orderedHistory.length - 1];

      if (latest) {

        setCurrentData({

          weight: latest.current.weight,
          protein: latest.current.protein,
          calories: latest.current.calories,
          carbs: latest.current.carbs,
        });

        setTargetData({

          weight: latest.targets.weight,
          protein: latest.targets.protein,
          calories: latest.targets.calories,
          carbs: latest.targets.carbs,
        });

        setPercentages({

          weight: latest.percentages.weight,
          protein: latest.percentages.protein,
          calories: latest.percentages.calories,
          carbs: latest.percentages.carbs,
        });

        const overall = (

        latest.percentages.weight +

        latest.percentages.protein +

        latest.percentages.calories +

        latest.percentages.carbs

      ) / 4;

      setOverallPercentage(
        Number(overall.toFixed(1))
      );
      }

    } catch (error) {

      console.log(error);
    }
  };

  fetchNutritionHistory();


  

}, []);

const handleOpenDialog = (nutritionType) => {
  setSelectedNutrition(nutritionType);
  setInputValue("");
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
};

const handleSaveNutrition = async () => {
  try {
    setLoading(true);

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const userId = user.user_id;

    // get current nutrition first
    const response =
      await getCurrentNutrition(userId);

    const current =
      response.data.current;

    // keep old values
    const nutritionData = {
      user_id: userId,

      calories: current.calories,

      protein: current.protein,

      carbs: current.carbs,

      weight: current.weight,
    };

    // update ONLY selected field
    nutritionData[selectedNutrition] =
      Number(inputValue);

    // save updated object
    await saveNutritionData(
      nutritionData
    );

    setOpenDialog(false);

    window.location.reload();

  } catch (error) {
    console.log(error);

  } finally {
    setLoading(false);
  }
};

const [gaugeValue, setGaugeValue] = useState(0);

useEffect(() => {
  let current = 0;

  const target = percentages.weight;

  const interval = setInterval(() => {
    current += 1;

    setGaugeValue(current);

    if (current >= target) {
      clearInterval(interval);
    }
  }, 10);

  return () => clearInterval(interval);

}, [percentages.weight]);


  return (
    <Box>
    <Typography
      variant="h4"
      sx={{
        mb: 4,
        textAlign: "center",
        fontWeight: "bold",
        color: "#1b5e20",
        position: "relative",
        display: "inline-block",
        mx: "auto",
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          bottom: -6,
          width: "100%",
          height: "3px",
          borderRadius: "10px",
          backgroundColor: "#66bb6a",
          transform: "scaleX(0)",
          transformOrigin: "left",
          animation: "underlineAnim 0.8s ease forwards",
        },
        "@keyframes underlineAnim": {
          to: { transform: "scaleX(1)" },
        },
      }}
    >
      Your Nutrition History
    </Typography>

<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    mt: 2,
  }}
>
<Gauge
  value={overallPercentage}
  valueMax={100}
  startAngle={-110}
  endAngle={110}
  width={220}
  height={220}
  sx={{
    "& .MuiGauge-valueText": {
      fontSize: 40,
      fontWeight: "bold",
      fill: "#2e7d32",
      transform: "translate(0px, 0px)",
    },

    "& .MuiGauge-valueArc": {
      fill: "#2e7d32",
    },

    "& .MuiGauge-referenceArc": {
      fill: "#dcedc8",
    },
  }}
  text={({ value, valueMax }) => `${value} / ${valueMax}`}
/>

  <Typography
    sx={{
      mt: -2,
      mb:2,
      fontSize: "1.1rem",
      fontWeight: "bold",
      color: "#2e7d32",
      letterSpacing: "0.5px",
    }}
  >
    Goal Progress
  </Typography>
</Box>

      <Grid container spacing={3}>
        
        {/* Weight */}
      <Grid xs={12} md={6}>
        <Card
          sx={{
            borderRadius: "2rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            p: 2,
            background: "#e8f5e9",
            transition: "0.3s ease",
            "&:hover": {
              boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <CardContent>

            {/* Header Row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                gap: 2,
              }}
            >
              {/* Title Box */}
              <Box
                sx={{
                  ...animatedBox,
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(6px)",
                  width: "30%",
                  minWidth: "220px",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={800}
                  sx={{ fontSize: "1.2rem" }}
                >
                  Weight History
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Last 7 days
                </Typography>
              </Box>

              {/* Add Button */}
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => handleOpenDialog("weight")}
                sx={{
                  minWidth: "fit-content",
                  height: "52px",
                  borderRadius: "16px",
                  px: 2.5,
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  background:
                    "linear-gradient(135deg, #ff6ec4, #7873f5)",
                  boxShadow:
                    "0 6px 20px rgba(120,115,245,0.4)",
                  transition: "all 0.35s ease",
                  animation: "pulse 2s infinite",

                  "&:hover": {
                    transform: "translateY(-2px) scale(1.05)",
                    background:
                      "linear-gradient(135deg, #7873f5, #ff6ec4)",
                    boxShadow:
                      "0 10px 28px rgba(255,110,196,0.45)",
                  },

                  "@keyframes pulse": {
                    "0%": {
                      boxShadow:
                        "0 0 0 0 rgba(120,115,245,0.6)",
                    },
                    "70%": {
                      boxShadow:
                        "0 0 0 12px rgba(120,115,245,0)",
                    },
                    "100%": {
                      boxShadow:
                        "0 0 0 0 rgba(120,115,245,0)",
                    },
                  },
                }}
              >
                Add Your Weight Today
              </Button>
            </Box>

            {/* Current + Target */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mb: 2,
                flexWrap: "wrap",
              }}
            >
              {/* Current Weight */}
              <Box
                sx={{
                  ...animatedBox,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 5,
                  background: "#e6cec8",
                  color: "#a43216",
                  fontWeight: 500,
                }}
              >
                <Typography variant="caption">
                  Current weight:{" "}
                  <strong>{currentData.weight} kg</strong>
                </Typography>
              </Box>

              {/* Target Weight */}
              <Box
                sx={{
                  ...animatedBox,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 5,
                  background: "#6dbaf9",
                  color: "#0d47a1",
                  fontWeight: 500,
                }}
              >
                <Typography variant="caption">
                  Target weight:{" "}
                  <strong>{targetData.weight} kg</strong>
                </Typography>
              </Box>
            </Box>

            {/* Chart */}
            <Box
              sx={{
                ...animatedBox,
                p: 2,
                borderRadius: 3,
                background: "#7eac83",
                boxShadow:
                  "inset 0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <LineChart
                key="weight"
                height={350}
                width={460}
                series={[
                  {
                    data: weightData || [],
                    label: "Weight",
                    id: "weight",
                    color: "#d217a3",
                  },
                ]}
                xAxis={[
                  {
                    data: days,
                    scaleType: "point",
                  },
                ]}
                brushConfig={{ enabled: true }}
                sx={chartAnimation}
              >
                <CustomBrushOverlay />
              </LineChart>
            </Box>
          </CardContent>

          {/* Percentage */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
            }}
          >
            {/* Left Line */}
            <Box
              sx={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, #2e7d32)",
              }}
            />

            {/* Text */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "#2e7d32",
                whiteSpace: "nowrap",
              }}
            >
              You're{" "}
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                {percentages.weight}%
              </span>{" "}
              there
            </Typography>

            {/* Right Line */}
            <Box
              sx={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(to left, transparent, #2e7d32)",
              }}
            />
          </Box>
        </Card>

      </Grid>

        {/* Protein */}
        <Grid xs={12} md={6}>
          <Card
            sx={{
              borderRadius: "2rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              p: 2,
              background: "#e8f5e9",
              transition: "0.3s ease",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent>

              {/* Header Row */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  gap: 2,
                }}
              >
                {/* Title Box */}
                <Box
                  sx={{
                    ...animatedBox,
                    p: 1.5,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(6px)",
                    width: "30%",
                    minWidth: "220px",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    sx={{ fontSize: "1.2rem" }}
                  >
                    Protein History
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Last 7 days
                  </Typography>
                </Box>

                {/* Add Button */}
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  onClick={() => handleOpenDialog("protein")}
                  sx={{
                    minWidth: "fit-content",
                    height: "52px",
                    borderRadius: "16px",
                    px: 2.5,
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    background:
                      "linear-gradient(135deg, #ff6ec4, #7873f5)",
                    boxShadow:
                      "0 6px 20px rgba(120,115,245,0.4)",
                    transition: "all 0.35s ease",
                    animation: "pulse 2s infinite",

                    "&:hover": {
                      transform: "translateY(-2px) scale(1.05)",
                      background:
                        "linear-gradient(135deg, #7873f5, #ff6ec4)",
                      boxShadow:
                        "0 10px 28px rgba(255,110,196,0.45)",
                    },

                    "@keyframes pulse": {
                      "0%": {
                        boxShadow:
                          "0 0 0 0 rgba(120,115,245,0.6)",
                      },
                      "70%": {
                        boxShadow:
                          "0 0 0 12px rgba(120,115,245,0)",
                      },
                      "100%": {
                        boxShadow:
                          "0 0 0 0 rgba(120,115,245,0)",
                      },
                    },
                  }}
                >
                  Add Your Protein Today
                </Button>
              </Box>

              {/* Current + Target */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                {/* Current Protein */}
                <Box
                  sx={{
                    ...animatedBox,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 5,
                    background: "#e6cec8",
                    color: "#a43216",
                    fontWeight: 500,
                  }}
                >
                  <Typography variant="caption">
                    Current Protein:{" "}
                    <strong>{currentData.protein} g</strong>
                  </Typography>
                </Box>

                {/* Target Protein */}
                <Box
                  sx={{
                    ...animatedBox,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 5,
                    background: "#6dbaf9",
                    color: "#0d47a1",
                    fontWeight: 500,
                  }}
                >
                  <Typography variant="caption">
                    Target Protein:{" "}
                    <strong>{targetData.protein} g</strong>
                  </Typography>
                </Box>
              </Box>

              {/* Chart */}
              <Box
                sx={{
                  ...animatedBox,
                  p: 2,
                  borderRadius: 3,
                  background: "#7eac83",
                  boxShadow:
                    "inset 0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <LineChart
                  key="protein"
                  height={350}
                  width={460}
                  series={[
                    {
                      data: proteinData || [],
                      label: "Protein",
                      id: "protein",
                      color: "#ff0000",
                    },
                  ]}
                  xAxis={[
                    {
                      data: days,
                      scaleType: "point",
                    },
                  ]}
                  brushConfig={{ enabled: true }}
                  sx={chartAnimation}
                >
                  <CustomBrushOverlay />
                </LineChart>
              </Box>
            </CardContent>

            {/* Percentage */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              {/* Left Line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent, #2e7d32)",
                }}
              />

              {/* Text */}
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#2e7d32",
                  whiteSpace: "nowrap",
                }}
              >
                You're{" "}
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  {percentages.protein}%
                </span>{" "}
                there
              </Typography>

              {/* Right Line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background:
                    "linear-gradient(to left, transparent, #2e7d32)",
                }}
              />
            </Box>
          </Card>
        </Grid>

        {/* Calories */}
        <Grid xs={12} md={6}>
          <Card
            sx={{
              borderRadius: "2rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              p: 2,
              background: "#e8f5e9",
              transition: "0.3s ease",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent>

              {/* Header Row */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  gap: 2,
                }}
              >
                {/* Title Box */}
                <Box
                  sx={{
                    ...animatedBox,
                    p: 1.5,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(6px)",
                    width: "30%",
                    minWidth: "220px",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    sx={{ fontSize: "1.2rem" }}
                  >
                    Calories History
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Last 7 days
                  </Typography>
                </Box>

                {/* Add Button */}
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  onClick={() => handleOpenDialog("calories")}
                  sx={{
                    minWidth: "fit-content",
                    height: "52px",
                    borderRadius: "16px",
                    px: 2.5,
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    background:
                      "linear-gradient(135deg, #ff6ec4, #7873f5)",
                    boxShadow:
                      "0 6px 20px rgba(120,115,245,0.4)",
                    transition: "all 0.35s ease",
                    animation: "pulse 2s infinite",

                    "&:hover": {
                      transform: "translateY(-2px) scale(1.05)",
                      background:
                        "linear-gradient(135deg, #7873f5, #ff6ec4)",
                      boxShadow:
                        "0 10px 28px rgba(255,110,196,0.45)",
                    },

                    "@keyframes pulse": {
                      "0%": {
                        boxShadow:
                          "0 0 0 0 rgba(120,115,245,0.6)",
                      },
                      "70%": {
                        boxShadow:
                          "0 0 0 12px rgba(120,115,245,0)",
                      },
                      "100%": {
                        boxShadow:
                          "0 0 0 0 rgba(120,115,245,0)",
                      },
                    },
                  }}
                >
                  Add Your Calories Today
                </Button>
              </Box>

              {/* Current + Target */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                {/* Current Calories */}
                <Box
                  sx={{
                    ...animatedBox,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 5,
                    background: "#e6cec8",
                    color: "#a43216",
                    fontWeight: 500,
                  }}
                >
                  <Typography variant="caption">
                    Current Calories:{" "}
                    <strong>{currentData.calories} kcal</strong>
                  </Typography>
                </Box>

                {/* Target Calories */}
                <Box
                  sx={{
                    ...animatedBox,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 5,
                    background: "#6dbaf9",
                    color: "#0d47a1",
                    fontWeight: 500,
                  }}
                >
                  <Typography variant="caption">
                    Target Calories:{" "}
                    <strong>{targetData.calories} kcal</strong>
                  </Typography>
                </Box>
              </Box>

              {/* Chart */}
              <Box
                sx={{
                  ...animatedBox,
                  p: 2,
                  borderRadius: 3,
                  background: "#7eac83",
                  boxShadow:
                    "inset 0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <LineChart
                  key="cals"
                  height={350}
                  width={460}
                  series={[
                    {
                      data: calsData || [],
                      label: "Calories",
                      id: "calories",
                      color: "#1118e5",
                    },
                  ]}
                  xAxis={[
                    {
                      data: days,
                      scaleType: "point",
                    },
                  ]}
                  brushConfig={{ enabled: true }}
                  sx={chartAnimation}
                >
                  <CustomBrushOverlay />
                </LineChart>
              </Box>
            </CardContent>

            {/* Percentage */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              {/* Left Line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent, #2e7d32)",
                }}
              />

              {/* Text */}
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#2e7d32",
                  whiteSpace: "nowrap",
                }}
              >
                You're{" "}
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  {percentages.calories}%
                </span>{" "}
                there
              </Typography>

              {/* Right Line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background:
                    "linear-gradient(to left, transparent, #2e7d32)",
                }}
              />
            </Box>
          </Card>
        </Grid>

          {/* carbs */}
          <Grid xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "2rem",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                p: 2,
                background: "#e8f5e9",
                transition: "0.3s ease",
                "&:hover": {
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent>

                {/* Header Row */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    gap: 2,
                  }}
                >
                  {/* Title Box */}
                  <Box
                    sx={{
                      ...animatedBox,
                      p: 1.5,
                      borderRadius: 3,
                      backgroundColor: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(6px)",
                      width: "30%",
                      minWidth: "220px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={800}
                      sx={{ fontSize: "1.2rem" }}
                    >
                      Carbs History
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Last 7 days
                    </Typography>
                  </Box>

                  {/* Add Button */}
                  <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => handleOpenDialog("carbs")}
                    sx={{
                      minWidth: "fit-content",
                      height: "52px",
                      borderRadius: "16px",
                      px: 2.5,
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      background:
                        "linear-gradient(135deg, #ff6ec4, #7873f5)",
                      boxShadow:
                        "0 6px 20px rgba(120,115,245,0.4)",
                      transition: "all 0.35s ease",
                      animation: "pulse 2s infinite",

                      "&:hover": {
                        transform: "translateY(-2px) scale(1.05)",
                        background:
                          "linear-gradient(135deg, #7873f5, #ff6ec4)",
                        boxShadow:
                          "0 10px 28px rgba(255,110,196,0.45)",
                      },

                      "@keyframes pulse": {
                        "0%": {
                          boxShadow:
                            "0 0 0 0 rgba(120,115,245,0.6)",
                        },
                        "70%": {
                          boxShadow:
                            "0 0 0 12px rgba(120,115,245,0)",
                        },
                        "100%": {
                          boxShadow:
                            "0 0 0 0 rgba(120,115,245,0)",
                        },
                      },
                    }}
                  >
                    Add Your Carbs Today
                  </Button>
                </Box>

                {/* Current + Target */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    mb: 2,
                    flexWrap: "wrap",
                  }}
                >
                  {/* Current Carbs */}
                  <Box
                    sx={{
                      ...animatedBox,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 5,
                      background: "#e6cec8",
                      color: "#a43216",
                      fontWeight: 500,
                    }}
                  >
                    <Typography variant="caption">
                      Current Carbs:{" "}
                      <strong>{currentData.carbs} g</strong>
                    </Typography>
                  </Box>

                  {/* Target Carbs */}
                  <Box
                    sx={{
                      ...animatedBox,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 5,
                      background: "#6dbaf9",
                      color: "#0d47a1",
                      fontWeight: 500,
                    }}
                  >
                    <Typography variant="caption">
                      Target Carbs:{" "}
                      <strong>{targetData.carbs} g</strong>
                    </Typography>
                  </Box>
                </Box>

                {/* Chart */}
                <Box
                  sx={{
                    ...animatedBox,
                    p: 2,
                    borderRadius: 3,
                    background: "#7eac83",
                    boxShadow:
                      "inset 0 1px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <LineChart
                    key="carbs"
                    height={350}
                    width={460}
                    series={[
                      {
                        data: carbsData || [],
                        label: "Carbs",
                        id: "carbs",
                        color: "#27682a",
                      },
                    ]}
                    xAxis={[
                      {
                        data: days,
                        scaleType: "point",
                      },
                    ]}
                    brushConfig={{ enabled: true }}
                    sx={chartAnimation}
                  >
                    <CustomBrushOverlay />
                  </LineChart>
                </Box>
              </CardContent>

              {/* Percentage */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 2,
                }}
              >
                {/* Left Line */}
                <Box
                  sx={{
                    flex: 1,
                    height: "1px",
                    background:
                      "linear-gradient(to right, transparent, #2e7d32)",
                  }}
                />

                {/* Text */}
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#2e7d32",
                    whiteSpace: "nowrap",
                  }}
                >
                  You're{" "}
                  <span
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {percentages.carbs}%
                  </span>{" "}
                  there
                </Typography>

                {/* Right Line */}
                <Box
                  sx={{
                    flex: 1,
                    height: "1px",
                    background:
                      "linear-gradient(to left, transparent, #2e7d32)",
                  }}
                />
              </Box>
            </Card>
          </Grid>

      </Grid>


    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      TransitionComponent={Fade}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "2rem",
          padding: "8px",
          background:
            "linear-gradient(145deg, #ffffff, #f3f9ff)",
          minWidth: "350px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        },
      }}
    >
  <DialogTitle
    sx={{
      fontWeight: "bold",
      textAlign: "center",
      background:
        "linear-gradient(135deg, #667eea, #764ba2)",
      color: "white",
      borderRadius: "2rem",
      mb: 2,
      py: 2,
    }}
  >
    Add Today’s {selectedNutrition}
  </DialogTitle>

  <DialogContent>
    
<TextField
  fullWidth
  type="number"
  label={`Enter ${selectedNutrition} value`}
  value={inputValue}
  onChange={(e) => {
    const value = e.target.value;

    if (value >= 0 || value === "") {
      setInputValue(value);
    }
  }}

 InputProps={{
  inputProps: {
    min: 0,
  },
}}

  sx={{
    mt: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
    },
  }}
/>
  </DialogContent>

  <DialogActions
    sx={{
      justifyContent: "center",
      pb: 2,
      gap: 1,
    }}
  >
    <Button
      onClick={handleCloseDialog}
      sx={{
        borderRadius: "999px",
        px: 3,
        color: "#666",
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleSaveNutrition}
      disabled={loading}
      sx={{
        borderRadius: "999px",
        px: 4,
        py: 1,
        fontWeight: "bold",
        background:
          "linear-gradient(135deg, #43cea2, #185a9d)",
        transition: "0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          background:
            "linear-gradient(135deg, #185a9d, #43cea2)",
        },
      }}
    >
      {loading ? "Saving..." : "Save"}
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}