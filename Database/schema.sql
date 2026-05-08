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


-- current status Table
CREATE TABLE IF NOT EXISTS Current_Status (
    user_id INT PRIMARY KEY,

    current_weight DECIMAL(5,2),
    current_calories DECIMAL(6,2),
    current_protein DECIMAL(6,2),
    current_carbs DECIMAL(6,2),

    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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


-- inserts
INSERT INTO Users
(
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
    'Shahd',
    'Yasser',
    'shahd01',
    'hashed_password_here',
    22,
    'Female',
    165.0
);

INSERT INTO Targets
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


INSERT INTO Current_Status
(
    user_id,
    current_weight,
    current_calories,
    current_protein,
    current_carbs
)

VALUES
(
    1,
    69.5,
    1850,
    130,
    210
);


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

(1, 1800, 120, 200, 70.5, CURDATE() - INTERVAL 6 DAY),

(1, 1900, 125, 210, 70.0, CURDATE() - INTERVAL 5 DAY),

(1, 2000, 130, 215, 69.8, CURDATE() - INTERVAL 4 DAY),

(1, 1950, 128, 220, 69.5, CURDATE() - INTERVAL 3 DAY),

(1, 2100, 135, 225, 69.2, CURDATE() - INTERVAL 2 DAY),

(1, 1850, 132, 218, 69.0, CURDATE() - INTERVAL 1 DAY),

(1, 1750, 138, 205, 68.7, CURDATE());