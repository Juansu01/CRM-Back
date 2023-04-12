import express, {
  Express,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import db from "./models";
import cors from "cors";
import routes from "./routes/index";
import * as OpenApiValidator from "express-openapi-validator";

const port = process.env.PORT || 4000;
const app: Express = express();
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
};

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use(
  OpenApiValidator.middleware({
    apiSpec: "./src/api.yaml",
    validateRequests: true,
    validateResponses: false,
    ignoreUndocumented: true,
  })
);

app.get("/api", async (req: Request, res: Response) => {
  res.send("Welcome to the Slsppln API");
});

routes.forEach((route) => {
  app.use("/api", route);
});

app.use(errorHandler);

db.sequelize.authenticate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Connected to database and app is listening on port ${port}`);
    })
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error)
  });

db.sequelize.sync().then()