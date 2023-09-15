const mongoose = require('mongoose');
require('dotenv').config();

exports.mongooseConnect = async () => {
  const uri = `${process.env.MONGODB_ROOT}${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}${process.env.MONGODB_URI_PART}?retryWrites=true&w=majority`;
  const msg = "Connexion à MongoDB ";

  try {
    const connect = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const resLog = await console.log(`${msg}réussie !`);
  }
  catch (error) {
    const errLog = await console.log(`${msg}échouée ! - ${error}`);
  }
}
