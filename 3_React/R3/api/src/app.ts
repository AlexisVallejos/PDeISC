import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { fileURLToPath } from "node:url";
import { ensureBody } from "./middleware/ensureBody.js";
import { errorHandler, notFound } from "./middleware/errorHandlers.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178"], credentials: true }));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(ensureBody);

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usersRoutes);

app.use(express.static(fileURLToPath(new URL("../../portal/", import.meta.url))));

app.use(notFound);
app.use(errorHandler);

export default app;
