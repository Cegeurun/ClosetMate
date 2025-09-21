DROP DATABASE IF EXISTS closetmate;
CREATE DATABASE IF NOT EXISTS closetmate;
USE closetmate;

CREATE TABLE IF NOT EXISTS user_info(
    user_id INTEGER AUTO_INCREMENT NOT NULL,
    user_username VARCHAR(50) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

INSERT INTO user_info(user_username, user_password)
VALUES 
('poopoo', 'peepee'),
('pou', 'pai');