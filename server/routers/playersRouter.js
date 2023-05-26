import multer from "multer";
import db from "../database/connection.js";
import path from "path";
import { Router } from "express";
import fs from 'fs';

const router = Router()

// Multer middleware for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname);
      cb(null, uniqueSuffix + fileExtension);
    },
  });
  
  
  const upload = multer({ storage });
  


router.get("/api/players", async (req, res) => {
    const [result] = await db.execute("SELECT id, name, position, country, date_of_birth, league, value, description, img FROM players;");
    const players = result.map((player) => {
        // Convert date to the "YYYY-MM-DD" format
     const dateOfBirth = player.date_of_birth.toISOString().split("T")[0];
      return {
        id: player.id,
        name: player.name,
        position: player.position,
        country: player.country,
        league: player.league,
        value: player.value,
        description: player.description,
        dateOfBirth: dateOfBirth,
        imgPath: player.img
      };
    });
  
    res.send({ data: players });
  });

router.get("/api/players/:id", async (req, res) => {
    const playerId = req.params.id;
  
    try {

      const [result] = await db.execute(
        'SELECT id, name, position, country, date_of_birth, league, value, description, img FROM players WHERE id = ?',
        [playerId]
      );

  
      if (result.length > 0) {
        const player = result[0];
  
        res.send({
          id: player.id,
          name: player.name,
          position: player.position,
          country: player.country,
          league: player.league,
          dateOfBirth: player.date_of_birth,
          value: player.value,
          description: player.description,
          imgPath: player.img
        });
      } else {
        res.status(404).send({ error: `Player with ID ${playerId} not found` });
      }
    } catch (error) {
      console.error('Failed to get player:', error);
      res.status(500).send({ error: 'Failed to get player' });
    }
  });
// Create a player
router.post("/api/players", upload.single("img"), async (req, res) => {
  const { name, position, country, dateOfBirth, league, value, description } = req.body;
  const imgPath = req.file ? req.file.filename : 'img/default.png';

  try {
    // Save the player information to the database
    const result = await db.execute(
      'INSERT INTO players (name, position, country, date_of_birth, league, value, description, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, position, country, dateOfBirth, league, value, description, imgPath]
    );

    res.status(201).send({ message: `Player ${name} created` });
  } catch (error) {
    console.error('Failed to create player:', error);
    res.status(500).send({ error: 'Failed to create player' });
  }
});

 

// Delete a player by ID
router.delete("/api/players/:id", async (req, res) => {
    const playerId = req.params.id;
  
    try {
      // Get the image path of the player before deleting
      const [player] = await db.execute('SELECT img FROM players WHERE id = ?', [playerId]);
      const imgPath = player[0].img;
  
      if (imgPath  && imgPath !== '/img/default.png') {
        const imagePath = `../client/public/${imgPath}`;
        fs.unlinkSync(imagePath);
      }
  
       await db.execute('DELETE FROM players WHERE id = ?', [playerId]);
  
      res.status(200).send({ message: `Player with ID ${playerId} deleted` });
    } catch (error) {
      console.error('Failed to delete player:', error);
      res.status(500).send({ error: 'Failed to delete player' });
    }
  });
  
  export default router;
  