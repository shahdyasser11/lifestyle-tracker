import {
  Box,
  Typography,
} from "@mui/material";

import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";

import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";

import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

export default function RightCard() {

  return (
    <Box
      sx={{
        borderRadius: "1.5rem",

        bgcolor: "#f4f7f9",

        p: 1,
        mt:-1,
        ml:-1,

        display: "flex",

        flexDirection: "column",

        justifyContent: "space-between",

        gap: 2,

        height: "100%",

        boxShadow:
          "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >
      {/* HEADER */}
      <Box>
        <Typography
          variant="h4"

          sx={{
            fontWeight: 800,

            color: "#1b5e20",

            lineHeight: 1.2,
          }}
        >
          Smart Health Tracker
        </Typography>


      </Box>

      {/* FEATURES */}
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns:
            "1fr 1fr",

          gap: 2,
        }}
      >
        {/* FEATURE 1 */}
        <Box
          sx={{
            bgcolor: "#fff",

            borderRadius: "1.2rem",

            p: 2,

            display: "flex",

            gap: 1.5,

            alignItems: "flex-start",
          }}
        >
          <FavoriteRoundedIcon
            sx={{
              color: "#ef4444",
            }}
          />

          <Box>
            <Typography
              fontSize={12}
              color="text.secondary"
            >
              Track your body metrics
              and daily progress.
            </Typography>
          </Box>
        </Box>

        {/* FEATURE 2 */}
        <Box
          sx={{
            bgcolor: "#fff",

            borderRadius: "1.2rem",

            p: 2,

            display: "flex",

            gap: 1.5,

            alignItems: "flex-start",
          }}
        >
          <RestaurantRoundedIcon
            sx={{
              color: "#16a34a",
            }}
          />

          <Box>
            <Typography
              fontSize={12}
              color="text.secondary"
            >
              Monitor calories,
              protein, carbs and
              goals.
            </Typography>
          </Box>
        </Box>

        {/* FEATURE 3 */}
        <Box
          sx={{
            bgcolor: "#fff",

            borderRadius: "1.2rem",

            p: 2,

            display: "flex",

            gap: 1.5,

            alignItems: "flex-start",
          }}
        >
          <DirectionsRunRoundedIcon
            sx={{
              color: "#3b82f6",
            }}
          />

          <Box>
            <Typography
              fontSize={12}
              color="text.secondary"
            >
              Build consistency with
              healthy routines.
            </Typography>
          </Box>
        </Box>

        {/* FEATURE 4 */}
        <Box
          sx={{
            bgcolor: "#fff",

            borderRadius: "1.2rem",

            p: 2,

            display: "flex",

            gap: 1.5,

            alignItems: "flex-start",
          }}
        >
          <InsightsRoundedIcon
            sx={{
              color: "#f59e0b",
            }}
          />

          <Box>


            <Typography
              fontSize={12}
              color="text.secondary"
            >
              Receive feedback and
              personalized progress
              analysis.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          bgcolor: "#1b5e20",

          color: "#fff",

          borderRadius: "1.2rem",

          px: 2.5,

          py: 1.5,

          fontWeight: 600,

          fontSize: "0.95rem",

          textAlign: "center",
        }}
      >
        Stay consistent. Small daily
        improvements lead to lasting
        results 🌿
      </Box>
    </Box>
  );
}