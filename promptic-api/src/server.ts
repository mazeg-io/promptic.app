import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Promptic API server running on port ${PORT}`);
});
