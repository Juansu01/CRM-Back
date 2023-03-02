import express, { Express, Request, Response } from "express";

const port = 8000;

const app: Express = express();

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello from express and TypeScript!");
});

app.get("/hello", async (req: Request, res: Response) => {
  res.send("Bye from new route!");
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
