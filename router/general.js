const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');
const BASE_URL = 'http://localhost:5000';

// Task 10: Get all books using async-await and Axios
public_users.get('/async-books', async (req, res) => {
    try {
      const response = await axios.get(`${BASE_URL}/`);
      res.status(200).send(response.data);
    } catch (err) {
      res.status(500).json({ message: "Error fetching books", error: err.message });
    }
  });

  // Task 11: Get book by ISBN using Promise callback and Axios
public_users.get('/async-isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`${BASE_URL}/isbn/${isbn}`)
      .then(response => res.status(200).send(response.data))
      .catch(error => res.status(404).json({ message: "Book not found", error: error.message }));
  });

  // Task 12: Get books by author using async-await
public_users.get('/async-author/:author', async (req, res) => {
    try {
      const response = await axios.get(`${BASE_URL}/author/${req.params.author}`);
      res.status(200).json(response.data);
    } catch (err) {
      res.status(404).json({ message: "Author not found", error: err.message });
    }
  });

  // Task 13: Get books by title using Promise callback
public_users.get('/async-title/:title', (req, res) => {
    const title = req.params.title;
    axios.get(`${BASE_URL}/title/${title}`)
      .then(response => res.status(200).json(response.data))
      .catch(error => res.status(404).json({ message: "Title not found", error: error.message }));
  });
  
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    const userExists = users.some(user => user.username === username);
  
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
  });
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let matchingBooks = [];
  
    for (let key in books) {
      if (books[key].author === author) {
        matchingBooks.push({ isbn: key, ...books[key] });
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let matchingBooks = [];
  
    for (let key in books) {
      if (books[key].title === title) {
        matchingBooks.push({ isbn: key, ...books[key] });
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  });
  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Reviews not found for this book" });
    }
  });
  

module.exports.general = public_users;
