const express = require("express");
const router = express.Router();

const db = require("../../db");
const bcrypt = require("bcrypt");

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

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

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

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

    // validation
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

    // check if username already exists
    const checkUserSql = `
      SELECT *
      FROM users
      WHERE username = ?
    `;

    db.query(checkUserSql, [username], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error(checkErr);
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (checkResults.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // insert user
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
              message: "Failed to register user",
            });
          }

          const userId = result.insertId;

          // insert initial nutrition history
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
            [userId, 0, 0, 0, weight],

            (historyErr) => {
              if (historyErr) {
                console.error(historyErr);
                return res.status(500).json({
                  success: false,
                  message:
                    "User created but failed to create nutrition history",
                });
              }

              // success — no default habits inserted
              res.status(201).json({
                success: true,
                message: "User registered successfully",
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
            },
          );
        },
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
