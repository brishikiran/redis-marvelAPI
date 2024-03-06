import express from "express";
import configRoutes from "./routes/index.js";
import redis from "redis";
const client = redis.createClient();
client.connect().then(() => {
  console.log("Redis Connected");
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/characters/history", async (req, res) => {
  try {
    const recentCharacterIds = await client.lRange(
      "recentlyViewedCharacters",
      0,
      19
    );

    const characterData = await Promise.all(
      recentCharacterIds.map(async (characterId) => {
        const cachedData = await client.json.get(`character:${characterId}`);
        return cachedData;
      })
    );

    res.json(characterData);
  } catch (error) {
    console.error("Error fetching character history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Middlewares:
app.use("/api/characters/:id", async (req, res, next) => {
  const regex = /^[0-9]+$/;
  const paramId = req.params.id;
  if (!regex.test(paramId)) {
    return res.status(404).json({ error: "Invalid ID" });
  }
  const cacheData = await client.json.get(`character:${paramId}`);
  if (cacheData) {
    console.log("Cached from redis server");
    await client.lPush("recentlyViewedCharacters", paramId);
    return res.json(cacheData);
  } else {
    next();
  }
});

app.use("/api/comics/:id", async (req, res, next) => {
  const regex = /^[0-9]+$/;
  const paramId = req.params.id;
  if (!regex.test(paramId)) {
    return res.status(404).json({ error: "Invalid ID" });
  }
  const cacheData = await client.json.get(`comic:${paramId}`);
  if (cacheData) {
    console.log("Cached from redis server");
    return res.json(cacheData);
  } else {
    next();
  }
});

app.use("/api/stories/:id", async (req, res, next) => {
  const regex = /^[0-9]+$/;
  const paramId = req.params.id;
  if (!regex.test(paramId)) {
    return res.status(404).json({ error: "Invalid ID" });
  }
  const cacheData = await client.json.get(`story:${paramId}`);
  if (cacheData) {
    console.log("Cached from redis server");
    return res.json(cacheData);
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a Marvel API server!");
  console.log("Your routes will be running on http://localhost:3000");
});
