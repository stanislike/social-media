const multer = require("multer");

// Définir les types MIME autorisés
const ALLOWED_MIME_TYPES = ["image/jpg", "image/jpeg", "image/png"];

// Configuration du stockage avec `diskStorage`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let storagePath;

    // Vérifier la route pour choisir le répertoire de stockage
    if (req.originalUrl.startsWith("/api/user/upload")) {
      // Chemin pour les photos de profil
      storagePath = "client/public/uploads/profil/";
    } else if (req.originalUrl.startsWith("/api/post")) {
      // Chemin pour les photos des posts
      storagePath = "client/public/uploads/post/";
    } else {
      // Gestion par défaut en cas de baseUrl inattendu
      return cb(new Error("Invalid base URL"), null);
    }

    cb(null, storagePath);
  },
  filename: (req, file, cb) => {
    let fileName;

    if (req.originalUrl.startsWith("/api/user/upload")) {
      // Chemin pour les photos de profil
      fileName = `${req.body.name}.jpg`;
    } else if (req.originalUrl.startsWith("/api/post")) {
      // Chemin pour les photos des posts
      fileName = `${req.body.posterId}${Date.now()}.jpg`;
    } else {
      // Gestion par défaut en cas de baseUrl inattendu
      return cb(new Error("Invalid base URL"), null);
    }

    cb(null, fileName);
  },
  // filename: (req, file, cb) => {
  // const extension = file.mimetype.split("/")[1];
  // const fileName = `${req.body.name}.jpg`;
  // cb(null, fileName);
  // },
});

// Configuration de Multer
const upload = multer({
  storage,
  limits: {
    fileSize: 500000, // Limite de taille (500 Ko)
  },
  fileFilter: (req, file, cb) => {
    // Vérifier si le type MIME est autorisé
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

module.exports = upload;
