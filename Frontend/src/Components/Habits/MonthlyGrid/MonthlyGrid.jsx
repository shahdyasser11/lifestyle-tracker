import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { logHabit } from "../../../services/Habits/habitServices";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function getWeekNumber(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - d) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return null; // future — not clickable
  if (diffDays < 7) return 5;
  if (diffDays < 14) return 4;
  if (diffDays < 21) return 3;
  if (diffDays < 28) return 2;
  if (diffDays < 35) return 1;
  return null; // too old
}

export default function MonthlyGrid({ habits, userId, onUpdate }) {
  const [loadingCell, setLoadingCell] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startOffset = new Date(year, month, 1).getDay();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const monthName = today.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleCheck = async (habitId, weekNum, dayKey) => {
    if (!weekNum) return;
    const cellId = `${habitId}-${weekNum}-${dayKey}`;
    setLoadingCell(cellId);
    try {
      await logHabit({
        user_id: userId,
        habit_id: habitId,
        current_week: weekNum,
        day: dayKey,
      });
      await onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCell(null);
    }
  };

  return (
    <Box>
      <Typography
        sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#333", mb: 2 }}
      >
        {monthName}
      </Typography>

      {/* day headers */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          mb: 1,
        }}
      >
        {DAY_LABELS.map((label) => (
          <Typography
            key={label}
            sx={{
              textAlign: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#888",
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* calendar cells */}
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}
      >
        {cells.map((day, i) => {
          if (!day) return <Box key={`e-${i}`} sx={{ minHeight: 90 }} />;

          const cellDate = new Date(year, month, day);
          const dayOfWeek = cellDate.getDay();
          const dayKey = DAY_KEYS[dayOfWeek];
          const weekNum = getWeekNumber(cellDate);
          const isToday = day === today.getDate();
          const isFuture = cellDate > today;
          const isClickable = !isFuture && weekNum !== null;

          return (
            <Box
              key={day}
              sx={{
                minHeight: 90,
                border: isToday ? "2px solid #2e7d32" : "1px solid #e0e0e0",
                borderRadius: 2,
                p: 1,
                backgroundColor: isToday ? "#f1f8e9" : "#fff",
                opacity: isFuture ? 0.4 : 1,
              }}
            >
              {/* day number */}
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? "#2e7d32" : "#888",
                  mb: 0.5,
                }}
              >
                {isToday ? "Today" : day}
              </Typography>

              {/* habits */}
              {!isFuture &&
                weekNum &&
                habits.map((habit) => {
                  const week = habit.weeks?.find(
                    (w) => w.current_week === weekNum,
                  );
                  const isDone = week?.[dayKey] === 1;
                  const cellId = `${habit.habit_id}-${weekNum}-${dayKey}`;
                  const isLoading = loadingCell === cellId;

                  return (
                    <Box
                      key={habit.habit_id}
                      onClick={() =>
                        isClickable &&
                        handleCheck(habit.habit_id, weekNum, dayKey)
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 0.3,
                        cursor: isClickable ? "pointer" : "default",
                        "&:hover": isClickable ? { opacity: 0.7 } : {},
                      }}
                    >
                      {/* checkbox */}
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          flexShrink: 0,
                          border: isDone
                            ? "2px solid #2e7d32"
                            : "1.5px solid #bbb",
                          borderRadius: 0.5,
                          backgroundColor: isDone ? "#2e7d32" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isLoading ? (
                          <CircularProgress size={8} sx={{ color: "#fff" }} />
                        ) : isDone ? (
                          <span
                            style={{
                              color: "#fff",
                              fontSize: 9,
                              lineHeight: 1,
                            }}
                          >
                            ✓
                          </span>
                        ) : null}
                      </Box>
                      {/* name */}
                      <Typography
                        sx={{
                          fontSize: 9,
                          color: isDone ? "#2e7d32" : "#999",
                          fontWeight: isDone ? 600 : 400,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 70,
                        }}
                      >
                        {habit.name}
                      </Typography>
                    </Box>
                  );
                })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
