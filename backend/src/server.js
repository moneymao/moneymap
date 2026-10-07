import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./app.js");
const { default: connectDB } = await import("./config/db.js");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`MoneyMap API running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to start MoneyMap API:",
      error.message
    );

    process.exit(1);
  }
};

startServer();