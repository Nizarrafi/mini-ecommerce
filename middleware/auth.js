const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/auth/login"); // Updated redirect path
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Make user available in views
    res.locals.user = decoded;
    next();
  } catch (err) {
    // If token invalid, clear it
    res.clearCookie("token");
    return res.redirect("/auth/login"); // Updated redirect path
  }
};