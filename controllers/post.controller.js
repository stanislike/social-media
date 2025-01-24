const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  try {
    const post = await PostModel.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).send("Error to get data : " + err);
  }
};

module.exports.createPost = async (req, res) => {
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(200).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updatePost = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID inconnu : " + req.params.id);
    }

    const updatedRecord = {
      message: req.body.message,
    };

    const result = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord },
      { new: true }
    );

    if (!result) {
      return res.status(404).send("Aucun enregistrement trouvé avec cet ID.");
    }

    res.send(result);
  } catch (err) {
    console.error("Erreur :", err);
    return res.status(400).send(err);
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID inconnu : " + req.params.id);
    }

    const result = await PostModel.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).send("Aucun enregistrement trouvé avec cet ID.");
    }

    res.send(result);
  } catch (err) {
    console.error("Erreur :", err);
    return res.status(400).send(err);
  }
};
