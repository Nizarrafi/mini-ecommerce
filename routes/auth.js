const router = require("express").Router();
const authController = require("../controllers/authController");
const guest = require("../middleware/guest");

router.get("/login", guest, authController.getLogin);
router.post("/login", guest, authController.login);
router.get("/register", guest, authController.getRegister);
router.post("/register", guest, authController.register);
router.get("/logout", authController.logout);

module.exports = router;