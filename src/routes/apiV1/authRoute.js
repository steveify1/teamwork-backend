const { Router } = require("express");
const { signUp } = require("../../controllers/authController");

const router = new Router();

router.post("/create-user", signUp);

router.post("/signin", (req, res) => {
});

module.exports = router;