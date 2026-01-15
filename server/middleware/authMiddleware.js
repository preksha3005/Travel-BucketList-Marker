export const isAuth = (req, res, next) => {
  // Passport puts the logged-in user on req.user
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
  next();
};
