CREATE DATABASE IF NOT EXISTS health_tracker;
USE health_tracker;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    height DECIMAL(4,1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- User target Table
CREATE TABLE IF NOT EXISTS Targets (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    target_weight DECIMAL(5,2),
    target_calories DECIMAL(6,2),
    target_protein DECIMAL(6,2),
    target_carbs DECIMAL(6,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES Users(user_id)
    ON DELETE CASCADE
);



-- Nutrition History Table
CREATE TABLE IF NOT EXISTS Nutrition_History (

    history_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    calories DECIMAL(6,2) DEFAULT 0,
    protein DECIMAL(6,2) DEFAULT 0,
    carbs DECIMAL(6,2) DEFAULT 0,
    weight DECIMAL(5,2),

    record_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES Users(user_id)
    ON DELETE CASCADE,

    UNIQUE(user_id, record_date)
);


-- habits tables

CREATE TABLE IF NOT EXISTS Habits (
    habit_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    frequency ENUM('daily','weekly') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Habit_User (
    user_id INT NOT NULL,
    habit_id INT NOT NULL,
    current_week TINYINT(1) NOT NULL,
    sunday TINYINT(1) DEFAULT 0,
    monday TINYINT(1) DEFAULT 0,
    tuesday TINYINT(1) DEFAULT 0,
    wednesday TINYINT(1) DEFAULT 0,
    thursday TINYINT(1) DEFAULT 0,
    friday TINYINT(1) DEFAULT 0,
    saturday TINYINT(1) DEFAULT 0,
    week_start_date DATE NOT NULL DEFAULT (CURDATE()),

    PRIMARY KEY (user_id, habit_id, current_week),

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (habit_id)
        REFERENCES Habits(habit_id)
        ON DELETE CASCADE
);


-- inserts
INSERT IGNORE INTO Users
(
    user_id,
    first_name,
    last_name,
    username,
    password_hash,
    age,
    gender,
    height
)

VALUES
(
    1,
    'Shahd',
    'Yasser',
    'shahd01',
    'hashed_password_here',
    22,
    'Female',
    165.0
);

INSERT IGNORE INTO Targets
(
    user_id,
    target_weight,
    target_calories,
    target_protein,
    target_carbs
)

VALUES
(
    1,
    65.0,
    2000,
    140,
    220
);

INSERT IGNORE INTO Nutrition_History
(
    user_id,
    calories,
    protein,
    carbs,
    weight,
    record_date
)

VALUES

(1, 1800, 120, 200, 70.5, CURDATE() - INTERVAL 6 DAY),

(1, 1900, 125, 210, 70.0, CURDATE() - INTERVAL 5 DAY),

(1, 2000, 130, 215, 69.8, CURDATE() - INTERVAL 4 DAY),

(1, 1950, 128, 220, 69.5, CURDATE() - INTERVAL 3 DAY),

(1, 2100, 135, 225, 69.2, CURDATE() - INTERVAL 2 DAY),

(1, 1850, 132, 218, 69.0, CURDATE() - INTERVAL 1 DAY),

(1, 1750, 138, 205, 68.7, CURDATE());



INSERT IGNORE INTO Habits (habit_id, name, description, frequency, created_at) VALUES
(1, 'Drink 2L of water',  'Stay hydrated throughout the day',       'daily', NOW() - INTERVAL 28 DAY),
(2, 'Morning stretch',    'Stretch for 10 minutes after waking up', 'daily', NOW() - INTERVAL 28 DAY),
(3, 'Read 20 minutes',    'Read any book before sleeping',          'daily', NOW() - INTERVAL 28 DAY),
(4, 'Weekly meal prep',   'Prepare meals for the whole week',       'weekly', NOW() - INTERVAL 28 DAY),
(5, 'No junk food',       'Avoid fast food and sugary snacks',      'daily', NOW() - INTERVAL 28 DAY);

-- habit 1
INSERT IGNORE INTO Habit_User VALUES
(1, 1, 1, 1,1,0,1,1,0,1, CURDATE() - INTERVAL 28 DAY),
(1, 1, 2, 0,1,1,0,1,1,0, CURDATE() - INTERVAL 21 DAY),
(1, 1, 3, 1,0,1,1,0,1,1, CURDATE() - INTERVAL 14 DAY),
(1, 1, 4, 0,1,0,1,1,1,0, CURDATE() - INTERVAL 7 DAY),
(1, 1, 5, 1,1,0,0,0,0,0, CURDATE());

-- habit 2
INSERT IGNORE INTO Habit_User VALUES
(1, 2, 1, 1,1,1,0,1,1,1, CURDATE() - INTERVAL 28 DAY),
(1, 2, 2, 1,0,1,1,1,0,1, CURDATE() - INTERVAL 21 DAY),
(1, 2, 3, 0,1,1,1,0,1,0, CURDATE() - INTERVAL 14 DAY),
(1, 2, 4, 1,1,0,1,1,0,1, CURDATE() - INTERVAL 7 DAY),
(1, 2, 5, 1,0,0,0,0,0,0, CURDATE());

-- habit 3
INSERT IGNORE INTO Habit_User VALUES
(1, 3, 1, 0,1,0,1,1,0,1, CURDATE() - INTERVAL 28 DAY),
(1, 3, 2, 1,1,0,0,1,1,0, CURDATE() - INTERVAL 21 DAY),
(1, 3, 3, 1,0,1,0,1,0,1, CURDATE() - INTERVAL 14 DAY),
(1, 3, 4, 0,1,1,1,0,1,0, CURDATE() - INTERVAL 7 DAY),
(1, 3, 5, 0,1,0,0,0,0,0, CURDATE());

-- habit 4
INSERT IGNORE INTO Habit_User VALUES
(1, 4, 1, 0,0,0,1,0,0,0, CURDATE() - INTERVAL 28 DAY),
(1, 4, 2, 0,0,0,0,0,1,0, CURDATE() - INTERVAL 21 DAY),
(1, 4, 3, 0,0,0,0,0,0,1, CURDATE() - INTERVAL 14 DAY),
(1, 4, 4, 0,0,0,1,0,0,0, CURDATE() - INTERVAL 7 DAY),
(1, 4, 5, 0,0,0,0,0,0,0, CURDATE());

-- habit 5
INSERT IGNORE INTO Habit_User VALUES
(1, 5, 1, 1,1,1,1,0,1,1, CURDATE() - INTERVAL 28 DAY),
(1, 5, 2, 1,0,1,1,1,1,0, CURDATE() - INTERVAL 21 DAY),
(1, 5, 3, 0,1,1,0,1,1,1, CURDATE() - INTERVAL 14 DAY),
(1, 5, 4, 1,1,0,1,1,0,1, CURDATE() - INTERVAL 7 DAY),
(1, 5, 5, 1,0,0,0,0,0,0, CURDATE());