const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  try {
    const post = await PostModel.find().sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).send("Error to get data : " + err);
  }
};

module.exports.createPost = async (req, res) => {
  if (!req.file) {
    throw new Error("No file provided");
  }

  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file != null ? "uploads/post/" + req.file.filename : "",
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

module.exports.likePost = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID inconnu : " + req.params.id);
    }

    const likers = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true }
    );

    if (!likers) {
      return res.status(404).send("Aucun likers trouvé avec cet ID.");
    }

    const likes = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true }
    );

    if (!likes) {
      return res.status(404).send("Aucun likes trouvé avec cet ID.");
    }

    res.send(likes);
  } catch (err) {
    console.error("Erreur :", err);
    return res.status(400).send(err);
  }
};

module.exports.unlikePost = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID inconnu : " + req.params.id);
    }

    const likers = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true }
    );

    if (!likers) {
      return res.status(404).send("Aucun likers trouvé avec cet ID.");
    }

    const likes = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true }
    );

    if (!likes) {
      return res.status(404).send("Aucun likes trouvé avec cet ID.");
    }

    res.send(likes);
  } catch (err) {
    console.error("Erreur :", err);
    return res.status(400).send(err);
  }
};

module.exports.commentPost = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID inconnu : " + req.params.id);
    }

    const comment = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    ).lean();

    if (!comment) {
      return res.status(404).send("Post introuvable");
    }

    res.send(comment);
  } catch (err) {
    console.error("Erreur :", err);
    return res.status(400).send(err);
  }
};

module.exports.editCommentPost = async (req, res) => {
  const postId = req.params.id;
  const { commentId, text } = req.body;

  if (!ObjectID.isValid(postId)) {
    return res.status(400).send(`Invalid ID: ${postId}`);
  }

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    const comment = post.comments.find((comment) =>
      comment._id.equals(commentId)
    );

    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    comment.text = text;

    await post.save();

    return res.status(200).send(comment);
  } catch (err) {
    console.error("Error updating comment:", err);
    return res.status(500).send(err);
  }
};

module.exports.deleteCommentPost = async (req, res) => {
  const postId = req.params.id;
  const { commentId } = req.body;

  if (!ObjectID.isValid(postId)) {
    return res.status(400).send(`Invalid ID: ${postId}`);
  }

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $pull: {
          comments: { _id: commentId },
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send("Post not found");
    }

    return res.status(200).send(updatedPost);
  } catch (err) {
    console.error("Error deleting comment:", err);
    return res.status(500).send(err);
  }
};
