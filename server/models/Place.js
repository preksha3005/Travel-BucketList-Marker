import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: String,
  notes: String,
  status: {
    type: String,
    enum: ["wishlist", "visited"],
    default: "wishlist"
  },
  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: [Number] // [lng, lat]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

placeSchema.index({ location: "2dsphere" });

export default mongoose.model("Place", placeSchema);
