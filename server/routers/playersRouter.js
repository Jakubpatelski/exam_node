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
      res.status(500).send({ error: 'Failed to get player' });
    }
  });

 // Get players by country
 router.get("/api/players/country/:country", async (req, res) => {
  const country = req.params.country;

  try {
    const [result] = await db.execute(
      'SELECT id, name, position, country, date_of_birth, league, value, description, img FROM players WHERE country = ?',
      [country]
    );

    if (result.length > 0) {
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
    } else {
      res.status(404).send({ error: `No players found from ${country}` });
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to get players by country' });
  }
});

// Fetch players by value in descending order
router.get("/api/players/value/value-descending", async (req, res) => {
  try {
    const [result] = await db.execute(
      'SELECT id, name, position, country, date_of_birth, league, value, description, img FROM players ORDER BY value DESC'
    );

    if (result.length > 0) {
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

    } else {
      res.status(404).send({ error: 'No players found' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to get players' });
  }
});


// Fetch players by value in ascending order
router.get("/api/players/value/value-ascending", async (req, res) => {
  try {
    const [result] = await db.execute(
      'SELECT id, name, position, country, date_of_birth, league, value, description, img FROM players ORDER BY value ASC'
    );

    if (result.length > 0) {
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
    } else {
      res.status(404).send({ error: 'No players found' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to get players' });
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
    )

    res.status(201).send({ message: `Player ${name} created` });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create player' });
  }
});


// Edit a player
router.put("/api/players/:id", upload.single("img"), async (req, res) => {
  const playerId = req.params.id;
  const { name, position, country, dateOfBirth, league, value, description } = req.body;

  try {
    // Check if the player exists
    const [existingPlayer] = await db.execute(
      'SELECT * FROM players WHERE id = ?',
      [playerId]
    );

    if (existingPlayer.length === 0) {
      return res.status(404).send({ error: 'Player not found' });
    }

    // Get the existing player's image path
    const existingImage = existingPlayer[0].img;

    // Determine the new image path
    const imgPath = req.file ? req.file.filename : existingImage;

    // Update the player information in the database
    await db.execute(
      'UPDATE players SET name = ?, position = ?, country = ?, date_of_birth = ?, league = ?, value = ?, description = ?, img = ? WHERE id = ?',
      [name, position, country, dateOfBirth, league, value, description, imgPath, playerId]
    );

    res.status(200).send({ message: `Player ${name} updated` });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update player' });
  }
});







// Delete a player by ID
router.delete("/api/players/:id", async (req, res) => {
    const playerId = req.params.id;
  
    try {
      // Get the image path of the player before deleting
      const [player] = await db.execute('SELECT img FROM players WHERE id = ?', [playerId]);
      const imgPath = player[0].img;
  
      if (imgPath && imgPath !== 'img/default.png') {
        const imagePath = `../client/public/${imgPath}`;
        fs.unlinkSync(imagePath);
      }
  
       await db.execute('DELETE FROM players WHERE id = ?', [playerId]);
  
      res.status(200).send({ message: `Player with ID ${playerId} deleted` });
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete player' });
    }
  });
  

// Fetch favorite players for a user
router.get("/api/users/:userId/favourites", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [result] = await db.execute(
      'SELECT p.id, p.name, p.position, p.country, p.date_of_birth, p.league, p.value, p.description, p.img FROM favorites f INNER JOIN players p ON f.player_id = p.id WHERE f.user_id = ?',
      [userId]
    );

    const favoritePlayers = result.map((player) => {
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
    
    res.send({ data: favoritePlayers });
  } catch (error) {
    res.status(500).send({ error: 'Failed to get favorite players' });
  }
});


// Add a player to favorites for a user
router.post("/api/users/:userId/favourites/:playerId", async (req, res) => {
  const userId = req.params.userId;
  const playerId = req.params.playerId;

  try {
    await db.execute(
      'INSERT INTO favorites (user_id, player_id) VALUES (?, ?)',
      [userId, playerId]
    );

    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to add player to favorites' });
  }
});

// Remove a player from favorites for a user
router.delete("/api/users/:userId/favourites/:playerId", async (req, res) => {
  const userId = req.params.userId;
  const playerId = req.params.playerId;

  try {
    await db.execute(
      'DELETE FROM favorites WHERE user_id = ? AND player_id = ?',
      [userId, playerId]
    );

    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to remove player from favorites' });
  }
});

  export default router;
  