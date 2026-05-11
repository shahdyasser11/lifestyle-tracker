const express = require("express");
const router = express.Router();

const db = require("../../db");


//get last 7 days history
router.get("/:userId", (req, res) => {

    const userId = req.params.userId;
    const sql = `
        SELECT
            nh.record_date,
            nh.calories,
            nh.protein,
            nh.carbs,
            nh.weight,

            t.target_calories,
            t.target_protein,
            t.target_carbs,
            t.target_weight

        FROM Nutrition_History nh

        JOIN Targets t
        ON nh.user_id = t.user_id
        WHERE nh.user_id = ?
        ORDER BY nh.record_date DESC
        LIMIT 7
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err
            });
        }


        // a function to calculate percentage
        const calculatePercentage = (
            current,
            target
        ) => {

            if (
                current <= 0 ||
                target <= 0
            ) {
                return 0;
            }

            return Number(

                (
                    (
                        Math.min(current, target)
                        /
                        Math.max(current, target)
                    ) * 100
                ).toFixed(1)
            );
        };
        const formattedResults = results.map((row) => {

            return {

                date: row.record_date,

                current: {
                    calories: row.calories,
                    protein: row.protein,
                    carbs: row.carbs,
                    weight: row.weight
                },

                targets: {
                    calories: row.target_calories,
                    protein: row.target_protein,
                    carbs: row.target_carbs,
                    weight: row.target_weight
                },

                percentages: {

                    calories:
                        calculatePercentage(
                            row.calories,
                            row.target_calories
                        ),

                    protein:
                        calculatePercentage(
                            row.protein,
                            row.target_protein
                        ),

                    carbs:
                        calculatePercentage(
                            row.carbs,
                            row.target_carbs
                        ),

                    weight:
                        calculatePercentage(
                            row.weight,
                            row.target_weight
                        )
                }
            };
        });

        res.json({
            success: true,
            data: formattedResults
        });
    });
});

//get current data
router.get("/current/:userId", (req, res) => {

    const userId =
        req.params.userId;

    const sql = `

        SELECT

            calories,
            protein,
            carbs,
            weight,
            record_date

        FROM Nutrition_History

        WHERE user_id = ?

        ORDER BY record_date DESC

        LIMIT 1
    `;

    db.query(

        sql,

        [userId],

        (err, results) => {

            if (err) {

                return res.status(500).json({

                    success: false,
                    message: "Database error",
                    error: err
                });
            }

            if (results.length === 0) {

                return res.status(404).json({

                    success: false,
                    message: "No nutrition data found"
                });
            }

            const row =
                results[0];

            res.json({

                success: true,

                data: {

                    date:
                        row.record_date,

                    current: {

                        calories:
                            row.calories,

                        protein:
                            row.protein,

                        carbs:
                            row.carbs,

                        weight:
                            row.weight
                    }
                }
            });
        }
    );
});


// add or update today's data
router.post("/add", (req, res) => {

    const {
        user_id,
        calories,
        protein,
        carbs,
        weight
    } = req.body;

    const sql = `
        INSERT INTO Nutrition_History
        (
            user_id,
            calories,
            protein,
            carbs,
            weight,
            record_date
        )

        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            CURDATE()
        )

        ON DUPLICATE KEY UPDATE

            calories = VALUES(calories),
            protein = VALUES(protein),
            carbs = VALUES(carbs),
            weight = VALUES(weight)
    `;

    db.query(
        sql,
        [user_id, calories, protein, carbs, weight],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to save nutrition data",
                    error: err
                });
            }

            res.json({
                success: true,
                message: "Nutrition data saved successfully"
            });
        }
    );
});



//save targets in database
router.post("/targets", (req, res) => {

    const {
        user_id,
        target_weight,
        target_calories,
        target_protein,
        target_carbs
    } = req.body;

    const sql = `
        INSERT INTO targets
        (
            user_id,
            target_weight,
            target_calories,
            target_protein,
            target_carbs
        )

        VALUES (?, ?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE

            target_weight = VALUES(target_weight),
            target_protein = VALUES(target_protein),
            target_calories = VALUES(target_calories),
            target_carbs = VALUES(target_carbs)
    `;

    db.query(
        sql,
        [
            user_id,
            target_weight,
            target_calories,
            target_protein,
            target_carbs
        ],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    error: err
                });
            }

            res.json({
                success: true,
                message: "Targets saved successfully"
            });
        }
    );
});

module.exports = router;