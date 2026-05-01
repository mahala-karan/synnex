const express = require("express");
const router = express.Router();
// 🔥 FIX: deleteNewsController ko bhi import kiya
const { createNewsController, getAllNewsController, deleteNewsController } = require("../controllers/newsController");
const checkAuth = require("../middlewares/checkAuth"); 

router.post("/create", checkAuth, createNewsController);
router.get("/all", checkAuth, getAllNewsController);

// 🔥 NAYA: Delete karne ka route yahan add kar diya
router.delete("/delete/:id", checkAuth, deleteNewsController);

module.exports = router;
