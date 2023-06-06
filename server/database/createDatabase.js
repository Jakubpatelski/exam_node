import db from "./connection.js"
import * as dotenv from "dotenv"
dotenv.config()

const isDeleteMode = process.argv.findIndex((argument) => argument === "delete_mode") === -1 ? false : true;

if (isDeleteMode) {
    
    db.execute(`DROP TABlE if exists users`)
    db.execute(`DROP TABLE if exists players`)
    db.execute(`DROP TABLE if exists favorites;`);

}

db.execute(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(500) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL
);
`);

db.execute(`INSERT INTO users(email, username, password, admin)
  VALUES(?, ?, ?, ?)`, ["admin", "admin", "admin", 1]);
  


db.execute(`
CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    position VARCHAR(255),
    country VARCHAR(255),
    date_of_birth DATE,
    league VARCHAR(255),
    value DECIMAL(12, 2),
    description VARCHAR(255),
    img VARCHAR(255)
  );
`);


db.execute(`
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  player_id INT,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (player_id) REFERENCES players (id)
);`)


