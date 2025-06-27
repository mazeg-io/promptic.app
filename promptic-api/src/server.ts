import app from "./app";
import logger from "./lib/logger";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logger.info(`Promptic API server running on port ${PORT}`);
});
