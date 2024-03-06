import { Router } from "express";
import axios from "axios";
import md5 from "blueimp-md5";
const publickey = "c0bb02644e059a79963e758b26fa34f4";
const privatekey = "a542f837e2ef34ab7cdb35dbd4f8b972f821ba3f";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/stories";
import redis from "redis";
const client = redis.createClient();
client.connect().then(() => {});

const router = Router();

router.route("/:id").get(async (req, res) => {
  try {
    const paramId = req.params.id;
    const url =
      baseUrl +
      "/" +
      paramId +
      "?ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash;
    await axios
      .get(url)
      .then(async (response) => {
        const story = response.data.data.results[0];
        await client.json.set(`story:${paramId}`, "$", story);
        console.log("Response from API");
        res.json(story);
      })
      .catch((err) => {
        return res.status(404).json({ error: "Story not found" });
      });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
  return;
});

export default router;
