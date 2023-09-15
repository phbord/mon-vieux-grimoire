const Book = require('../models/book');

// CREATION d'un livre
exports.createBook = (req, res, next) => {
  let userIdObj;
  if (req.body.ratings.userId) {
    userIdObj = {
      userId: req.body.ratings.userId,
      grade: req.body.ratings.grade,
    };
  }
  
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    genre: req.body.genre,
    userId: req.body.userId,
    ratings: [userIdObj],
    averageRating: req.body.averageRating,
  });
  book.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// AJOUT d'une note
exports.newRating = (req, res, next) => {
  //
};

// RECUPERATION d'un livre par son ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  }).then(
    (book) => {
      res.status(200).json(book);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// EDITION d'un livre
exports.modifyBook = (req, res, next) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    genre: req.body.genre,
    userId: req.body.userId,
    ratings: [{
      userId: req.body.ratings.userId,
      grade: req.body.ratings.grade,
    }],
    averageRating: req.body.averageRating,
  });
  Book.updateOne({_id: req.params.id}, book).then(
    () => {
      res.status(201).json({
        message: 'Book updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// SUPPRESSION d'un livre
exports.deleteBook = (req, res, next) => {
  Book.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// RECUPERATION de la liste des livres
exports.getAllBooks = async (req, res, next) => {
  /* const getBooks = async () => {
    try {
      const books = await Book.find();
      const resBooks = await res.status(200).json(books);
    }
    catch (error) {
      const errBooks = await res.status(400).json({
        error: error
      });
    }
  };
  getBooks(); */

  Book.find().then(
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// RECUPERATION des 3 livres ayants les meilleures notes moyennes
exports.getBestRatingBooks = (req, res, next) => {
  const getBooks = async () => {
    try {
      const books = await Book.find();
      const booksFiltered = [];

      for (let i = 0; i < 3; i++) {
        const bookFiltered = books.reduce((max, curr) => curr.averageRating > max.averageRating ? curr : max);
        const index = books.indexOf(bookFiltered)
        booksFiltered.push(bookFiltered)
        books.splice(index, 1);
      }
      //console.log('getBestRatingBooks => booksFiltered:', booksFiltered);
      const resBooks = await res.status(200).json(books);
    }
    catch (error) {
      const errBooks = await res.status(400).json({
        error: error
      });
    }
  };
  getBooks();
};