import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";

import {
  Box,
  Typography,
} from "@mui/material";

export default function LowerCard() {

  return (
    <Box
      sx={{
        position: "relative",

        height: "100%",

        overflow: "hidden",

        display: "flex",

        flexDirection: "column",

        justifyContent: "space-between",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",

          gap: 1.5,

          alignItems: "center",
        }}
      >
        {/* ICON */}
        <Box
          sx={{
            width: 44,

            height: 44,

            borderRadius: "50%",

            bgcolor: "#edf7ee",

            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            boxShadow:
              "0 4px 12px rgba(46,125,50,0.08)",
          }}
        >
          <FitnessCenterRoundedIcon
            sx={{
              fontSize: 22,

              color: "#2e7d32",
            }}
          />
        </Box>

        {/* TITLE */}
        <Box>
          <Typography
            variant="h6"

            sx={{
              fontWeight: 700,
            }}
          >
            Move Your Body
          </Typography>

          <Typography
            variant="caption"

            color="text.secondary"
          >
            Gentle progress through
            daily movement
          </Typography>
        </Box>
      </Box>

      {/* DESCRIPTION */}
      <Typography
        variant="body2"

        sx={{
          mt: 1.8,

          color: "#5f6368",

          lineHeight: 1.8,

          fontSize: "0.92rem",
        }}
      >
        Consistent movement improves
        both physical and mental
        wellbeing. Small workout
        sessions every day help build
        energy, strength, balance,
        and long-term healthy habits.
      </Typography>

      {/* MINI CARDS */}
      <Box
        sx={{
          display: "flex",

          gap: 1.2,

          mt: 2.5,
        }}
      >
        {/* CARD */}
        <Box
          sx={{
            flex: 1,

            bgcolor: "#f3faf4",

            borderRadius: "1.2rem",

            p: 1.4,

            border:
              "1px solid #e4efe5",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.2rem",

              fontWeight: 800,

              color: "#2e7d32",
            }}
          >
            5x
          </Typography>

          <Typography
            sx={{
              fontSize: "0.75rem",

              color: "text.secondary",

              mt: 0.3,
            }}
          >
            workouts this week
          </Typography>
        </Box>

        {/* CARD */}
        <Box
          sx={{
            flex: 1,

            bgcolor: "#f5f7ff",

            borderRadius: "1.2rem",

            p: 1.4,

            border:
              "1px solid #e7ebff",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.2rem",

              fontWeight: 800,

              color: "#4a6cf7",
            }}
          >
            320
          </Typography>

          <Typography
            sx={{
              fontSize: "0.75rem",

              color: "text.secondary",

              mt: 0.3,
            }}
          >
            avg kcal burned
          </Typography>
        </Box>
      </Box>

      {/* FOOTER NOTE */}
      <Typography
        sx={{
          mt: 2,

          fontSize: "0.78rem",

          color: "#7a7a7a",

          fontStyle: "italic",
        }}
      >
        “A little progress each day
        adds up to big results.”
      </Typography>

      {/* DECORATION */}
      <Box
        sx={{
          position: "absolute",

          width: 140,

          height: 140,

          borderRadius: "50%",

          bgcolor:
            "rgba(46,125,50,0.04)",

          bottom: -70,

          right: -50,
        }}
      />
    </Box>
  );
}