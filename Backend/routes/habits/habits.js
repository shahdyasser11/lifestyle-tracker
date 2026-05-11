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

// helper — check and cycle any overdue weeks for a user
function checkAndCycleAll(userId, callback) {
  // find all habit weeks where 7+ days have passed
  const findOverdueSql = `
        SELECT user_id, habit_id, current_week
        FROM Habit_User
        WHERE user_id = ?
          AND DATEDIFF(CURDATE(), week_start_date) >= 7
    `;

  db.query(findOverdueSql, [userId], (err, overdueRows) => {
    if (err || overdueRows.length === 0) return callback();

    // cycle each overdue habit week one by one
    let completed = 0;

    overdueRows.forEach((row) => {
      cycleHabit(row.user_id, row.habit_id, () => {
        completed++;
        if (completed === overdueRows.length) callback();
      });
    });
  });
}

// helper — cycle one habit (delete oldest week, shift down, insert new week 5)
function cycleHabit(userId, habitId, callback) {
  // step 1 — find oldest week
  const findOldestSql = `
        SELECT MIN(current_week) AS oldest
        FROM Habit_User
        WHERE user_id = ? AND habit_id = ?
    `;

  db.query(findOldestSql, [userId, habitId], (err, rows) => {
    if (err) return callback(err);

    const oldest = rows[0].oldest;

    // step 2 — delete oldest week
    const deleteSql = `
            DELETE FROM Habit_User
            WHERE user_id = ? AND habit_id = ? AND current_week = ?
        `;

    db.query(deleteSql, [userId, habitId, oldest], (err) => {
      if (err) return callback(err);

      // step 3 — shift all remaining weeks down by 1
      const shiftSql = `
                UPDATE Habit_User
                SET current_week = current_week - 1
                WHERE user_id = ? AND habit_id = ?
            `;

      db.query(shiftSql, [userId, habitId], (err) => {
        if (err) return callback(err);

        // step 4 — insert fresh empty week 5 with today as start date
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

// ── ROUTE 1 — GET /habits/:userId
// fetch all habits with all 5 weeks — also auto cycles overdue weeks
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  // first check and cycle any overdue weeks
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

      // insert 5 empty weeks, week 5 starts today, others are placeholder history
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
// day is the string name: "sunday", "monday" ... "saturday"
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

  // get current value of that day cell to toggle it
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
// Habit_User rows deleted automatically via ON DELETE CASCADE
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
