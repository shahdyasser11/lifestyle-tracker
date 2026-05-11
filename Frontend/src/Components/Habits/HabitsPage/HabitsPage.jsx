import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Button } from "@mui/material";
import Navbar from "../../Navbar/Navbar";
import TopBar from "../TopBar/TopBar";
import HabitSidebar from "../HabitSidebar/HabitSidebar";
import WeeklyGrid from "../WeeklyGrid/WeeklyGrid";
import MonthlyGrid from "../MonthlyGrid/MonthlyGrid";
import AnalyticsView from "../AnalyticsView/AnalyticsView";
import AddHabitModal from "../AddHabitModal/AddHabitModal";
import { getHabits, deleteHabit } from "../../../services/Habits/habitServices";

const VIEWS = ["weekly", "monthly", "analytics"];

export default function HabitsPage() {
  const userId = 1;

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("weekly");
  const [modalOpen, setModalOpen] = useState(false);

  const loadHabits = async () => {
    setLoading(true);
    try {
      const res = await getHabits(userId);
      if (res.success) setHabits(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleDelete = async (habitId) => {
    await deleteHabit(habitId);
    await loadHabits();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#eef2f6",
        }}
      >
        <CircularProgress sx={{ color: "#2e7d32" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#eef2f6",
      }}
    >
      {/* NAVBAR */}
      <Navbar />

      {/* TOP STATS BAR */}
      <TopBar habits={habits} />

      <Box sx={{ display: "flex", flex: 1, p: 3, gap: 3 }}>
        {/* LEFT SIDEBAR */}
        <HabitSidebar
          habits={habits}
          onAddClick={() => setModalOpen(true)}
          onDelete={handleDelete}
        />

        {/* RIGHT AREA */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            p: 3,
          }}
        >
          {/* view toggle buttons */}
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            {VIEWS.map((v) => (
              <Button
                key={v}
                onClick={() => setView(v)}
                variant={view === v ? "contained" : "outlined"}
                sx={{
                  borderRadius: "999px",
                  textTransform: "capitalize",
                  fontWeight: 600,
                  ...(view === v
                    ? {
                        backgroundColor: "#2e7d32",
                        "&:hover": { backgroundColor: "#1b5e20" },
                      }
                    : { borderColor: "#2e7d32", color: "#2e7d32" }),
                }}
              >
                {v === "analytics"
                  ? "Analytics"
                  : `${v.charAt(0).toUpperCase() + v.slice(1)} View`}
              </Button>
            ))}
          </Box>

          {/* render correct view */}
          {view === "weekly" && (
            <WeeklyGrid habits={habits} userId={userId} onUpdate={loadHabits} />
          )}
          {view === "monthly" && (
            <MonthlyGrid
              habits={habits}
              userId={userId}
              onUpdate={loadHabits}
            />
          )}
          {view === "analytics" && <AnalyticsView habits={habits} />}
        </Box>
      </Box>

      <AddHabitModal
        open={modalOpen}
        userId={userId}
        onClose={() => setModalOpen(false)}
        onHabitAdded={() => {
          setModalOpen(false);
          loadHabits();
        }}
      />
    </Box>
  );
}
