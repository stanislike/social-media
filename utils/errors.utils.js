module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.message.includes("pseudo")) {
    errors.pseudo = "Pseudo incorrect ou déjà pris";
  }
  if (err.message.includes("email")) {
    errors.email = "Email incorrect ou déjà pris";
  }
  if (err.message.includes("password")) {
    errors.password = "Le mot de passe doit faire 6 caractères minimum";
  }

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo")) {
    errors.pseudo = "Ce pseudo est déjà pris";
  }
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email")) {
    errors.email = "Cet email est déjà enregistré";
  }

  return errors;
};

module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email")) {
    errors.email = "Cet email n'existe pas";
  }
  if (err.message.includes("password")) {
    errors.password = "Le mot de passe ne correspond pas";
  }

  return errors;
};

module.exports.uploadErrors = (err) => {
  let errors = {};

  if (err.message.includes("invalid file")) {
    errors.format =
      "Unsupported file format. Allowed formats are JPG, PNG, and JPEG.";
  }

  if (err.message.includes("max size")) {
    errors.size = "File size exceeds the maximum limit of 500 KB.";
  }

  // Si aucune erreur spécifique n'est trouvée
  if (Object.keys(errors).length === 0) {
    errors.general = "An unexpected error occurred.";
  }

  return errors;
};
