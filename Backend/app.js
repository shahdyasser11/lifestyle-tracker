const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
const nutritionHistoryRoutes =
require("./routes/nutrition/nutritionHistory");
app.use("/nutrition", nutritionHistoryRoutes); ///nutrition becomes prefix for all routes inside that router.


// test route
app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Health Tracker API is running"
    });
});


// handle unknown routes
app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


// start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});