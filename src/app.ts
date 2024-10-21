import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { corsHandler } from "./middlewares/cors";
import routes from "./routes";

const PORT = 4000;
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

app.use(helmet());
// CORS middleware with credentials support
app.use(corsHandler);

// Explicitly handle preflight OPTIONS requests
// app.options('*', cors());

app.use("/api/auth", routes.authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
