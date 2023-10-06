const sharp = require("sharp");
const fs = require("fs");
const path = require('path');

const compressImage = async (req, res, next) => {
  if (!req.file || !req.file.filename) {
    next();
    return;
  }
  const file = req.file;
  let { filename } = file;
  filename = `${req.file.filename.split('.')[0]}.webp`;

  try {
    await sharp(file.path)
      .resize(310, 445, { fit: 'cover' })
      .webp({ quality: 20 })
      .toFile(path.resolve(file.destination, filename));
    req.file.filename = filename;
    next();
  }
  catch (error) {
    res.status(400).json({ error });
  }
  finally {
    try {
      fs.unlinkSync(file.path);
    }
    catch (error) {
      res.status(400).json({ error });
    }
  }
};

module.exports =  compressImage;