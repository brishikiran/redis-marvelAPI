import characterRoutes from "./character.js";
import comicRoutes from "./comic.js";
import storyRoutes from "./stories.js";

const constructorMethod = (app) => {
  app.use("/api/characters", characterRoutes);
  app.use("/api/comics", comicRoutes);
  app.use("/api/stories", storyRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not found" });
  });
};

export default constructorMethod;
