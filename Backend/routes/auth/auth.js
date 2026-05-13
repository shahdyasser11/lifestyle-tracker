const express = require("express");
const router = express.Router();

const db = require("../../db");
const bcrypt = require("bcrypt");

// login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // find user
    const sql = `
      SELECT *
      FROM users
      WHERE username = ?
    `;

    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error("DATABASE ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      //  user not found
      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      const user = results[0];

      //password check
      // later replace with bcrypt.compare()

      const isMatch = await bcrypt.compare(
        password,
        user.password_hash
        );

        if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password",
        });
        }

      // success
      res.status(200).json({
        success: true,
        message: "Login successful",

        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          age: user.age,
          gender: user.gender,
          height: user.height,
          created_at: user.created_at,
        },
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      password,
      age,
      gender,
      height,
      weight,
    } = req.body;

    // ================= VALIDATION =================
    if (
      !firstName ||
      !lastName ||
      !username ||
      !password ||
      !age ||
      !gender ||
      !height ||
      !weight
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ================= CHECK USERNAME =================
    const checkUserSql = `
      SELECT *
      FROM users
      WHERE username = ?
    `;

    db.query(
      checkUserSql,
      [username],

      async (checkErr, checkResults) => {

        if (checkErr) {
          console.error(checkErr);

          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }

        // USER EXISTS
        if (checkResults.length > 0) {

          return res.status(409).json({
            success: false,
            message: "Email already exists",
          });
        }

        // ================= HASH PASSWORD =================
        const hashedPassword =
          await bcrypt.hash(password, 10);

        // ================= INSERT USER =================
        const insertSql = `
          INSERT INTO users (
            first_name,
            last_name,
            username,
            password_hash,
            age,
            gender,
            height,
            weight
          )

          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            firstName,
            lastName,
            username,
            hashedPassword,
            age,
            gender,
            height,
            weight,
          ],

          (insertErr, result) => {

            if (insertErr) {

              console.error(insertErr);

              return res.status(500).json({
                success: false,
                message:
                  "Failed to register user",
              });
            }

            // ================= USER ID =================
            const userId = result.insertId;

            // ================= INSERT INITIAL NUTRITION HISTORY =================
            const historySql = `
              INSERT INTO nutrition_history (
                user_id,
                calories,
                protein,
                carbs,
                weight,
                record_date
              )

              VALUES (?, ?, ?, ?, ?, CURDATE())
            `;

            db.query(
              historySql,
              [
                userId,
                0,
                0,
                0,
                weight,
              ],

              (historyErr) => {

                if (historyErr) {

                  console.error(historyErr);

                  return res.status(500).json({
                    success: false,
                    message:
                      "User created but failed to create nutrition history",
                  });
                }

                // ================= INSERT DEFAULT HABITS =================
                const habitsSql = `
                  INSERT INTO habit_user (
                    user_id,
                    habit_id,
                    current_week,
                    sunday,
                    monday,
                    tuesday,
                    wednesday,
                    thursday,
                    friday,
                    saturday,
                    week_start_date
                  )

                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
                `;

                db.query(
                  habitsSql,
                  [
                    userId,

                    1, // habit_id

                    1, // current_week

                    0, // sunday
                    0, // monday
                    0, // tuesday
                    0, // wednesday
                    0, // thursday
                    0, // friday
                    0, // saturday
                  ],

                  (habitsErr) => {

                    if (habitsErr) {

                      console.error(habitsErr);

                      return res.status(500).json({
                        success: false,
                        message:
                          "User created but failed to create habits",
                      });
                    }

                    // ================= SUCCESS =================
                    res.status(201).json({
                      success: true,

                      message:
                        "User registered successfully",

                      user: {
                        user_id: userId,
                        first_name: firstName,
                        last_name: lastName,
                        username,
                        age,
                        gender,
                        height,
                        weight,
                      },
                    });
                  }
                );
              }
            );
          }
        );
      }
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;