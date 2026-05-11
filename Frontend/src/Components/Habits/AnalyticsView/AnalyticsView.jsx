import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// calculate longest streak of consecutive done days across all weeks
function calcStreak(habit) {
  // flatten all 35 day values in order (week1 sun→sat, week2 sun→sat ...)
  const allDays = [];
  const sorted = [...(habit.weeks || [])].sort(
    (a, b) => a.current_week - b.current_week,
  );
  sorted.forEach((week) => {
    DAY_KEYS.forEach((d) => allDays.push(week[d]));
  });

  let best = 0;
  let current = 0;
  allDays.forEach((val) => {
    if (val === 1) {
      current++;
      best = Math.max(best, current);
    } else current = 0;
  });
  return best;
}

function calcCompletion(habit) {
  const total = (habit.weeks?.length || 0) * 7;
  if (total === 0) return 0;
  const done =
    habit.weeks?.reduce(
      (sum, week) => sum + DAY_KEYS.filter((d) => week[d] === 1).length,
      0,
    ) || 0;
  return Math.round((done / total) * 100);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AnalyticsView({ habits }) {
  return (
    <Box>
      <Typography
        sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#333", mb: 3 }}
      >
        Analytics — Last Month
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {habits.map((habit) => {
          const pct = calcCompletion(habit);
          const streak = calcStreak(habit);
          const totalDone =
            habit.weeks?.reduce(
              (sum, week) => sum + DAY_KEYS.filter((d) => week[d] === 1).length,
              0,
            ) || 0;

          return (
            <Box
              key={habit.habit_id}
              sx={{
                backgroundColor: "#f9fbe7",
                borderRadius: 3,
                p: 3,
                border: "1px solid #e8f5e9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* habit name + frequency */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{ fontWeight: 700, fontSize: "1rem", color: "#1b5e20" }}
                >
                  {habit.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "capitalize",
                    backgroundColor:
                      habit.frequency === "daily" ? "#e8f5e9" : "#e3f2fd",
                    color: habit.frequency === "daily" ? "#2e7d32" : "#1565c0",
                    px: 1.5,
                    py: 0.3,
                    borderRadius: "999px",
                  }}
                >
                  {habit.frequency}
                </Typography>
              </Box>

              {/* started date */}
              <Typography sx={{ fontSize: 12, color: "#888", mb: 2 }}>
                Started: {formatDate(habit.created_at)}
              </Typography>

              {/* stats row */}
              <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                {[
                  { label: "Total Days Done", value: totalDone },
                  { label: "Best Streak", value: `${streak} days` },
                  { label: "Completion Rate", value: `${pct}%` },
                ].map((stat, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: "1 1 100px",
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      p: 1.5,
                      textAlign: "center",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#888" }}>
                      {stat.label}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 20, fontWeight: 700, color: "#2e7d32" }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* progress bar */}
              <Box>
                <Typography sx={{ fontSize: 11, color: "#aaa", mb: 0.5 }}>
                  Monthly completion — {pct}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#e8f5e9",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#2e7d32",
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
