import React from "react";
import { Box, Typography } from "@mui/material";

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function TopBar({ habits }) {
  // total habits
  const total = habits.length;

  // today's completion — check week 5 for today's day name
  const todayName = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  const todayDone = habits.filter((h) => {
    const week5 = h.weeks?.find((w) => w.current_week === 5);
    return week5 && week5[todayName] === 1;
  }).length;

  const todayPct = total > 0 ? Math.round((todayDone / total) * 100) : 0;

  // best performing habit — highest completion across all 5 weeks
  const best = habits.reduce((bestHabit, habit) => {
    const done =
      habit.weeks?.reduce(
        (sum, week) => sum + DAYS.filter((d) => week[d] === 1).length,
        0,
      ) || 0;
    const prev =
      bestHabit?.weeks?.reduce(
        (sum, week) => sum + DAYS.filter((d) => week[d] === 1).length,
        0,
      ) || 0;
    return done > prev ? habit : bestHabit;
  }, null);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        px: 3,
        py: 2,
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        flexWrap: "wrap",
      }}
    >
      {[
        {
          label: "Total Habits",
          value: total,
          bg: "#e8f5e9",
          color: "#2e7d32",
        },
        {
          label: "Today's Completion",
          value: `${todayPct}%  (${todayDone}/${total})`,
          bg: "#f1f8e9",
          color: "#388e3c",
        },
        {
          label: "Best Habit This Month",
          value: best ? best.name : "—",
          bg: "#fff8e1",
          color: "#f57f17",
        },
      ].map((stat, i) => (
        <Box
          key={i}
          sx={{
            flex: "1 1 180px",
            backgroundColor: stat.bg,
            borderRadius: 2,
            px: 2.5,
            py: 1.5,
          }}
        >
          <Typography sx={{ fontSize: 11, color: "#888" }}>
            {stat.label}
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: stat.color }}>
            {stat.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
