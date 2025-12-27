const { youtubeRequest } = require("../services/youtubeServices");
const { getCache, setCache } = require("../utils/cache");

/* 🔍 SEARCH VIDEOS */
const searchVideos = async (req, res) => {
  try {
    const cacheKey = JSON.stringify(req.query);
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const {
      q,
      order = "relevance",
      duration,
      maxResults = 10,
      pageToken,
    } = req.query;

    const data = await youtubeRequest("search", {
      part: "snippet",
      q,
      type: "video",
      order,
      videoDuration: duration,
      maxResults,
      pageToken,
    });

    await setCache(cacheKey, data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 🔥 TRENDING VIDEOS */
const trendingVideos = async (req, res) => {
  try {
    const data = await youtubeRequest("videos", {
      part: "snippet,statistics",
      chart: "mostPopular",
      regionCode: "IN",
      maxResults: 10,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 🎬 VIDEO DETAILS */
const videoDetails = async (req, res) => {
  try {
    const { videoIds } = req.query;

    const data = await youtubeRequest("videos", {
      part: "snippet,statistics,contentDetails",
      id: videoIds,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 📺 CHANNEL ANALYTICS */
const channelAnalytics = async (req, res) => {
  try {
    const data = await youtubeRequest("channels", {
      part: "snippet,statistics",
      id: req.query.channelId,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 📱 SHORTS ONLY */
const shorts = async (req, res) => {
  try {
    const data = await youtubeRequest("search", {
      part: "snippet",
      type: "video",
      videoDuration: "short",
      maxResults: 10,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  searchVideos,
  trendingVideos,
  videoDetails,
  channelAnalytics,
  shorts,
};