require("dotenv").config({ path: "./config/.env" }); // Charge les variables d'environnement
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectToDatabase = require("./config/db");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const cors = require("cors");

const app = express();

(async () => {
  try {
    // Connecte à MongoDB
    await connectToDatabase();

    const corsOption = {
      origin: process.env.CLIENT_URL,
      credentials: true,
      allowedHeaders: ["sessionId", "Content-Type"],
      exposedHeaders: ["sessionId"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
    };

    app.use(cors(corsOption));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    // jwt
    app.get("*", checkUser);
    app.get("/jwtid", requireAuth, (req, res) => {
      res.status(200).send(res.locals.user._id);
    });

    //routes
    app.use("/api/user", userRoutes);
    app.use("/api/post", postRoutes);

    // Lance le serveur
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Server failed to start:", err.message);
    process.exit(1);
  }
})();
