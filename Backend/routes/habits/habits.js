const express = require("express");
const router = express.Router();
const db = require("../../db");

const ALLOWED_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// ── HELPER — cycle one habit
// only cycles if week 5's start date is 7+ days ago
function checkAndCycleHabit(userId, habitId, callback) {
  // only look at week 5 — the current active week
  const checkSql = `
        SELECT current_week, week_start_date
        FROM Habit_User
        WHERE user_id = ?
          AND habit_id = ?
          AND current_week = 5
          AND DATEDIFF(CURDATE(), week_start_date) >= 7
    `;

  db.query(checkSql, [userId, habitId], (err, rows) => {
    // no cycling needed
    if (err || rows.length === 0) return callback();

    // step 1 — delete week 1 (oldest)
    const deleteSql = `
            DELETE FROM Habit_User
            WHERE user_id = ? AND habit_id = ? AND current_week = 1
        `;

    db.query(deleteSql, [userId, habitId], (err) => {
      if (err) return callback(err);

      // step 2 — shift weeks 2→1, 3→2, 4→3, 5→4
      const shiftSql = `
                UPDATE Habit_User
                SET current_week = current_week - 1
                WHERE user_id = ? AND habit_id = ?
            `;

      db.query(shiftSql, [userId, habitId], (err) => {
        if (err) return callback(err);

        // step 3 — insert fresh empty week 5
        const insertSql = `
                    INSERT INTO Habit_User
                    (user_id, habit_id, current_week,
                     sunday, monday, tuesday, wednesday,
                     thursday, friday, saturday, week_start_date)
                    VALUES (?, ?, 5, 0,0,0,0,0,0,0, CURDATE())
                `;

        db.query(insertSql, [userId, habitId], (err) => {
          callback(err);
        });
      });
    });
  });
}

// ── HELPER — check and cycle all habits for a user
function checkAndCycleAll(userId, callback) {
  // get all distinct habit ids for this user
  const getHabitsSql = `
        SELECT DISTINCT habit_id
        FROM Habit_User
        WHERE user_id = ?
    `;

  db.query(getHabitsSql, [userId], (err, habits) => {
    if (err || habits.length === 0) return callback();

    let completed = 0;

    habits.forEach((row) => {
      checkAndCycleHabit(userId, row.habit_id, () => {
        completed++;
        if (completed === habits.length) callback();
      });
    });
  });
}

// ── ROUTE 1 — GET /habits/:userId
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  checkAndCycleAll(userId, () => {
    const habitsSql = `
            SELECT DISTINCT
                h.habit_id,
                h.name,
                h.description,
                h.frequency,
                h.created_at
            FROM Habits h
            JOIN Habit_User hu ON h.habit_id = hu.habit_id
            WHERE hu.user_id = ?
            ORDER BY h.habit_id ASC
        `;

    db.query(habitsSql, [userId], (err, habits) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch habits",
          error: err,
        });
      }

      if (habits.length === 0) {
        return res.json({ success: true, data: [] });
      }

      const weeksSql = `
                SELECT
                    current_week,
                    sunday, monday, tuesday, wednesday,
                    thursday, friday, saturday,
                    week_start_date
                FROM Habit_User
                WHERE user_id = ? AND habit_id = ?
                ORDER BY current_week ASC
            `;

      const promises = habits.map(
        (habit) =>
          new Promise((resolve, reject) => {
            db.query(weeksSql, [userId, habit.habit_id], (err, weeks) => {
              if (err) return reject(err);
              resolve({ ...habit, weeks });
            });
          }),
      );

      Promise.all(promises)
        .then((results) => res.json({ success: true, data: results }))
        .catch((err) =>
          res.status(500).json({
            success: false,
            message: "Failed to fetch weeks",
            error: err,
          }),
        );
    });
  });
});

// ── ROUTE 2 — POST /habits/add
// body: { user_id, name, description, frequency }
router.post("/add", (req, res) => {
  const { user_id, name, description, frequency } = req.body;

  if (!user_id || !name || !frequency) {
    return res.status(400).json({
      success: false,
      message: "user_id, name and frequency are required",
    });
  }

  const insertHabitSql = `
        INSERT INTO Habits (name, description, frequency)
        VALUES (?, ?, ?)
    `;

  db.query(
    insertHabitSql,
    [name, description || null, frequency],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to create habit",
          error: err,
        });
      }

      const habitId = result.insertId;

      // insert exactly 5 weeks — week 5 is today, others are history
      const insertWeeksSql = `
            INSERT INTO Habit_User
            (user_id, habit_id, current_week,
             sunday, monday, tuesday, wednesday,
             thursday, friday, saturday, week_start_date)
            VALUES
            (?, ?, 1, 0,0,0,0,0,0,0, CURDATE() - INTERVAL 28 DAY),
            (?, ?, 2, 0,0,0,0,0,0,0, CURDATE() - INTERVAL 21 DAY),
            (?, ?, 3, 0,0,0,0,0,0,0, CURDATE() - INTERVAL 14 DAY),
            (?, ?, 4, 0,0,0,0,0,0,0, CURDATE() - INTERVAL 7  DAY),
            (?, ?, 5, 0,0,0,0,0,0,0, CURDATE())
        `;

      const values = [
        user_id,
        habitId,
        user_id,
        habitId,
        user_id,
        habitId,
        user_id,
        habitId,
        user_id,
        habitId,
      ];

      db.query(insertWeeksSql, values, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Failed to create habit weeks",
            error: err,
          });
        }

        res.json({
          success: true,
          message: "Habit created successfully",
          habit_id: habitId,
        });
      });
    },
  );
});

// ── ROUTE 3 — POST /habits/log
// body: { user_id, habit_id, current_week, day }
router.post("/log", (req, res) => {
  const { user_id, habit_id, current_week, day } = req.body;

  if (!ALLOWED_DAYS.includes(day)) {
    return res.status(400).json({
      success: false,
      message: "Invalid day name",
    });
  }

  if (!user_id || !habit_id || !current_week) {
    return res.status(400).json({
      success: false,
      message: "user_id, habit_id, current_week and day are required",
    });
  }

  // get current value to toggle
  const getValueSql = `
        SELECT \`${day}\` AS current_value
        FROM Habit_User
        WHERE user_id = ? AND habit_id = ? AND current_week = ?
    `;

  db.query(getValueSql, [user_id, habit_id, current_week], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to find that habit week",
        error: err,
      });
    }

    const newValue = rows[0].current_value === 1 ? 0 : 1;

    const updateSql = `
            UPDATE Habit_User
            SET \`${day}\` = ?
            WHERE user_id = ? AND habit_id = ? AND current_week = ?
        `;

    db.query(updateSql, [newValue, user_id, habit_id, current_week], (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to update day",
          error: err,
        });
      }

      res.json({
        success: true,
        message: newValue === 1 ? "Day marked as done!" : "Day unmarked",
        new_value: newValue,
      });
    });
  });
});

// ── ROUTE 4 — DELETE /habits/:habitId
router.delete("/:habitId", (req, res) => {
  const habitId = req.params.habitId;

  db.query("DELETE FROM Habits WHERE habit_id = ?", [habitId], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete habit",
        error: err,
      });
    }

    res.json({
      success: true,
      message: "Habit deleted successfully",
    });
  });
});

module.exports = router;
