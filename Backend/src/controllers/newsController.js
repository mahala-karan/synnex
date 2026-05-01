// controllers/newsController.js

const NewsModel = require("../models/newsModel");
const News = NewsModel.News || NewsModel;

const createNewsController = async (req, res) => {
  try {
    const allowedRoles = ["teacher", "faculty", "admin", "college"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: "fail", message: "Access Denied." });
    }

    const { title, type, content, author } = req.body;
    
    // Asli naam ensure kar rahe hain
    const finalAuthor = author || (req.user.firstName ? `${req.user.firstName} ${req.user.lastName || ''}` : "College Admin");

    // Safely object bana rahe hain taaki crash na ho
    let newsData = {
      title,
      type,
      content,
      author: finalAuthor
    };

    // User ID nikal rahe hain
    let userId = req.user._id || req.user.id;
    if (userId) userId = String(userId); // Ensure it's a string

    // 🔥 MAHA-MAGIC FIX: Strict 24-character hex check. 
    // Ye line "master_admin_id" ko 100% block kar degi aur crash bachayegi!
    if (userId && userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId)) {
        newsData.createdBy = userId;
    }

    // Ab safely save hoga!
    const news = await News.create(newsData);
    
    res.status(201).json({ status: "success", data: { news } });
  } catch (error) {
    console.error("Error publishing news:", error);
    res.status(500).json({ status: "fail", message: "Error publishing news", exactError: error.message });
  }
};

const getAllNewsController = async (req, res) => {
  try {
    const news = await News.find()
      .populate("createdBy", "firstName lastName role")
      .sort({ createdAt: -1 });
      
    res.status(200).json({ status: "success", data: { news } });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ status: "fail", message: "Error fetching news" });
  }
};

const deleteNewsController = async (req, res) => {
  try {
    const newsId = req.params.id;
    const news = await News.findById(newsId);

    if (!news) {
        return res.status(404).json({ status: "fail", message: "News not found." });
    }

    let userId = String(req.user._id || req.user.id);

    if (req.user.role !== "admin" && news.createdBy && String(news.createdBy) !== userId) {
        return res.status(403).json({ status: "fail", message: "Access Denied." });
    }

    await News.findByIdAndDelete(newsId);
    res.status(200).json({ status: "success", message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ status: "fail", message: "Error deleting news" });
  }
};

module.exports = { createNewsController, getAllNewsController, deleteNewsController };
