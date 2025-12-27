const express = require("express");
const router = express.Router();
const { searchVideos, videoDetails } = require("../controllers/youtubeController");
const { trendingVideos } = require("../controllers/youtubeController");
const { channelAnalytics } = require("../controllers/youtubeController");
const { shorts } = require("../controllers/youtubeController");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: "Too many requests from this IP, please try again after a minute",
});

router.get("/search", limiter, searchVideos);
router.get("/trending", trendingVideos);
router.get("/videos", videoDetails);
router.get("/channel", channelAnalytics);
router.get("/shorts", shorts);


module.exports = router;
