import express, { Express, Request, Response } from "express";
import db from "./models";

const port = process.env.PORT || 8000;

const app: Express = express();

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello from express and TypeScript!");
});

app.get("/hello", async (req: Request, res: Response) => {
  res.send("Bye from new route!");
});

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Connected to database and app is listening on port ${port}`);
  });
});
