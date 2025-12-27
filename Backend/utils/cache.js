const redis = require("../config/redis");

// exports.getCache = async (key) => {
//   const data = await redis.get(key);
//   return data ? JSON.parse(data) : null;
// };

// exports.setCache = async (key, value, ttl = 3600) => {
//   await redis.set(key, JSON.stringify(value), { EX: ttl });
// };

const getCache = async ()=>{null} ;
const setCache = async ()=>{};

module.exports = {
  getCache,
  setCache,
};