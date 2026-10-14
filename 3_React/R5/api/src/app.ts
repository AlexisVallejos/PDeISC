import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./config.js";
import { ensureBody } from "./middleware/ensureBody.js";
import { errorHandler, notFound } from "./middleware/errorHandlers.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: [config.clientUrl], credentials: true }));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(ensureBody);

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usersRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
