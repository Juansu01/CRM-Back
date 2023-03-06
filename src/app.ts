import express, { Express, Request, Response } from "express";
import db from "./models";
import cors from "cors";
import routes from "./routes/index";

const port = process.env.PORT || 4000;

const app: Express = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

routes.forEach((route) => {
  app.use("/api", route);
});

app.get("/api", async (req: Request, res: Response) => {
  res.send("Welcome to the Slsppln API");
});

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Connected to database and app is listening on port ${port}`);
  });
});
