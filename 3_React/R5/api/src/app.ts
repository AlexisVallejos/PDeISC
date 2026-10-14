import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { ensureBody } from "./middleware/ensureBody.js";
import { errorHandler, notFound } from "./middleware/errorHandlers.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: config.clientUrls, credentials: true }));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(ensureBody);

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usersRoutes);

app.use(express.static(fileURLToPath(new URL("../../portal/", import.meta.url))));

app.use(notFound);
app.use(errorHandler);

export default app;
