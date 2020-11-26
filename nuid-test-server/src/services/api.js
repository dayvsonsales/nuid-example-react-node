const axios = require("axios");

const nuidApiKey = process.env.NUID_API_KEY || "";

const api = axios.create({
  baseURL: "https://auth.nuid.io",
  headers: {
    "X-API-Key": nuidApiKey,
    "Content-Type": "application/json",
  },
});

module.exports = api;
