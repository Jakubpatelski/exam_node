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
    const [result] = await db.execute("SELECT id, first_name, last_name, country, date_of_birth, league, img FROM players;");
    const players = result.map((player) => {
        // Convert date to the "YYYY-MM-DD" format
     const dateOfBirth = player.date_of_birth.toISOString().split("T")[0];
      return {
        id: player.id,
        firstName: player.first_name,
        lastName: player.last_name,
        country: player.country,
        league: player.league,
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
        'SELECT id, first_name, last_name, country, date_of_birth, league, img FROM players WHERE id = ?',
        [playerId]
      );

  
      if (result.length > 0) {
        const player = result[0];
  
        res.send({
          id: player.id,
          firstName: player.first_name,
          lastName: player.last_name,
          country: player.country,
          league: player.league,
          dateOfBirth: player.date_of_birth,
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
    const { firstName, lastName, country, dateOfBirth, league } = req.body;
    const imgPath = req.file ? req.file.filename : null;
  
    try {
       
      // Save the player information to the database
      const result = await db.execute(
        'INSERT INTO players (first_name, last_name, country, date_of_birth, league, img) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, country, dateOfBirth, league, imgPath]
      );
    
      res.status(201).send({ message: `Player ${firstName} created`});
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
  
      if (imgPath) {
        const imagePath = path.join('../client/public', imgPath);
        fs.unlinkSync(imagePath);
      }
  
      const result = await db.execute('DELETE FROM players WHERE id = ?', [playerId]);
  
      res.status(200).send({ message: `Player with ID ${playerId} deleted` });
    } catch (error) {
      console.error('Failed to delete player:', error);
      res.status(500).send({ error: 'Failed to delete player' });
    }
  });
  
  export default router;
  