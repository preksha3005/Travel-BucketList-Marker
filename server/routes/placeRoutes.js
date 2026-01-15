import express from "express";
import Place from "../models/Place.js";
import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", isAuth, async (req, res) => {
  try {
    const { name, notes, location } = req.body;

    // Basic validation
    if (!name || !location || !location.coordinates) {
      return res.status(400).json({
        message: "Name and location are required",
      });
    }

    const place = await Place.create({
      userId: req.user._id, // 🔐 backend-controlled
      name,
      notes,
      status: "wishlist",
      location,
    });

    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ message: "Failed to add place" });
  }
});

router.get("/my", isAuth, async (req, res) => {
  try {
    const places = await Place.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch places" });
  }
});

router.put("/:id/visited", isAuth, async (req, res) => {
  try {
    const place = await Place.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id, // 🔐 ownership check
      },
      { status: "visited" },
      { new: true }
    );

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    res.json(place);
  } catch (error) {
    res.status(500).json({ message: "Failed to update place" });
  }
});

// UPDATE NOTES FOR A PLACE
router.put("/:id/notes", isAuth, async (req, res) => {
  try {
    const { notes } = req.body;

    const place = await Place.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id, // 🔐 ownership check
      },
      { notes },
      { new: true }
    );

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    res.json(place);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notes",
    });
  }
});

export default router;
