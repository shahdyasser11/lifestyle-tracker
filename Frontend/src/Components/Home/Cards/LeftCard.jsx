import * as React from "react";
import { Box, Typography } from "@mui/material";
import LocalFireDepartmentTwoToneIcon from "@mui/icons-material/LocalFireDepartmentTwoTone";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

export default function LeftCard() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const finalValues = [3, 6, 4, 5, 8, 6, 7];

  const [values, setValues] = React.useState(
    Array(finalValues.length).fill(0)
  );

  React.useEffect(() => {
    let interval;

    const animate = () => {
      // reset first
      setValues(Array(finalValues.length).fill(0));

      // animate step-by-step
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

    animate(); // run once immediately

    // loop every 2 seconds
    interval = setInterval(animate, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ width: 300 , padding:"1rem"}}>
      {/* Title */}
      <Box mb={2}>
        <Typography variant="h6">
          Habit Tracking
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Track the habits you want to adopt or stop
        </Typography>
      </Box>

      {/* Streak */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          borderRadius: "1.5rem",
          bgcolor: "#eef2f7",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            bgcolor: "#e0e7ef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LocalFireDepartmentTwoToneIcon sx={{ color: "#94a3b8" }} />
        </Box>

        <Box>
          <Typography fontWeight={600} fontSize={14}>
            24 day streak
          </Typography>

          <Typography fontSize={12} color="text.secondary">
            You're on a roll with your streak
          </Typography>
        </Box>
      </Box>

      {/* Chart */}
      <Box mt={2}>
        <Typography fontWeight={600} fontSize={14} mb={1}>
          This week
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {values.map((value, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                    color: "#86efac", 
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


        <Box sx={{ mb: 2, textAlign: "center" }}>
        {/* Divider line */}
        <Typography
            variant="h6"
            sx={{ color: "#0a7f0a", letterSpacing: 2 }}
        >
            ---------------------------------------
        </Typography>

        {/* Paragraph */}
        <Typography
            variant="caption"
            color="text.secondary"
            sx={{
            display: "block",
            mt: 1,
            px: 1,
            lineHeight: 1.5,
            fontSize:"1rem",
            borderRadius: "1.5rem",
            bgcolor: "#eef2f7",
            p:2,
            }}
        >
            You’ve made steady progress this week by staying consistent with your habits.
            Small daily actions are adding up, helping you build momentum and move closer
            to your goals.
        </Typography>

<Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
  <Typography
    sx={{
      display: "inline-block", 
      width: "fit-content",  
      cursor: "pointer",
      bgcolor: "#000",
      color: "#fff",
      px: 3,
      py: 1,
      // mt:1,
      borderRadius: "999px",
      fontSize: "0.8rem",
      fontWeight: 600,
      transition: "all 0.2s ease",
      "&:hover": {
        bgcolor: "#222",
        transform: "translateY(-1px)",
      },
    }}
  >
    Track another habit →
  </Typography>
</Box>
        </Box>
    </Box>
    
  );
}