import express from "express";
import { createPreference } from "../controllers/merpago.controllers.js";

const router = express.Router();

router.post("/create_preference", async (req, res) => {
  try {
    const items = req.body.items.map(item => ({
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: item.currency_id,
    }));
    const back_urls = req.body.back_urls;
    const auto_return = req.body.auto_return;

    const preferenceId = await createPreference({ items, back_urls, auto_return });
    res.json({ id: preferenceId });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
