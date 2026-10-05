import app from "./app.js";
import { config, requireConfig } from "./config.js";

requireConfig();

app.listen(config.port, () => console.log(`API en http://localhost:${config.port}`));
