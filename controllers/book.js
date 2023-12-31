const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Book = require('../models/book');

// CREATION d'un livre
exports.createBook = async (req, res, next) => {
  try {
    const bookObject = await JSON.parse(req.body.book);
    delete await bookObject._id;
    delete await bookObject._userId;

    const book = await new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    await book.save();
    await res.status(201).json({
      message: 'Post saved successfully!'
    });
  }
  catch (error) {
    await res.status(400).json({ error });
  }
};

// AJOUT d'une note
exports.newRating = async (req, res, next) => {
  try {
    // 01. CREATION de l'objet "book", depuis son "id"
    const book = await Book.findOne({ _id: req.params.id });

    // 02. COMPARAISON entre les userId de "book.ratings" et du localstorage
    const isUserIdExist = await book.ratings
      .some((item) => item.userId === req.auth.userId);
    if (isUserIdExist) {
      return await res.status(400).json({ error });
    }

    // 03. AJOUT d'un nouvel objet dans "book.ratings"
    await book.ratings.push({
      userId: req.auth.userId,
      grade: req.body.rating
    });

    // 04. MODIFICATION de "book.averageRating"
    const newAverageRating = await book.ratings.reduce((acc, curr) => acc + curr.grade, 0)/book.ratings.length;
    book.averageRating = await newAverageRating;

    // 05. MISE A JOUR de "book"
    try {
      await Book.updateOne({ _id: req.params.id }, { ...book.toObject() })
      await res.status(200).json(book);
    }
    catch (error) {
      await res.status(401).json({ error });
    }
  }
  catch (error) {
    await res.status(400).json({ error });
  }
};

// RECUPERATION d'un livre par son ID
exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id
    });
    await res.status(200).json(book);
  }
  catch (error) {
    await res.status(404).json({ error });
  }
};

// EDITION d'un livre
exports.modifyBook = async (req, res, next) => {
  try {
    const bookObject = await req.file
      ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
      : { ...req.body };

    delete await bookObject._userId;
    const book = await Book.findOne({ _id: req.params.id });
    if (book.userId != req.auth.userId) {
      await res.status(401).json({ message : 'Not authorized' });
    }
    else {
      try {
        await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        await res.status(200).json({ message : 'Objet modifié!' });
      }
      catch (error) {
        await res.status(401).json({ error });
      }
    }
  }
  catch (error) {
    await res.status(400).json({ error });
  }
};

// SUPPRESSION d'un livre
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id});

    if (book.userId != req.auth.userId) {
      await res.status(401).json({message: 'Not authorized'});
    }
    else {
      const filename = await book.imageUrl.split('/images/')[1];
      await fs.unlink(`images/${filename}`, async () => {
        try {
          await Book.deleteOne({_id: req.params.id});
          await res.status(200).json({message: 'Objet supprimé !'});
        }
        catch (error) {
          await res.status(401).json({ error });
        }
      });
    }
  }
  catch (error) {
    await res.status(500).json({ error });
  }
};

// RECUPERATION de la liste des livres
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    await res.status(200).json(books);
  }
  catch (error) {
    await res.status(400).json({ error });
  }
};

// RECUPERATION des 3 livres ayants les meilleures notes moyennes
exports.getBestRatingBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    const booksFiltered = [];

    for (let i = 0; i < 3; i++) {
      const bookFiltered = books.reduce((max, curr) => curr.averageRating > max.averageRating ? curr : max);
      const index = books.indexOf(bookFiltered)
      booksFiltered.push(bookFiltered)
      books.splice(index, 1);
    }
    await res.status(200).json(booksFiltered);
  }
  catch (error) {
    await res.status(400).json({ error });
  }
};