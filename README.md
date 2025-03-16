# Questionnaire-Builder-App

# Create and use DB
```
CREATE DATABASE IF NOT EXISTS q_db;
USE q_db;
```

# Create user to access DB
```
CREATE USER 'localuser'@'localhost' IDENTIFIED BY 'localpasswd';
GRANT ALL PRIVILEGES ON q_db.* TO 'localuser'@'localhost';
FLUSH PRIVILEGES;
```

# Create tables
```
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS questionnaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    amount_of_questions INT DEFAULT 0,
    amount_of_completions INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    questionnaire_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('single_choice', 'multiple_choice', 'text') NOT NULL,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answer_choices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    choice_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    questionnaire_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_text TEXT,  -- For text responses
    completion_time TIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_response_choices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_response_id INT NOT NULL,
    answer_choice_id INT NOT NULL,
    FOREIGN KEY (user_response_id) REFERENCES user_responses(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_choice_id) REFERENCES answer_choices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questionnaire_completions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    questionnaire_id INT NOT NULL,
    completion_time TIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_statistics (
    question_id INT PRIMARY KEY,
    times_chosen INT DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

```