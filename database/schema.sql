CREATE DATABASE IF NOT EXISTS alumni_db;
USE alumni_db;

DROP TABLE IF EXISTS Donation;
DROP TABLE IF EXISTS Achievement;
DROP TABLE IF EXISTS Project;
DROP TABLE IF EXISTS Job;
DROP TABLE IF EXISTS Degree;
DROP TABLE IF EXISTS Alumni;
DROP TABLE IF EXISTS Admin;

CREATE TABLE Admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Alumni (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    batch VARCHAR(10),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Donation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alumni_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    donation_date DATE,
    purpose TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_id) REFERENCES Alumni(id) ON DELETE CASCADE
);

-- Degree Table
CREATE TABLE Degree (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alumni_id INT NOT NULL,
    degree_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    year_of_completion INT,
    specialization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_id) REFERENCES Alumni(id) ON DELETE CASCADE
);

-- Achievement Table
CREATE TABLE Achievement (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alumni_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    achievement_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_id) REFERENCES Alumni(id) ON DELETE CASCADE
);

-- Project Table
CREATE TABLE Project (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alumni_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_id) REFERENCES Alumni(id) ON DELETE CASCADE
);

-- Job Table
CREATE TABLE Job (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alumni_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    start_date DATE,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_id) REFERENCES Alumni(id) ON DELETE CASCADE
);

-- Insert Sample Admin (Password: admin123)
INSERT INTO Admin (name, email, password) 
VALUES ('Admin User', 'admin@alumni.com', '$2a$10$YQ3b5Z5Z5Z5Z5Z5Z5Z5Z5Oe7Y3YvqC7qhqXjKxHxKxHxOE7Y3YvqO');

-- Insert Sample Alumni
-- Password for both: john123
INSERT INTO Alumni (name, email, phone, batch, password) 
VALUES 
('John Doe', 'john@example.com', '1234567890', '2020', '$2a$10$YQ3b5Z5Z5Z5Z5Z5Z5Z5Z5Oe7Y3YvqC7qhqXjKxHxKxHxOE7Y3YvqO'),
('Jane Smith', 'jane@example.com', '0987654321', '2019', '$2a$10$YQ3b5Z5Z5Z5Z5Z5Z5Z5Z5Oe7Y3YvqC7qhqXjKxHxKxHxOE7Y3YvqO');

-- Insert Sample Degrees
INSERT INTO Degree (alumni_id, degree_name, institution, year_of_completion, specialization)
VALUES 
(1, 'Bachelor of Engineering', 'NIT Sikkim', 2020, 'Computer Science'),
(2, 'Master of Science', 'Stanford University', 2019, 'Data Science');

-- Insert Sample Achievements
INSERT INTO Achievement (alumni_id, title, description, achievement_date)
VALUES 
(1, 'Best Paper Award', 'Received best paper award at IEEE Conference 2021', '2021-06-15'),
(2, 'Innovation Award', 'Won innovation award for AI project', '2022-03-20');

-- Insert Sample Projects
INSERT INTO Project (alumni_id, title, description, project_url)
VALUES 
(1, 'AI Chatbot', 'Developed an AI-powered chatbot for customer service', 'https://github.com/johndoe/ai-chatbot'),
(2, 'Data Analytics Dashboard', 'Created interactive dashboard for business analytics', 'https://github.com/janesmith/analytics-dashboard');

-- Insert Sample Jobs
INSERT INTO Job (alumni_id, company_name, position, start_date, location)
VALUES 
(1, 'Google', 'Software Engineer', '2020-07-01', 'Mountain View, CA'),
(2, 'Microsoft', 'Data Scientist', '2019-08-15', 'Seattle, WA');

-- Insert Sample Donations
INSERT INTO Donation (alumni_id, amount, donation_date, purpose)
VALUES 
(1, 5000.00, '2023-01-15', 'Scholarship Fund'),
(2, 10000.00, '2023-03-20', 'Infrastructure Development');