import RadarIcon from "@mui/icons-material/Radar";
import { Box, Typography, Button } from "@mui/material";

export default function LowerCard() {
  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      
      {/* Header */}
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        
        {/* Icon */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "#e0e3e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RadarIcon sx={{ fontSize: 20 }} />
        </Box>

        {/* Title */}
        <Box>
          <Typography variant="h6">
            Habit Tracking
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Track the habits you want to adopt or stop
          </Typography>
        </Box>
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{ mt: 1.5, color: "#555" }}
      >
        Build better routines by tracking your daily habits. Stay consistent,
        identify patterns, and improve your lifestyle by reinforcing positive
        habits.
      </Typography>

      {/* Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
        
        <Button
          variant="contained"
          sx={{
            borderRadius: "15px",
            textTransform: "none",
            bgcolor: "#1f1b2e",
            px: 2,
            py: 0.5,
            "&:hover": { bgcolor: "#000" },
          }}
        >
          Open
        </Button>

        <Typography
          variant="caption"
          sx={{ cursor: "pointer" }}
        >
          Learn more →
        </Typography>
      </Box>

      {/* Decorative circles */}
      <Box sx={{ position: "absolute", bottom: 0, right: 10 }}>
        
        <Box
          sx={{
            position: "absolute",
            width: 60,
            height: 60,
            borderRadius: "50%",
            bgcolor: "#4a6cf7",
            right: 40,
            bottom: 40,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 50,
            height: 50,
            borderRadius: "50%",
            bgcolor: "#ff6b6b",
            right: 0,
            bottom: 2,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "#bcd4ff",
            right: 80,
            bottom: 2,
          }}
        />
      </Box>
    </Box>
  );
}