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
                        row.target_calories > 0
                        ? Number(
                            (
                                (
                                    Math.abs(
                                        row.target_calories - row.calories
                                    )
                                    / row.target_calories
                                ) * 100
                            ).toFixed(1)
                        )
                        : 0,

                    protein:
                        row.target_protein > 0
                        ? Number(
                            ((row.protein / row.target_protein) * 100)
                            .toFixed(1)
                        )
                        : 0,

                    carbs:
                        row.target_carbs > 0
                        ? Number(
                            ((row.carbs / row.target_carbs) * 100)
                            .toFixed(1)
                        )
                        : 0,

                    weight:
                        row.target_weight > 0
                        ? Number(
                            ((row.weight / row.target_weight) * 100)
                            .toFixed(1)
                        )
                        : 0
                }
            };
        });

        res.json({
            success: true,
            data: formattedResults
        });
    });
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


module.exports = router;