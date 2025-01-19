const userModel = require("../models/user.model");
const objectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Erreur serveur : " + err);
  }
};

module.exports.userInfo = async (req, res) => {
  try {
    if (!objectID.isValid(req.params.id)) {
      return res.status(400).send("ID inconnu : " + req.params.id);
    }

    const user = await userModel.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé.");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Erreur serveur : " + err);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    // verification ID
    if (!objectID.isValid(req.params.id)) {
      return res.status(400).send("ID inconnu : " + req.params.id);
    }

    // MAJ utilisateur
    const user = await userModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      {
        new: true,
        upsert: false,
        setDefaultsOnInsert: true,
      }
    );

    // Vérification si l'utilisateur a été trouvé
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé.");
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    res
      .status(500)
      .json({ error: "Une erreur est survenue lors de la mise à jour." });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    // verification ID
    if (!objectID.isValid(req.params.id)) {
      return res.status(400).send("ID inconnu : " + req.params.id);
    }

    await userModel.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted." });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
module.exports.follow = async (req, res) => {
  try {
    // verification ID
    if (
      !objectID.isValid(req.params.id) ||
      !objectID.isValid(req.body.idToFollow)
    ) {
      return res.status(400).send("ID inconnu : " + req.params.id);
    }

    //add to the follower list
    const follower = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { following: req.body.idToFollow },
      },
      { new: true, upsertm: true }
    );

    //add to following list
    const following = await userModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsertm: true }
    );

    res.status(200).json(follower);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
module.exports.unfollow = async (req, res) => {
  try {
    // verification ID
    if (
      !objectID.isValid(req.params.id) ||
      !objectID.isValid(req.body.idToUnfollow)
    ) {
      return res.status(400).send("ID inconnu : " + req.params.id);
    }

    //delete to the follower list
    const follower = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { following: req.body.idToUnfollow },
      },
      { new: true, upsertm: true }
    );

    //delete to following list
    const following = await userModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsertm: true }
    );

    res.status(200).json(follower);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
