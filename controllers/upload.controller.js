const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");

module.exports.uploadProfil = async (req, res) => {
  try {
    // Vérifiez que Multer a bien traité le fichier
    if (!req.file) {
      throw new Error("No file provided");
    }

    const fileName = req.file.filename;

    const result = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: `./uploads/profil/${fileName}` } },
      { new: true, upsert: true, setDefaultOnInsert: true }
    );

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error during upload:", err); // Log de l'erreur complète
    const errors = uploadErrors(err);
    return res.status(400).json({
      message: "File upload failed",
      errors,
    });
  }
};
