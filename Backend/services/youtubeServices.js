const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const youtubeRequest = async (endpoint, params) => {
  const url = `${YOUTUBE_API_BASE_URL}/${endpoint}`;
  const response = await axios.get(url, {
    params: {
      ...params,
      key: YOUTUBE_API_KEY
    }
  });
  return response.data;
};


module.exports = { youtubeRequest };