import React from "react";
import { Box, Typography, Button, List, ListItem } from "@mui/material";

export default function HabitSidebar({ habits, onAddClick, onDelete }) {
  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        backgroundColor: "#fff",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* header */}
      <Box sx={{ p: 2.5, borderBottom: "1px solid #f0f0f0" }}>
        <Typography
          sx={{ fontWeight: 700, fontSize: "1rem", color: "#1b5e20" }}
        >
          My Habits
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#aaa", mt: 0.5 }}>
          {habits.length} tracked
        </Typography>
      </Box>

      {/* list */}
      <List sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        {habits.map((habit) => (
          <ListItem
            key={habit.habit_id}
            sx={{
              px: 2,
              py: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "&:hover": { backgroundColor: "#f9fbe7" },
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#333" }}>
                {habit.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#aaa",
                  textTransform: "capitalize",
                }}
              >
                {habit.frequency}
              </Typography>
            </Box>
            <span
              onClick={() => onDelete(habit.habit_id)}
              style={{ cursor: "pointer", color: "#bbb", fontSize: 16 }}
            >
              ✕
            </span>
          </ListItem>
        ))}
      </List>

      {/* add button */}
      <Box sx={{ p: 2, borderTop: "1px solid #f0f0f0" }}>
        <Button
          fullWidth
          onClick={onAddClick}
          variant="contained"
          sx={{
            borderRadius: "999px",
            backgroundColor: "#2e7d32",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#1b5e20" },
          }}
        >
          + Add Habit
        </Button>
      </Box>
    </Box>
  );
}
