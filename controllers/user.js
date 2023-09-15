const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');

// CREATION DE COMPTE
exports.signup = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await new User({
      email: req.body.email,
      password: hash
    });
    const userSaved = await user.save();
    await res.status(201).json({ message: 'Utilisateur créé !' });
  }
  catch (error) {
    await res.status(400).json({ error });
  }
};

// CONNEXION
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return await res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return await res.status(401).json({ error: 'Mot de passe incorrect !' });
    }

    res.status(200).json({
      userId: user._id,
      token: jwt.sign(
        { userId: user._id },
        process.env.MONGODB_TOKEN_KEY,
        { expiresIn: '24h' }
      )
    });
  }
  catch (error) {
    await res.status(500).json({ error });
  }
};