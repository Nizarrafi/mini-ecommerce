const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authController = {
    // Views
    getLogin: (req, res) => {
        res.render("login");
    },
    getRegister: (req, res) => {
        res.render("register");
    },

    // Actions
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create(name, email, hashedPassword);
            res.redirect("/auth/login");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error registering user");
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);

            if (!user) return res.render("login", { error: "User not found" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.render("login", { error: "Wrong password" });

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.cookie("token", token, { httpOnly: true });
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error logging in");
        }
    },

    logout: (req, res) => {
        res.clearCookie("token");
        res.redirect("/auth/login");
    },
};

module.exports = authController;
