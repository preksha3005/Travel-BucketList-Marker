import express from "express";
import passport from "passport";

const router = express.Router();

/*
  START GOOGLE LOGIN
  Redirects user to Google
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/*
  GOOGLE CALLBACK
  Google redirects here after login
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    // Successful login
    res.redirect("http://localhost:3000/dashboard");
  }
);

/*
  GET CURRENT LOGGED-IN USER
  Used by frontend to check auth status
 */
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.json(null);
  }
  res.json(req.user);
});

/*
  LOGOUT USER
  Destroys session
 */
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.sendStatus(200);
  });
});

export default router;
