import db from "../database/connection.js";
import { Router } from "express";

const router = Router()


// Get all reviews for a player
router.get("/api/players/:id/reviews", async (req, res) => {
    const playerId = req.params.id;
  
    try {
      // Check if the player exists
      const [playerResult] = await db.execute(
        'SELECT id FROM players WHERE id = ?',
        [playerId]
      );
  
      if (playerResult.length === 0) {
        return res.status(404).send({ error: `Player with ID ${playerId} not found` });
      }
  
      // Fetch all reviews for the player
      const [result] = await db.execute(
        'SELECT id, player_id, user_id, comment FROM reviews WHERE player_id = ?',
        [playerId]
      );
  
      const reviews = result.map((review) => {
        return {
          id: review.id,
          playerId: review.player_id,
          userId: review.user_id,
          comment: review.comment,
        };
      });
  
      res.send({ data: reviews });
    } catch (error) {
      res.status(500).send({ error: 'Failed to get reviews' });
    }
  });

  
// Create a new review for a player
router.post("/api/reviews", async (req, res) => {
    const { player_id, user_id, comment } = req.body;
  
    try {
      // Check if the player exists
      const [playerResult] = await db.execute(
        'SELECT id FROM players WHERE id = ?',
        [player_id]
      );
  
      if (playerResult.length === 0) {
        return res.status(404).send({ error: `Player with ID ${player_id} not found` });
      }
  
      // Insert the review into the reviews table
      const [result] = await db.execute(
        'INSERT INTO reviews (player_id, user_id, comment) VALUES (?, ?, ?)',
        [player_id, user_id, comment]
      );
  
      if (result.affectedRows === 1) {
        res.status(201).send({ message: 'Review created successfully' });
      } else {
        res.status(500).send({ error: 'Failed to create review' });
      }
    } catch (error) {
      res.status(500).send({ error: 'Failed to create review' });
    }
  });
  
  export default router;
