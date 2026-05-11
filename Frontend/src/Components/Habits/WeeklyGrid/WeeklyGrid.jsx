import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { logHabit } from "../../../services/Habits/habitServices";

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// max week number the user can go back to (week 5 - 3 = week 2)
const MIN_WEEK = 2;
const MAX_WEEK = 5;

export default function WeeklyGrid({ habits, userId, onUpdate }) {
  const [currentWeek, setCurrentWeek] = useState(5);
  const [loadingCell, setLoadingCell] = useState(null);

  const isCurrent = currentWeek === MAX_WEEK;

  const handleCheck = async (habitId, dayKey) => {
    if (!isCurrent) return; // only current week is clickable
    const cellId = `${habitId}-${dayKey}`;
    setLoadingCell(cellId);
    try {
      await logHabit({
        user_id: userId,
        habit_id: habitId,
        current_week: currentWeek,
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
      {/* week navigation */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <span
          onClick={() => currentWeek > MIN_WEEK && setCurrentWeek((w) => w - 1)}
          style={{
            cursor: currentWeek > MIN_WEEK ? "pointer" : "default",
            fontSize: 22,
            color: currentWeek > MIN_WEEK ? "#2e7d32" : "#ccc",
            userSelect: "none",
          }}
        >
          ←
        </span>
        <Typography sx={{ fontWeight: 700, color: "#333" }}>
          {currentWeek === 5
            ? "This Week"
            : currentWeek === 4
              ? "1 Week Ago"
              : currentWeek === 3
                ? "2 Weeks Ago"
                : "3 Weeks Ago"}{" "}
        </Typography>
        <span
          onClick={() => currentWeek < MAX_WEEK && setCurrentWeek((w) => w + 1)}
          style={{
            cursor: currentWeek < MAX_WEEK ? "pointer" : "default",
            fontSize: 22,
            color: currentWeek < MAX_WEEK ? "#2e7d32" : "#ccc",
            userSelect: "none",
          }}
        >
          →
        </span>
        {isCurrent && (
          <Typography sx={{ fontSize: 12, color: "#aaa", ml: 1 }}>
            (checkable)
          </Typography>
        )}
      </Box>

      {/* grid */}
      <Box sx={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "6px",
          }}
        >
          {/* header row — day names */}
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "#888",
                  fontWeight: 700,
                  minWidth: 140,
                }}
              >
                Habit
              </th>
              {DAY_LABELS.map((label) => (
                <th
                  key={label}
                  style={{
                    textAlign: "center",
                    padding: "8px",
                    fontSize: 13,
                    color: "#888",
                    fontWeight: 700,
                    minWidth: 60,
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          {/* one row per habit */}
          <tbody>
            {habits.map((habit) => {
              const week = habit.weeks?.find(
                (w) => w.current_week === currentWeek,
              );
              return (
                <tr key={habit.habit_id}>
                  {/* habit name */}
                  <td style={{ padding: "8px 12px" }}>
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 600, color: "#333" }}
                    >
                      {habit.name}
                    </Typography>
                  </td>

                  {/* day cells */}
                  {DAY_KEYS.map((dayKey) => {
                    const isDone = week?.[dayKey] === 1;
                    const cellId = `${habit.habit_id}-${dayKey}`;
                    const isLoading = loadingCell === cellId;

                    return (
                      <td
                        key={dayKey}
                        style={{ textAlign: "center", padding: "4px" }}
                      >
                        <Box
                          onClick={() => handleCheck(habit.habit_id, dayKey)}
                          sx={{
                            width: 36,
                            height: 36,
                            margin: "0 auto",
                            borderRadius: 1.5,
                            border: isDone
                              ? "2px solid #2e7d32"
                              : "1.5px solid #e0e0e0",
                            backgroundColor: isDone ? "#e8f5e9" : "#fafafa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: isCurrent ? "pointer" : "default",
                            transition: "all 0.2s",
                            "&:hover": isCurrent
                              ? {
                                  borderColor: "#2e7d32",
                                  backgroundColor: "#f1f8e9",
                                }
                              : {},
                          }}
                        >
                          {isLoading ? (
                            <CircularProgress
                              size={14}
                              sx={{ color: "#2e7d32" }}
                            />
                          ) : isDone ? (
                            <span style={{ color: "#2e7d32", fontSize: 16 }}>
                              ✓
                            </span>
                          ) : null}
                        </Box>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
