const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.cookies.token;
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect("/");
        } catch (err) {
            // Token invalid, proceed as guest
            res.clearCookie("token");
        }
    }
    next();
};
