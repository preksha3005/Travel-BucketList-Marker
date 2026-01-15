import "./config/env.js";

import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import connectDB from "./config/db.js";

// IMPORTANT: this imports passport.js and runs its configuration
await import("./config/passport.js");

const app = express();

app.use(
  cors({
    origin: "https://travel-bucketlist-marker-frontend.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());

app.use(
  session({
    secret: process.env.KEY,
    resave: false,
    saveUninitialized: false,
  })
);

connectDB();

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/places", placeRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
