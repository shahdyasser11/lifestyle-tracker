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
import { useEffect, useState } from "react";
import { getNutritionHistory } from "../../../services/Nutrition/nutritionServices"; 


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

// fetch nutrition history

useEffect(() => {

  const fetchNutritionHistory = async () => {

    try {

      // temporary user id
      const userId = 1;

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
      }

    } catch (error) {

      console.log(error);
    }
  };

  fetchNutritionHistory();

}, []);
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

      <Grid container spacing={3}>
        
        {/* Weight */}
        <Grid item xs={12} md={6}>
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
              {/* Title + Subtitle in a box */}
              <Box
                sx={{
                  ...animatedBox,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(6px)",
                  display: "inline-block",
                   width: "30%",
                   fontSize:"1rem",
                }}
              >
                <Typography variant="subtitle2" fontWeight={800} sx={{fontSize:"1.2rem",}}>
                  Weight History
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last 7 days
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mb: 2,
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
                    Current weight: <strong>{currentData.weight} kg</strong>
                  </Typography>
                </Box>

                {/* Target Weight */}
                <Box
                  sx={{
                    ...animatedBox,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 5,
                    background: " #6dbaf9",
                    color: "#0d47a1",
                    fontWeight: 500,
                  }}
                >
                  <Typography variant="caption">
                    Target weight: <strong>{targetData.weight} kg</strong>
                  </Typography>
                </Box>
              </Box>

              {/* Chart inside colored box */}
              <Box
                sx={{
                  ...animatedBox,
                  p: 2,
                  borderRadius: 3,
                  background: "#a8c7ab",
                  boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)",
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
                  xAxis={[{ data: days, scaleType: "point" }]}
                  brushConfig={{ enabled: true }}
                  sx={chartAnimation}
                >
                  <CustomBrushOverlay />
                </LineChart>
              </Box>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              {/* left line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to right, transparent, #2e7d32)",
                }}
              />

              {/* text */}
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#2e7d32",
                  whiteSpace: "nowrap",
                }}
              >
                You're <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{percentages.weight}%</span> there
              </Typography>

              {/* right line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to left, transparent, #2e7d32)",
                }}
              />
            </Box>
              </Card>
        </Grid>

        {/* Protein */}
        <Grid item xs={12} md={6}>
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
              {/* Title + Subtitle in a box */}
              <Box
                sx={{
                  ...animatedBox,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(6px)",
                  display: "inline-block",
                   width: "30%",
                   fontSize:"1rem",
                }}
              >
                <Typography variant="subtitle2" fontWeight={800} sx={{fontSize:"1.2rem",}}>
                  Protein History
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last 7 days
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mb: 2,
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
                    Current Protein: <strong>{currentData.protein} g</strong>
                  </Typography>
                </Box>

                {/* Target Protein */}
                <Box
                  sx={{
                    ...animatedBox,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 5,
                    background: " #6dbaf9",
                    color: "#0d47a1",
                    fontWeight: 500,
                  }}
                >
                  <Typography variant="caption">
                    Target Protein: <strong>{targetData.protein} g</strong>
                  </Typography>
                </Box>
              </Box>

              {/* Chart inside colored box */}
              <Box
                sx={{
                  ...animatedBox,
                  p: 2,
                  borderRadius: 3,
                  background: "#a8c7ab",
                  boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)",
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
                  xAxis={[{ data: days, scaleType: "point" }]}
                  brushConfig={{ enabled: true }}
                  sx={chartAnimation}
                >
                  <CustomBrushOverlay />
                </LineChart>
              </Box>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              {/* left line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to right, transparent, #2e7d32)",
                }}
              />

              {/* text */}
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#2e7d32",
                  whiteSpace: "nowrap",
                }}
              >
                You're <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{percentages.protein}%</span> there
              </Typography>

              {/* right line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to left, transparent, #2e7d32)",
                }}
              />
            </Box>
          </Card>
        </Grid>

        {/* Calories */}
        <Grid item xs={12} md={6}>
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
              {/* Title + Subtitle in a box */}
              <Box
                sx={{
                  ...animatedBox,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(6px)",
                  display: "inline-block",
                   width: "30%",
                   fontSize:"1rem",
                }}
              >
                <Typography variant="subtitle2" fontWeight={800} sx={{fontSize:"1.2rem",}}>
                  Calories History
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last 7 days
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                {/* Current cals */}
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
                    Current Calories: <strong>{currentData.calories} kcal</strong>
                  </Typography>
                </Box>

                {/* Target cals */}
                <Box
                  sx={{
                    ...animatedBox,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 5,
                    background: " #6dbaf9",
                    color: "#0d47a1",
                    fontWeight: 500,
                  }}
                >
                  <Typography variant="caption">
                    Target Calories: <strong>{targetData.calories} kcal</strong>
                  </Typography>
                </Box>
              </Box>

              {/* Chart inside colored box */}
              <Box
                sx={{
                  ...animatedBox,
                  p: 2,
                  borderRadius: 3,
                  background: "#a8c7ab",
                  boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)",
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
                  xAxis={[{ data: days, scaleType: "point" }]}
                  brushConfig={{ enabled: true }}
                  sx={chartAnimation}
                >
                  <CustomBrushOverlay />
                </LineChart>
              </Box>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              {/* left line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to right, transparent, #2e7d32)",
                }}
              />

              {/* text */}
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#2e7d32",
                  whiteSpace: "nowrap",
                }}
              >
                You're <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{percentages.calories}%</span> there
              </Typography>

              {/* right line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to left, transparent, #2e7d32)",
                }}
              />
            </Box>
          </Card>
        </Grid>

        {/* carbs */}
        <Grid item xs={12} md={6}>
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
              {/* Title + Subtitle in a box */}
              <Box
                sx={{
                  ...animatedBox,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(6px)",
                  display: "inline-block",
                   width: "30%",
                   fontSize:"1rem",
                }}
              >
                <Typography variant="subtitle2" fontWeight={800} sx={{fontSize:"1.2rem",}}>
                  Carbs History
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last 7 days
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                {/* Current carbs */}
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
                    Current Carbs: <strong>{currentData.carbs} g</strong>
                  </Typography>
                </Box>

                {/* Target carbs */}
                <Box
                  sx={{
                    ...animatedBox,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 5,
                    background: " #6dbaf9",
                    color: "#0d47a1",
                    fontWeight: 500,
                  }}
                >
                  <Typography variant="caption">
                    Target Carbs: <strong>{targetData.carbs} g</strong>
                  </Typography>
                </Box>
              </Box>

              {/* Chart inside colored box */}
              <Box
                sx={{
                  ...animatedBox,
                  p: 2,
                  borderRadius: 3,
                  background: "#a8c7ab",
                  boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)",
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
                  xAxis={[{ data: days, scaleType: "point" }]}
                  brushConfig={{ enabled: true }}
                  sx={chartAnimation}
                >
                  <CustomBrushOverlay />
                </LineChart>
              </Box>
            </CardContent>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              {/* left line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to right, transparent, #2e7d32)",
                }}
              />

              {/* text */}
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#2e7d32",
                  whiteSpace: "nowrap",
                }}
              >
                You're <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{percentages.carbs}%</span> there
              </Typography>

              {/* right line */}
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to left, transparent, #2e7d32)",
                }}
              />
            </Box>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}